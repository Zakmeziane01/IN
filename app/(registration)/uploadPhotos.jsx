import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import IconButton from '../../components/IconButton'; 
import { useRouter } from "expo-router";
import { useGlobalContext } from "../../context/GlobalProvider";
import UploadButton from '../../components/UploadButton'; 
import { useUserContext } from '../../context/UserContext';


const ImageUploadScreen = () => {
  const { user } = useGlobalContext(); 
  const [fileUri, setFileUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const { updateResponse } = useUserContext();

  const handleFilePicked = (uri) => {
    setFileUri(uri);
  };

  const handleUpload = async () => {
    if (!fileUri) {
      alert("Please select a file first!");
      return;
    }

    setUploading(true);
    try {

      updateResponse("profileImageUri", fileUri)
      // const updatedProfile = await createPhotoProfile(fileUri, user.$id);  userId
     // console.log("Upload success", updatedProfile);
      router.push('/uploadProject');
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload the file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
    <ScrollView
     contentContainerStyle={{
       height: "30%",
       marginHorizontal: 20,
    }}
    >
      
        <View className="w-full flex justify-center h-full px-4 my-6">
          <Text className="text-4xl font-semibold">Upload Your profile photo</Text>
        </View>

        <UploadButton 
          onFilePicked={handleFilePicked}
          pickerType="image" 
          buttonText="Pick a document"
          buttonClassName="bg-white p-4 rounded-lg flex items-center justify-center"
          textClassName="text-white text-center"
          containerClassName="flex items-center"
          squareSize={200} // You can change this size based on your need
        />


      </ScrollView>

      <IconButton
          handlePress={handleUpload}
          isLoading={uploading}
        />
    </SafeAreaView>
  );
};

export default ImageUploadScreen;
