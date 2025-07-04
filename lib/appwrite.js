
import * as FileSystem from 'expo-file-system';
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage
} from "react-native-appwrite";

import * as AuthSession from 'expo-auth-session'

export const appwriteConfig = {
  endpoint: "https://fra.cloud.appwrite.io/v1", 
  platform: "com.co.inspired",
  projectId: "68595eda001fd84083a0",

  databaseId: "685963bd003bd7f7396a",
  userCollectionId: "685974b2002a3d9ebb09",  
  infoUserCollectionId : "685978620028f600807d", 
  projectsCollectionId : "68597897001e90862e8e",
  rejectionCollectionId:"685978c60002ab1f02ba",
  storageProjectId:  "68597d3b000ff1303d72",

  groupCollectionId: "685981350022ca4e2a57",
  chatroomCollectionId:"6859817600045a160402",
  messagesCollectionId:"685981ac0032befc07e6",
  videoCollectionId:"685981e20005bbc58a13",

  //storageId: "6682bc3e001e2fed74b4",   need to upda appwrite plan 
  //storageImageId: "66b526ce000cd3e83f62",  need to updat appwrite plan 

  //messagesCollectionId: "66a50c400026abe5f28b",   
  //matchCollectionID: "66b9194800378226f5e2", 
  //conversationsCollectionId:  "66b96c16001fb3961cfe",

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
export const databases = new Databases(client);

export default client;

export const googleOAuth = async () => {
  const redirectUri = AuthSession.makeRedirectUri({
    useProxy: true,
  });

  console.log(redirectUri)

  const authUrl = client.buildUrl(
    `/account/sessions/oauth2/google`,
    {
      success: redirectUri,
      failure: redirectUri,
    }
  );

  const result = await AuthSession.startAsync({authUrl});

    if (result.type === 'success') {
      // Fetch the user's account details
      try {
          const userDetails = await account.get();
          setUser(userDetails);
      } catch (error) {
          console.error('Failed to get user details', error);
      }
    } else {
        console.error('OAuth failed', result);
    }


}

// Create a new user and send verification email
export async function createUser(email, password, username) {
  try {
    // Create a new account
    const newAccount = await account.create(
      ID.unique(), email, password, username);

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

/**
 * Asynchronously retrieves the current account information.
 * @returns {Promise} A promise that resolves with the current account information.
 * @throws {Error} If there is an error while retrieving the account information.
 */
export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * Retrieves the current user from the database based on the current account.
 * @returns {Promise<Object>} A promise that resolves to the current user object.
 * If no current account is found or no user document is found, it returns null.
 */
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

/**
 * Updates a user attribute in the database with the provided userId, attributeName, and value.
 * If the user document exists, it updates the specified attribute. If not, it creates a new document
 * with the userId and attribute.
 * @param {string} userId - The unique identifier of the user.
 * @param {string} attributeName - The name of the attribute to update.
 * @param {any} value - The new value of the attribute.
 * @returns {Promise<void>} A promise that resolves when the update or creation is completed.
 * @throws {Error} If there is an error during the update or creation process.
 */
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

/**
 * Retrieves user attributes from the database based on the provided userId.
 * @param {string} userId - The unique identifier of the user.
 * @returns {Promise<Object>} A promise that resolves to the user attributes document.
 * @throws {Error} If the user is not found or an error occurs during the retrieval process.
 */
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

/**
 * Retrieves all users from the specified database collection. (infoUser).
 * @returns {Promise<Array>} A promise that resolves to an array of user documents.
 * @throws {Error} If there is an error retrieving the users.
 */
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

// matchining between users           //DELETE
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

/**
 * Retrieves a preview of a file based on the file ID and type provided.
 * @param {string} fileId - The ID of the file to retrieve the preview for.
 * @param {string} type - The type of the file (e.g., "video", "image").
 * @returns {Promise<string>} A URL pointing to the file preview.
 * @throws {Error} If an invalid file type is provided or if there is an error retrieving the preview.
 */
// Generate File Preview or View URL
export const  getFilePreview = async (fileId, type)  => {       //generate a preview or view URL for a file stored in the Appwrite storage.   fileId: The unique ID of the file in the Appwrite storage.    type: The type of file (e.g., "image", "video", etc.).
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

/**
 * Uploads a file to the specified storage location.
 * @param {Object} file - The file object to be uploaded.
 * @param {string} type - The type of the file to be uploaded.
 * @returns {string} The URL of the uploaded file.
 * @throws {Error} If the file upload fails.
 */
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

/**
 * Creates or updates a photo profile for a user with the provided image URI and user ID.
 * @param {string} imageUri - The URI of the image to be used as the photo profile.
 * @param {string} userId - The ID of the user for whom the photo profile is being created or updated.
 * @returns {Promise} A Promise that resolves with the response from the storage service after uploading the file.
 * @throws {Error} If there is an error during the process of creating or updating the photo profile.
 */
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

/**
 * Downloads the profile photo of a user from the database using the provided userId.
 * @param {string} userId - The unique identifier of the user.
 * @returns {string | null} The URI of the downloaded profile photo or null if no photo found.
 * @throws {Error} If there is an error downloading the file from storage.
 */
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

/**
 * Gets the MIME type of a file based on its extension.
 * @param {string} fileName - The name of the file including its extension.
 * @returns {string} The MIME type of the file.
 * @throws {Error} If the file extension is not supported.
 */
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

/**
 * Uploads documents to storage and manages project documents for a given user.
 * @param {string[]} uris - An array of URIs for the documents to upload.
 * @param {string} userId - The ID of the user uploading the documents.
 * @returns None
 * @throws {Error} If there is an error uploading documents or managing project documents.
 */
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


/**
 * Creates a new project by uploading a file to a specified URL and creating a new document in the database.
 * @param {string} fileUri - The URI of the file to upload.
 * @returns {Promise} A promise that resolves to the newly created project document.
 * @throws {Error} If there is an error creating the project, an error is thrown with the error message.
 */
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


/**
 * Updates the list of rejected users for a given user in the database.
 * @param {string} currentUserId - The ID of the current user.
 * @param {string} rejectedUserId - The ID of the user to be added to the rejected list.
 * @returns None
 * @throws Error if there is an issue updating the rejected users.
 */
export const updateRejectedUsers = async (currentUserId, rejectedUserId) => {
  try {
    // Step 1: Retrieve the current user's document from the infoUser collection
    const userDocuments = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.infoUserCollectionId,  // Assuming this is the ID for the infoUser collection
      [Query.equal('userId', currentUserId)]
    );

    // If user exists in infoUser collection, proceed with updating rejection
    if (userDocuments.documents.length > 0) {
      // Step 2: Now, check if a rejection document for the user exists in the rejection collection
      const rejectionDocuments = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.rejectionCollectionId,
        [Query.equal('userId', currentUserId)]
      );

      if (rejectionDocuments.documents.length > 0) {
        // If a rejection document exists, update it
        const rejectionDocument = rejectionDocuments.documents[0];
        const updatedRejectedUsers = new Set(rejectionDocument.rejectedUsers);
        updatedRejectedUsers.add(rejectedUserId);

        await databases.updateDocument(
          appwriteConfig.databaseId,
          appwriteConfig.rejectionCollectionId,
          rejectionDocument.$id,
          { rejectedUsers: Array.from(updatedRejectedUsers) }
        );
      } else {
        // If no rejection document exists, create a new one
        await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.rejectionCollectionId,
          'unique()',
          {
            userId: currentUserId,
            rejectedUsers: [rejectedUserId]
          }
        );
      }
    } else {
      throw new Error(`User with ID ${currentUserId} not found in infoUser collection.`);
    }
  } catch (error) {
    console.error(`Error updating rejected users: ${error.message}`);
    throw new Error(`Error updating rejected users: ${error.message}`);
  }
};



export const createChatroom = async (user1Id,user2Id) => {
  try {
    const newChatroom = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.chatroomCollectionId,
      ID.unique(),
      {
        chatroomUserIds: [user1Id, user2Id],
        progressBar: "interest",
        requestAuthor: user1Id
      }
  );
  
  console.log(newChatroom)

  return newChatroom.$id
  } catch (error) {
     console.log(error)
     throw new Error(error); 
  }
}

