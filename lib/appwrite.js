
import * as FileSystem from 'expo-file-system';
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
  messagesCollectionId: "66a50c400026abe5f28b",   
  storageId: "6682bc3e001e2fed74b4",
  storageImageId: "66b526ce000cd3e83f62",
  storageProjectId:  "66b64df0000e194c9f43",
  projectsCollectionId : "66b59deb0000179074b5",
  infoUserCollectionId : "670aa1bf001fd2c12e95", 
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
      appwriteConfig.infoUserCollectionId,
    );
    console.log(response.documents)
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

// Generate File Preview or View URL
export const  getFilePreview = async (fileId, type)  => {   //generate a preview or view URL for a file stored in the Appwrite storage.   fileId: The unique ID of the file in the Appwrite storage.    type: The type of file (e.g., "image", "video", etc.).
  let fileUrl;

  try {

    if (type === "video") {
      fileUrl = storage.getFileView(appwriteConfig.storageId, fileId)
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(appwriteConfig.storageId,
        fileId,                                                                   //fileId: The unique ID of the file.
        2000, // Width
        2000, // Height
        "top", // Crop type
        100 // Quality
      );
    } else {
      throw new Error("Invalid file type provided for preview");
    }

    if (!fileUrl) throw Error;
    return fileUrl
  } catch (error) {
    throw new Error(`Failed to get file preview: ${error.message}`);
  }

}

export async function uploadFile(file, type) {                  //function is used to upload a file to the Appwrite storage and generate a URL for the uploaded file.    'file': The file object to be uploaded.
  if (!file) return null;   

  const { mimeType, ...rest } = file;
  const asset = {
  name:file.fileName,
  type:file.mimeType,
  size:file.fileSize,
  uri:file.uri
}
  

  try {
    const uploadedFile = await storage.createFile(              //uses the 'storage.createFile' method to upload the file to the Appwrite storage.
      appwriteConfig.storageId, // Bucket ID
      ID.unique(),                                                //'fileId': A unique ID generated for the file using 'ID.unique()'.
      asset // The file object
    );

    console.log("UPLOADED", uploadFile)



    const fileUrl = await getFilePreview(uploadedFile.$id, type);     //After a successful upload, it generates a URL for the file preview using the getFilePreview function based on the file type (image or video).
    return fileUrl; // Return the URL of the uploaded file
  } catch (error) {
    throw new Error(`Failed to upload file: ${error.message}`);
  }
}

export async function createPhotoProfile(imageUri, userId) {
  try {
  
    const fileName = imageUri.split('/').pop();                 // Extract the file name from the imageUri (which is the path to the image)

   
    const fileInfo = await FileSystem.getInfoAsync(imageUri);   // Get information about the file (like size) using FileSystem
    const fileSize = fileInfo.size;

    
    const file = {                                                // Create a file object containing name, type (set to 'image/png'), URI, and file size
      name: fileName,
      type: 'image/png', 
      uri: imageUri,
      size: fileSize,
    };

    
    console.log('Uploading file with details:', file);

    
    const fileId = `image_${userId}`;                            
    

    const response = await storage.createFile(          
      appwriteConfig.storageImageId,  
      fileId,                          
      file                          
    );

    
    console.log('File uploaded successfully:', response);


    const fileUrl = `${appwriteConfig.endpoint}/storage/buckets/${appwriteConfig.storageImageId}/files/${response.$id}/view?project=${appwriteConfig.projectId}&project=${appwriteConfig.projectId}&mode=admin`;


    // Query the database to find the user document that matches the given userId
    const userDocument = await databases.listDocuments(
      appwriteConfig.databaseId,          // Your Appwrite database ID
      appwriteConfig.infoUserCollectionId, // Collection ID where user info is stored
      [Query.equal('userId', userId)]      // Query condition to match the userId  
    );

    if (userDocument.documents.length > 0) {
      const userDocId = userDocument.documents[0].$id; // Get the document ID

      // Update the user's profile in the infoUser collection
      await databases.updateDocument(
        appwriteConfig.databaseId,                 // Your Appwrite database ID
        appwriteConfig.infoUserCollectionId,      // Your infoUser collection ID
        userDocId,                                 // Document ID from the query
        {
          photoProfile: fileUrl                     // Update the photoProfile field
        }
      );

      console.log('User photo profile updated successfully.');
    } else {
      console.log('No user found with the provided userId.');
    }

    return response;
  } catch (error) {
    console.error("Failed to create/update photo profile:", error);
    throw new Error(error.message);
  }
}

