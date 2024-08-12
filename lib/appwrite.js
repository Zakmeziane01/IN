import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
  Permission,
  Role, 
  AppwriteException
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1", 
  platform: "com.jsm.INspired",
  projectId: "666b3ea2002b7cb544a6",
  databaseId: "6682b80a001d586f6a40",
  userCollectionId: "6682b842002632b0fa22",  
  videoCollectionId: "6682b89300070bd7a7b9",
  messagesCollectionId: "66a50c400026abe5f28b",   
  storageId: "6682bc3e001e2fed74b4",
  storageImageId: "66b526ce000cd3e83f62",
  projectsCollectionId : "66b59deb0000179074b5",
  infoUserCollectionId : "66b7ed1b003970f094a0", 
  matchCollectionID: "66b9194800378226f5e2", 
  conversationsCollectionId:  "66b96c16001fb3961cfe",
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

// function get all the user for infoUser
export async function getAllUsers() {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.infoUserCollectionId
    );

    return response.documents; // This will return an array of user documents
  } catch (error) {
    console.error(`Error getting all users: ${error.message}`);
    throw new Error(`Error getting all users: ${error.message}`);
  }
}

// matchining between users 
export async function addMatch(userId1, userId2) {

  try {
    const matchId = ID.unique(); 
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.matchCollectionID,
      matchId,
      {
        match_id: matchId,
        user1_id: userId1,
        user2_id: userId2,
        match_date: new Date().toISOString(), // Current date in ISO format
      }
    );
    console.log("Match created successfully");
  } catch (error) {
    console.error("Error creating match:", error);
  }
};

// Function to create a chat room
export async function  createChatRoom  (userId1, userId2) {
  try {
    const chatRoomId = ID.unique(); 
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.conversationsCollectionId, 
      chatRoomId,
      {
        chatRoomId: chatRoomId,
        user1Id: userId1,
        user2Id: userId2,
        createdAt: new Date().toISOString(),
      }
    );
    console.log("Chat room created successfully");
    return chatRoomId;
  } catch (error) {
    console.error("Error creating chat room:", error);
    return null;
  }
};

// New function to check if a match already exists
export const checkMatchExists = async (userId, matchedUserId) => {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.matchCollectionID, 
      [
      Query.equal("user1_id", userId),
      Query.equal("user2_id", matchedUserId)
    ]);

    return response.documents.length > 0;
  } catch (error) {
    console.error("Error checking match existence:", error);
    throw error;
  }
};

// Fetch conversations for the current user
export const fetchUserConversations = async (userId) => {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.conversationsCollectionId,
      [Query.equal('user1Id', userId)] 
    );

    // Ensure that response.documents is an array
    return Array.isArray(response.documents) ? response.documents : [];
  } catch (error) {
    console.error("Error fetching user conversations:", error);
    throw new Error("Failed to fetch user conversations");
  }
};


// Fetch conversations with user details  //  litel differnte vesion form above oen which can help  for nwo 
const fetchConversationsWithUserDetails = async (userId) => {
  try {
    const userConversations = await fetchUserConversations(userId);

    if (!Array.isArray(userConversations)) {
      throw new Error('Invalid data format');
    }

    // Fetch user details for each conversation
    const allUsers = await getAllUsers();
    const userMap = new Map(allUsers.map(user => [user.$id, user.name])); // Map userId to userName

    return userConversations.map(convo => ({
      ...convo,
      otherUserName: convo.user1Id === userId ? userMap.get(convo.user2Id) : userMap.get(convo.user1Id),
    }));
  } catch (error) {
    console.error('Error fetching conversations with user details:', error);
    throw error;
  }
};


// New function to get chat room ID if it exists
export const getChatRoomId = async (userId1, userId2) => {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId, 
      appwriteConfig.conversationsCollectionId, 
      [
      Query.equal("user1Id", [userId1, userId2]),
      Query.equal("user2Id", [userId2, userId1]) 
    ]);

    return response.documents.length > 0 ? response.documents[0].$id : null;
  } catch (error) {
    console.error("Error getting chat room ID:", error);
    throw error;
  }
};


// Function to fetch messages
export const fetchMessages = async (chatRoomId) => {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      [Query.equal("chatRoomId", chatRoomId)]
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw new Error(`Error fetching messages: ${error.message}`);
  }
};

// Function to send a new message
export const sendMessage = async (chatRoomId, senderId, content) => {
  try {
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      ID.unique(),
      {
        chatRoomId,
        senderId,
        content,
        timestamp: new Date().toISOString()
      }
    );
    console.log("Message sent successfully");
  } catch (error) {
    console.error("Error sending message:", error);
    throw new Error(`Error sending message: ${error.message}`);
  }
};






export async function uploadFile(file, type) {
  if (!file) return null;

  const { mimeType, ...rest } = file;
  const asset = { type: mimeType, ...rest };

  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId, // Bucket ID
      ID.unique(), // Generate a unique ID for the file
      asset // The file object
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl; // Return the URL of the uploaded file
  } catch (error) {
    throw new Error(`Failed to upload file: ${error.message}`);
  }
}



// Generate File Preview or View URL
export async function getFilePreview(fileId, type) {
  try {
    let fileUrl;

    if (type === "video") {
      fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000, // Width
        2000, // Height
        "top", // Crop type
        100 // Quality
      );
    } else {
      throw new Error("Invalid file type provided for preview");
    }

    return fileUrl;
  } catch (error) {
    throw new Error(`Failed to get file preview: ${error.message}`);
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