export const addUsertoChat = async (chatroomId, userId, groupName) =>{
  try {
    const currentAccount = await account.get();
    
    if(!currentAccount) throw Error;
    
    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    )
    
    if(!currentUser) throw Error;
    let currentUserId = currentUser.documents[0].$id;
    
  const PrevData = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.chatroomCollectionId,
    [Query.equal("$id",chatroomId)]
  );
  console.log(PrevData)
  if(!PrevData) throw Error
  // console.log(PrevData)
  // console.log(PrevData.documents[0].chatroomUserIds)
  const existingUserIds = PrevData.documents[0].chatroomUserIds;
      if (!existingUserIds.includes(userId)) {
      const newIds = [...existingUserIds, userId];
      // console.log(newIds)
      const newGroup = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.groupCollectionId,
        ID.unique(),
        {
          groupName: groupName,
          groupAdminId: currentUserId
        }
      );
      console.log(newGroup.$id)
      const updated = await databases.updateDocument(
        appwriteConfig.databaseId, // databaseId
        appwriteConfig.chatroomCollectionId, // collectionId
        chatroomId,
        {
          chatroomUserIds: newIds,
          groupId: newGroup.$id 
        }, // data (optional)
        // permissions (optional)
      );
      console.log(updated)
      console.log('person added!')

      if(!newGroup) throw Error;
    } else {
      console.log('User is already in the chatroom');
    }
  } catch (error) {
    console.log(error);
  }
}