export const downloadPhotoProfile = async (userId) => {
  try {
    // Query the database to find the user document that matches the given userId
    const userDocument = await databases.listDocuments(
      appwriteConfig.databaseId,                // Your Appwrite database ID
      appwriteConfig.infoUserCollectionId,     // Collection ID where user info is stored
      [Query.equal('userId', userId)]          // Query condition to match the userId  
    );

    if (userDocument.documents.length > 0) {
      const userDocId = userDocument.documents[0].$id; // Get the document ID
      const photoProfileUrl = userDocument.documents[0].photoProfile; // Get the photo profile URL

      // Ensure the photoProfile URL is available
      if (photoProfileUrl) {
        // Download the image using Expo FileSystem
        const fileUri = `${FileSystem.documentDirectory}${userId}_profile_photo.png`; // Local path to save the file

        const { uri } = await FileSystem.downloadAsync(photoProfileUrl, fileUri);

        console.log('Image downloaded to:', uri);
        return uri; // Return the local URI of the downloaded image
      } else {
        console.log('No profile photo URL found for the user.');
        return null;
      }
    } else {
      console.log('No user found with the provided userId.');
      return null;
    }
  } catch (error) {
    console.error('Error downloading file from storage:', error);
    throw error;
  }
};

const getMimeType = (fileName) => {
  const extension = fileName.split('.').pop().toLowerCase();

  const supportedExtensions = {
    'pdf': 'application/pdf',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'heic': 'image/heic',
    "heif": "video/heif",
    'mov': 'video/quicktime',
    'mp4': 'video/mp4',
    'csv': 'text/csv',
    'png': 'image/png',
    'gif': 'image/gif',
    'bmp': 'image/bmp',
  };

  if (supportedExtensions[extension]) {
    return supportedExtensions[extension];
  } else {
    throw new Error(`Unsupported file format: ${extension}. Please ensure the file is in a supported format.`);
  }
};




//This function handles the uploading of a document to Appwrite storage and updates the associated project document with the file URL.
export const uploadDocumentToStorage = async (uris, userId) => {
  try {
    // Initialize an array to store the URLs of uploaded files
    const uploadedFileUrls = [];

    // Loop through each file URI and upload them
    for (let index = 0; index < uris.length; index++) {
      const uri = uris[index];

      // Extract file extension and create file name based on userId and index
      const extension = uri.split('.').pop();
      const fileName = `document_${userId}_${index}_${Date.now()}.${extension}`;
      const fileUri = FileSystem.documentDirectory + fileName;

      // Read the file content from the URI
      const fileContent = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Write the file content to the local file system
      await FileSystem.writeAsStringAsync(fileUri, fileContent, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Get file information
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      const fileSize = fileInfo.size;

      // Get MIME type based on file extension
      const mimeType = getMimeType(fileName);
      console.log(`MIME type: ${mimeType}`);

      // Create a file object for upload
      const file = {
        name: fileName,
        type: mimeType,
        uri: fileUri,
        size: fileSize,
      };

      // Create a valid file ID for storage
      const fileId = `document_${userId}_${index}`;

      // Upload the file to Appwrite storage
      const response = await storage.createFile(
        appwriteConfig.storageProjectId, // Appwrite storage bucket ID
        fileId, // File ID for Appwrite
        file // The file object
      );

      // Get the URL of the uploaded file
      const fileUrl = `${appwriteConfig.endpoint}/storage/buckets/${appwriteConfig.storageProjectId}/files/${response.$id}/view?project=${appwriteConfig.projectId}&mode=admin`;

      // Add the file URL to the array
      uploadedFileUrls.push(fileUrl);
    }

    // Check if a project document exists for the userId
    const existingProjectDocuments = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.infoUserCollectionId,
      [Query.equal('userId', userId)] // Adjust the query to match your database schema
    );

    let projectDocumentId;

    if (existingProjectDocuments.documents.length > 0) {
      // Update the existing project document with the new file URLs
      projectDocumentId = existingProjectDocuments.documents[0].$id; // Get the ID of the existing document

      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.infoUserCollectionId,
        projectDocumentId,
        {
          projects: [...(existingProjectDocuments.documents[0]?.projects || []), ...uploadedFileUrls], // Append new URLs
        }
      );

      console.log('Existing project document updated successfully.');
    } else {
      // Create a new project document with the uploaded document URLs
      const newProjectDocument = {
        userId: userId,
        projects: uploadedFileUrls, // Initialize the project array with the new file URLs
      };

      // Create the new project document in the database
      const newProjectDocumentResponse = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.infoUserCollectionId,
        ID.unique(),
        newProjectDocument
      );

      projectDocumentId = newProjectDocumentResponse.$id;

      console.log('New project document created successfully.');
    }

    console.log('All files uploaded and project document updated successfully.');
  } catch (error) {
    console.error('Error uploading documents or managing project:', error);
    throw error;
  }
};


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
