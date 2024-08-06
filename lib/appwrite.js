import {
    Account,
    Avatars,
    Client,
    Databases,
    ID,
    Query,
    Storage,
  } from "react-native-appwrite";

export const config = {
    endpoint:"https://cloud.appwrite.io/v1", //this is their hosted version of the platform  but appwrite is an open source therefore allows self-hosting as well. THIS IS THE CLOUD VERSION.
    platform:"com.jsm.INspired",
    projectId:"666b3ea2002b7cb544a6",
    databaseId: "6682b80a001d586f6a40",
    userCollectionId:"6682b842002632b0fa22",
    videoCollectionId:"6682b89300070bd7a7b9",
    messagesCollectionId:"66a50c400026abe5f28b",
    storageId: "6682bc3e001e2fed74b4"
};


// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint    The "Appwrite Endpoint" is the URL where your Appwrite backend services are hosted. It's the location where your client-side application sends requests to interact with Appwrite's features such as authentication, database operations, and file storage.
    .setProject(config.projectId) // Your project ID
    .setPlatform(config.platform); // Your application ID or bundle ID.


// Initialize the Appwrite services
const account = new Account(client);
const avatars = new Avatars(client);
const storage = new Storage(client);
const databases = new Databases(client);

export { databases, ID, Query,client};

// Register user
export const createUser = async (email, password, username) => {
  try {
    // Create a new account
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
    // Throw an error if account creation fails
    if(!newAccount) throw new Error;   

   // Get the user's avatar URL
    const avatarUrl = avatars.getInitials(username);
    // Sign in the new user
    await signIn(email,password);

    // Create a document in the database for the new user
    const newUser= await databases.createDocument(
        config.databaseId,
        config.userCollectionId,
        ID.unique(),
        {
         accountid: newAccount.$id,
         email: email,
         username: username,
         avatar:avatarUrl,
         phone: null // Include phone attribute, even if it's null
        }
    );

  return newUser;  
} catch (error) {
    console.log(error);
    throw new Error(error);
  }
}



// Function to update user's phone number
export const updatePhoneNumber = async (userId, phoneNumber) => {
  try {
    const updatedUser = await databases.updateDocument(
      config.databaseId,
      config.userCollectionId,
      userId,
      {
        phone: phoneNumber
      }
    );
    return updatedUser;
  } catch (error) {
    throw new Error(error.message);
  }
};


// Sign In
export const signIn =  async (email, password) => {
  try {
    // Create an email/password session
    const session = await account.createEmailPasswordSession(email, password);
    
    return session;
  } catch (error) {
    throw new Error(error);
  }
};
  

// Get Current User
export async function getCurrentUser() {      //This function's purpose is to retrieve information about the currently authenticated user from the Appwrite backend.
  try {

    // Step 1: Fetch current account information
    const currentAccount = await account.getAccount();
    if (!currentAccount) throw Error;

    // Fetch (obtain) the user document from the database
    const currentUser = await databases.listDocuments(
      config.databaseId,                                     // Database ID where users are stored
      config.userCollectionId,                               // Collection ID for user documents
      [Query.equal("accountId", currentAccount.$id)]         // Query ( "query" refers to a request for data or information from a database or other data source) to find the document with accountId matching current user's $id
    );

    // Step 4: Check if a user document is found
    if (!currentUser) throw Error;                            //Throw an error if no user document is found
    // Step 5: Return the first user document found
    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Sign Out
export async function signOut() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    throw new Error(error);
  }
};

// Function to update user's additional information
export const updateUserAdditionalInfo = async (userId, firstName, lastName, birthday, gender) => {
  try {
    const updatedUser = await databases.updateDocument(
      config.databaseId,
      config.userCollectionId,
      userId,
      {
        firstName: firstName,
        lastName: lastName,
        birthday: new Date(birthday),
        gender: gender,
        
      }
    );
    return updatedUser;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const UserAddressInfo = async (userId, latitude, longitude) => {
  try {
    const address = `${latitude},${longitude}`;
    const updatedUser = await databases.updateDocument(
      config.databaseId,
      config.userCollectionId,
      userId,
      { address }
    );
    return updatedUser;
  } catch (error) {
    throw new Error(error.message);
  }
};


// Function to update user's additional information
export const careerPath = async (userId,careerPath) => {
  try {
    const updatedUser = await databases.updateDocument(
      config.databaseId,
      config.userCollectionId,
      userId,
      {
        careerPath: careerPath
        
      }
    );
    return updatedUser;
  } catch (error) {
    throw new Error(error.message);
  }
};


// Function to update user's additional information
export const CollaboratorGender = async (userId,collabGender) => {
  try {
    const updatedUser = await databases.updateDocument(
      config.databaseId,
      config.userCollectionId,
      userId,
      {
        collabGender: collabGender
        
      }
    );
    return updatedUser;
  } catch (error) {
    throw new Error(error.message);
  }
};


export const skills = async (userId, generalSkills, aboutYou, languageSpoken) => {
  try {
    const updatedUser = await databases.updateDocument(
      config.databaseId,
      config.userCollectionId,
      userId,
      {
        generalSkills: generalSkills,
        aboutYou: aboutYou,
        languageSpoken: languageSpoken,
        
      }
    );
    return updatedUser;
  } catch (error) {
    throw new Error(error.message);
  }
};


//whole the id and information that we need to hook up to our app write Claoud are here.
//now we are ready to start connecting to our app write client which allow us to createuser, aplaod videos, make relations between them and update files to our storage. 