export const getUserChatrooms = async () => {
  try {
    // console.log("it ran")
    const currentAccount = await account.get();
    
    if(!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    )
    //console.log(currentUser.documents[0].$id)
    if(!currentUser) throw Error;

    
    const currentUserChatrooms = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.chatroomCollectionId,
      [Query.contains('chatroomUserIds', currentUser.documents[0].$id)]
    )
      const ids = currentUserChatrooms.documents;
      // console.log(ids)



    if(!currentUserChatrooms) 
      throw Error;

    return currentUserChatrooms.documents;

  } catch (error) {
    console.log(error);
  }
}

export const getUserInterest = async () => {
  try {
    // console.log("it ran")
    const currentAccount = await account.get();
    
    if(!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    )
    //console.log(currentUser.documents[0].$id)
    if(!currentUser) throw Error;

    
    const currentUserChatrooms = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.chatroomCollectionId,
      [Query.contains('chatroomUserIds', currentUser.documents[0].$id),
      Query.equal('progressBar','interest')]
    )
      const ids = currentUserChatrooms.documents;
      // console.log(ids)



    if(!currentUserChatrooms) 
      throw Error;

    return currentUserChatrooms.documents;

  } catch (error) {
    console.log(error);
  }
}

export const getEnk = async () => {
  try {
    //  console.log(userId)
    const enk = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("username", "enk")]
    )
    let mkey = enk.documents[0].accountId
    return mkey

  } catch (error) {
    console.log(error);
  }
}

export const updateLastOnline = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    );
    if (!currentUser) throw Error;

    const userId = currentUser.documents[0].$id;
    const lastOnline = new Date().toISOString();
    // console.log(lastOnline)

    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId,
      { lastonline: lastOnline }
    );

    return;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

export const getOnline = async (userId) => {
  if(userId !== null ){
  try {
    const user = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("$id", userId)]
    )
    if (!user) throw Error;
    // console.log(1)
    // console.log(user.documents[0].lastonline)
    const lastOnline = user.documents[0].lastonline;
    // console.log(2)
    const currentTime = new Date().getTime();
    // console.log(3)
    const lastOnlineTime = new Date(lastOnline).getTime();
    // console.log(4)
    const timeDiff = currentTime - lastOnlineTime;
    // console.log(5)
    // console.log(timeDiff <= 120000)
    return timeDiff <= 120000;

  } catch (error) {
    console.log(error);
  }
  }
}

export const getChatUserItem = async (userId) => {
  try {
    //  console.log(userId)
    const otherUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("$id", userId)]
    )
    //console.log(currentUser.documents[0].$id)
    if(!otherUser) throw Error
    

    return otherUser;

    } catch (error) {
      console.log(error);
    }
}

export const getChatUserInfo = async (userId) => {
  try {
    //  console.log(userId)
    const otherUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("$id", userId)]
    )
    //console.log(currentUser.documents[0].$id)
    if(!otherUser) throw Error
    
    const id = otherUser.documents[0].$id;
    const username = otherUser.documents[0].username;
    const email = otherUser.documents[0].email;
    const avatar = otherUser.documents[0].avatar;
    //  console.log(id)
    //  console.log(username)
    //  console.log(email)
    //  console.log(avatar)

    return {id, username, email, avatar};

    } catch (error) {
      console.log(error);
    }
}

