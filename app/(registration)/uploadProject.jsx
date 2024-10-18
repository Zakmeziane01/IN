import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, Image,TextInput} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import UploadButton from '../../components/UploadButton';
import CustomButton from '../../components/CustomButton';
import { router } from 'expo-router';
import { uploadDocumentToStorage } from '../../lib/appwrite';
import { updateUserAttribute } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider';
import { useUserContext } from '../../context/UserContext';
import { images, stepsBar } from "../../constants";
import { icons } from '../../constants';


const UploadDocumentPage = () => {


  const { user } = useGlobalContext();
  const { updateResponse, getResponses } = useUserContext();  
  const [files, setFiles] = useState(Array(6).fill(null));    // Manage URIs of 6 uploaded files.
  const [uploading, setUploading] = useState(false);
  const [links, setLink] = useState(user.links || ''); // State to store the link input



  useEffect(() => {
    const responses = getResponses(); // Retrieve the stored responses
    console.log("Stored Responses:", responses);

    // Loop through the responses and print key-value pairs
    for (const [key, value] of Object.entries(responses)) {
      console.log(`${key}: ${value}`); // Print each key and value
    }
  }, []);

  const handleFilePicked = (index, uri) => {
    const newFiles = [...files];
    newFiles[index] = uri; // Updates the newFiles array by assigning the uri value to the element at the specified index
    setFiles(newFiles); // Set the updated files array
  };



  const handleUpload = async () => {
    setUploading(true);
    try {
      // Filter out any null files and proceed with non-null ones
      const validFiles = files.filter(Boolean); // Removes null values from the files array

      if (validFiles.length > 0) {
        // Upload the files to storage
        await uploadDocumentToStorage(validFiles, user.userId); // Modified to send an array of URIs
      } else {
        Alert.alert("Error", "Please select at least one file to upload.");
        return;
      }

      // Handle link upload with updateUserAttribute and updateResponse
      if (links) {
        // Update user's attribute with the uploaded link
        await updateUserAttribute(user.userId, 'links', links);
        // Confirm success to the user
        Alert.alert("Link Uploaded", `You have uploaded: ${links}`);
        setLink(''); // Clear the input after upload
      } else {
        Alert.alert("Error", "Please enter a valid link.");
        return;
      }

      console.log("Upload success", files, links);
      router.push('/allowNotification');
    } catch (error) {
      console.error("Upload failed", error);
      Alert.alert(
        "Upload Failed",
        "Failed to upload the files or link. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setUploading(false);
    }
  };
 
 


  return (
    <SafeAreaView className="bg-secondary h-full">
      <View className="items-center justify-center">
        <Image
          source={images.Wlogo}
          resizeMode='contain'  
          className="my-0 w-[150px] h-[100px]"/>
      </View>


      <View className="bg-white rounded-t-[35px]">
      <ScrollView className="h-full">
          <Image
            source={stepsBar.NextStep3}
            resizeMode='contain'
            className="w-[365px] h-[50px] mt-7 mb-2 self-center"/>


          <View>
            <Text className="text-lg text-secondary font-bold text-center mb-4">
              Select the <Text className="text-black">videos</Text> and <Text className="text-black">photos</Text> that best showcase your work.
            </Text>
          </View>


          <View className="w-full justify-center min-h-[25vh] px-3 flex-1 mt-2">  
            <View className="flex flex-wrap flex-row justify-center">


              {files.map((file, index) => (
                <UploadButton
                  key={index}
                  onFilePicked={(uri) => handleFilePicked(index, uri)}
                  pickerType="media" // Updated to 'media' to allow both images and videos
                  containerClassName="m-3"          
                  isUploaded={!!file}
                  plusIcon={icons.plus}
                />
              ))}
            </View>
          </View>
           
          <View className="w-full justify-center min-h-[5vh] px-7 flex-1 mt-3">
            <TextInput
              placeholder="🔗 Links"
              value={links}
              onChangeText={setLink}
              className={`border-2 border-gray-300 w-full p-5 h-16 px-3 bg-primary rounded-xl focus:border-secondary items-center flex-row mb-15`}
            />
          </View>
         
          <View className="text-center justify-center p-9 flex flex-row items-center">
          <Image
            source={icons.attention}
            resizeMode="contain"
            alt="plus"
            className="w-7 h-7 mr-2"
          />
          <Text className="text-xs">
            We recommend uploading videos and photos or a link. Research showcasing your skills and experience. This will impress and increase your potential collaborations with you.
          </Text>
        </View>
          </ScrollView>


          <View className="justify-center min-h-[20vh] px-3 flex-1 mt-10">
          <CustomButton
              title="Next"
              handlePress={() => {
                handleUpload(); // Call file upload function
              }}
              containerStyles="bg-secondary-200 mb-60"
              textStyles="text-center text-white"
              isLoading={uploading}
            />
          </View>
           
      </View>
    </SafeAreaView>
  );
};


export default UploadDocumentPage;