import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
  Permission,
  Role 
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1", // Appwrite Cloud endpoint
  platform: "com.jsm.INspired",
  projectId: "666b3ea2002b7cb544a6",
  databaseId: "6682b80a001d586f6a40",
  userCollectionId: "6682b842002632b0fa22",   // Users table
  videoCollectionId: "6682b89300070bd7a7b9",
  messagesCollectionId: "66a50c400026abe5f28b",   // Messages table
  storageId: "6682bc3e001e2fed74b4",
  storageImageId: "66b526ce000cd3e83f62",
  projectsCollectionId : "66b59deb0000179074b5",
  infoUserCollectionId : "66b7ed1b003970f094a0",  // InfoUser table
};

// Init your React Native SDK
const client = new Client()
  .setEndpoint(appwriteConfig.endpoint) // Appwrite Endpoint
  .setProject(appwriteConfig.projectId) // Project ID
  .setPlatform(appwriteConfig.platform); // Application ID or Bundle ID

// Initialize the Appwrite services
const account = new Account(client);
const avatars = new Avatars(client);
const storage = new Storage(client);
const databases = new Databases(client);

// Create a new user and send verification email
export async function createUser(email, password, username) {
  try {
    // Create a new account
    const newAccount = await account.create(ID.unique(), email, password, username);

    if (!newAccount) throw new Error("Failed to create new account");

    // Send verification email
   // await account.createVerification(newAccount.$id);

    // Optionally, create user document in the database
    const avatarUrl = avatars.getInitials(username);
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        userId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );

    return newAccount;
  } catch (error) {
    throw new Error(`createUser Error: ${error.message}`);
  }
}

// Verify the email with the provided code
export async function verifyEmail(verificationCode) {
  try {
    await account.updateEmailVerification(verificationCode);
  } catch (error) {
    throw new Error(`verifyEmail Error: ${error.message}`);
  }
}

export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    throw new Error(error);
  }
}

// Get Current User
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw new Error("No current account found");

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("userId", currentAccount.$id)]
    );

    if (!currentUser.documents.length) throw new Error("No user document found");

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Sign In
export async function signIn(email, password) {
  try {
    return await account.createEmailPasswordSession(email, password);
  } catch (error) {
    throw new Error(`signIn Error: ${error.message}`);
  }
}

// Sign Out
export async function logOut() {
  try {
    return await account.deleteSession("current");
  } catch (error) {
    throw new Error(`logOut Error: ${error.message}`);
  }
}


export const updateUserAttribute = async (userId, attributeName, value) => {
  try {
    // Prepare the object to be updated or created
    const fieldsToUpdate = {
      [attributeName]: value,
    };

    // Check if the document exists
    const userDocuments = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.infoUserCollectionId,
      [Query.equal('userId', userId)]
    );

    if (userDocuments.documents.length > 0) {
      // Document exists, update it
      const userDocument = userDocuments.documents[0];
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.infoUserCollectionId,
        userDocument.$id,
        fieldsToUpdate
      );
    } else {
      // Document does not exist, create it
      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.infoUserCollectionId,
        'unique()', // Generate a unique ID for the new document
        {
          userId, // Include userId in the new document
          ...fieldsToUpdate
        }
      );
    }
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
};



export const getUserAttributes = async (userId) => {
  try {
    const userDocuments = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.infoUserCollectionId,
      [Query.equal('userId', userId)]
    );

    if (userDocuments.documents.length > 0) {
      return userDocuments.documents[0];
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    throw new Error(`getUserAttributes Error: ${error.message}`);
  }
};


export const uploadFile = async (imageUri, fileType) => {
  try {
    // Fetch the image as a blob
    const response = await fetch(imageUri);
    const blob = await response.blob();

    // Create a unique file ID (optional)
    const fileId = `${Date.now()}_${fileType}`;

    // Upload the file to Appwrite storage
    const file = await storage.createFile(
      appwriteConfig.storageId, // Replace with your actual bucket ID
      fileId,
      blob
    );

    // Generate the URL for the uploaded image
    const fileUrl = storage.getFileView(appwriteConfig.storageId, file.$id);

    return fileUrl;
  } catch (error) {
    console.error("Failed to upload file:", error);
    throw new Error("File upload failed");
  }
};

export async function getFilePreview(fileId, type) {
  try {
    let fileUrl;
    if (type === "video") {
      fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid file type");
    }

    return fileUrl;
  } catch (error) {
    console.error("Failed to get file preview:", error);
    throw new Error(error.message);
  }
}

export async function createPhotoProfile(imageUri, userId) {
  try {
    const imageUrl = await uploadFile(imageUri, "image");

    const userDocuments = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('userId', userId)]
    );

    if (userDocuments.documents.length > 0) {
      const userDocument = userDocuments.documents[0];

      const updatedProfile = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        userDocument.$id,
        { photoProfile: imageUrl },
        [Permission.update(Role.any())]
      );

      return updatedProfile;
    } else {
      throw new Error("User document not found");
    }
  } catch (error) {
    console.error("Failed to create/update photo profile:", error);
    throw new Error(error.message);
  }
}

export async function createProjects(fileUri) {
  try {
    const projectUrl = await uploadFile(fileUri, "pdf");

    const newProject = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.projectsCollectionId,
      ID.unique(),
      {
        projectOne: projectUrl,
      }
    );

    return newProject;
  } catch (error) {
    console.error("Failed to create project:", error);
    throw new Error(error.message);
  }
}

// Fetch messages
export const getMessages = async () => {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      [Query.orderDesc('$createdAt'), Query.limit(20)]
    );
    return response.documents;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

// Send a message
export const sendMessage = async (senderId, receiverId, messageBody) => {
  const payload = {
    sender_id: senderId,
    receiver_id: receiverId,
    body: messageBody,
    timestamp: new Date().toISOString(),
  };

  try {
    const response = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      ID.unique(),
      payload
    );
    return response;
  } catch (error) {
    console.error('Error creating document:', error);
    throw error;
  }
};

// Delete a message
export const deleteMessage = async (messageId) => {
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      messageId
    );
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
};