export const getChatLastMessage = async (chatroomId) => {
  try {
    //  console.log(userId)
    const lastMessage = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      [
        Query.limit(1), //watch out for this, maybe research more on refreshing like whatsapp
        Query.orderDesc("$createdAt"),
        Query.equal("chatroomId", chatroomId)
      ]
    )
    //console.log(currentUser.documents[0].$id)
    if(!lastMessage) throw Error
    
    const body = lastMessage.documents[0].body;
    const createdAt = lastMessage.documents[0].$createdAt;
    //  console.log(id)
    //  console.log(username)
    //  console.log(email)
    //  console.log(avatar)

    return {body, createdAt};

    } catch (error) {
      console.log(error);
    }
}

export const getChatGroupInfo = async (groupId) => {
  try {
    //  console.log(userId)
    const group = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.groupCollectionId,
      [Query.equal("$id", groupId)]
    )
    //console.log(currentUser.documents[0].$id)
    if(!group) throw Error
    
    const id = group.documents[0].$id;
    const username = group.documents[0].groupName;
    const avatar = group.documents[0].groupAvatar;
    const admin = group.documents[0].groupAdminId;
    //  console.log(id)
    //  console.log(username)
    //  console.log(email)
    //  console.log(avatar)

    return {id, username, avatar, admin};

    } catch (error) {
      console.log(error);
    }
}

//not needed for now vvvvvvv
export const getAllChatrooms = async () => {
  try {
    const chatrooms = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.chatroomCollectionId,
    )

    return chatrooms.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export const getChatroomStep = async (chatroomId) => {
  try {
    //  console.log(chatroomId)
    const chatroom = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.chatroomCollectionId,
      [Query.equal("$id", chatroomId)]
    )
    // console.log(chatroom)
    let step = chatroom.documents[0].progressBar
    // console.log(step)
    return step

  } catch (error) {
    console.log(error);
  }
}

export const getChatroomMatch = async (chatroomId, currentUser) => {
  try {
    //  console.log(chatroomId)
    const chatroom = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.chatroomCollectionId,
      [Query.equal("$id", chatroomId)]
    )
    // console.log(chatroom)
    let requestAuthor = chatroom.documents[0].requestAuthor
    let step = chatroom.documents[0].progressBar  
    // console.log("stepauthor",requestAuthor)
    // console.log(currentUser.$id)
    if( step === "interest" && currentUser.$id !== requestAuthor){
      console.log("false")
      return false
    }else{
      return true
    }

  } catch (error) {
    console.log(error);
  }
 }

 export const updateChatroomStep= async (chatroomId,state) => {
  try {
    const response = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.chatroomCollectionId,
      chatroomId,
      { progressBar: state }
    );
    console.log("progress updated",response.progressBar)
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

export const getStepRequest = async (chatroomId) => {
  try {
    //  console.log(userId)
    const chatroom = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.chatroomCollectionId,
      [Query.equal("$id", chatroomId)]
    )
    let stepRequest = chatroom.documents[0].stepRequest
    // console.log(stepRequest)
    return stepRequest

  } catch (error) {
    console.log(error);
  }
}

export const updateStepRequest= async (chatroomId,state) => {
  try {
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.chatroomCollectionId,
      chatroomId,
      { stepRequest: state }
    );
    console.log("stepRequest updated",state)
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

export const updateRequestAuthor = async (chatroomId,author) => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    );
    if (!currentUser) throw Error;
    
    const userId = currentUser.documents[0].$id;
    // console.log(lastOnline)
    if(author=="this"){
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.chatroomCollectionId,
      chatroomId,
      { requestAuthor: userId }
    );
    }else if(author=="null"){
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.chatroomCollectionId,
        chatroomId,
        { requestAuthor: null }
      );
    }else{
      console.log('updaterequestAuthor not "null" or "this"')
    }
    return;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

export const getRequestAuthor = async (chatroomId) => {
  try {
    //  console.log(userId)
    const chatroom = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.chatroomCollectionId,
      [Query.equal("$id", chatroomId)]
    )
    let requestAuthor = chatroom.documents[0].requestAuthor
    // console.log(requestAuthor)
    return requestAuthor

  } catch (error) {
    console.log(error);
  }
}

export const reported = async (userId) => {
  try {
    console.log(userId)
    const reportedUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('$id', userId)]
    );
    if (!reportedUser) throw Error;
    console.log(reportedUser.documents[0])
    const reportedCount = reportedUser.documents[0].strikes;
    // console.log(lastOnline)
    if(reportedCount < 5){
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId,
      { strikes: reportedCount+1 }
    );
    console.log('Reported')
    }else{
      console.log('Banned')
    }
    return;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}
// Fetch messages            DELETE
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

// Delete a message          DELETE
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
