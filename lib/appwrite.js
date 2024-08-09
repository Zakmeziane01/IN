import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1", // Appwrite Cloud endpoint
  platform: "com.jsm.INspired",
  projectId: "666b3ea2002b7cb544a6",
  databaseId: "6682b80a001d586f6a40",
  userCollectionId: "6682b842002632b0fa22",
  videoCollectionId: "6682b89300070bd7a7b9",
  messagesCollectionId: "66a50c400026abe5f28b",
  storageId: "6682bc3e001e2fed74b4",
  storageImageId: "66b526ce000cd3e83f62",
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
        accountid: newAccount.$id,
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
      [Query.equal("accountid", currentAccount.$id)]
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
    // Prepare the object to be updated with dynamic keys
    const fieldsToUpdate = {
      [attributeName]: value,
    };

    const userDocuments = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountid', userId)]
    );

    if (userDocuments.documents.length > 0) {
      // Document exists, update it
      const userDocument = userDocuments.documents[0];
      await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userDocument.$id,  
      fieldsToUpdate
    );}
  } catch (error) {
    throw new Error(`updateUserAttribute Error: ${error.message}`);
  }
};

export const getUserAttributes = async (userId) => {
  try {
    const userDocuments = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountid', userId)]
    );

    if (userDocuments.documents.length > 0) {
      // Return the first document (assuming account ID is unique)
      return userDocuments.documents[0];
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    throw new Error(`getUserAttributes Error: ${error.message}`);
  }
};



export async function uploadFile(file, type) {
  if (!file) return;

  const { mimeType, ...rest } = file;
  const asset = { type: mimeType, ...rest };

  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

export async function uploadImage(imageUri, options = {}) {
  if (!imageUri) throw new Error("No image selected");

  try {
    // Optional: Resize or compress the image before uploading
    let manipulatedImage = imageUri;
    if (options.resize || options.compress) {
      const manipulatedResult = await ImageManipulator.manipulateAsync(
        imageUri,
        options.resize ? [{ resize: options.resize }] : [],
        options.compress ? { compress: options.compress } : {}
      );
      manipulatedImage = manipulatedResult.uri;
    }

    // Extract the filename from the image URI
    const filename = imageUri.split('/').pop();

    const response = await fetch(manipulatedImage);
    const blob = await response.blob();

    // Upload the image to Appwrite
    const uploadedImage = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      new File([blob], filename, { type: blob.type })
    );

    // Generate a preview URL or a download URL
    const imageUrl = await getFilePreview(uploadedImage.$id, 'image');
    return imageUrl;
  } catch (error) {
    throw new Error(`uploadImage Error: ${error.message}`);
  }
}


//whole the id and information that we need to hook up to our app write Claoud are here.
//now we are ready to start connecting to our app write client which allow us to createuser, aplaod videos, make relations between them and update files to our storage. 