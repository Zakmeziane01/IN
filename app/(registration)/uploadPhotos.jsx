import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import IconButton from '../../components/IconButton'; 
import { useRouter } from "expo-router";
import { useGlobalContext } from "../../context/GlobalProvider";
import UploadButton from '../../components/UploadButton'; 
import { useUserContext } from '../../context/UserContext';
import { createPhotoProfile, uploadFile } from '../../lib/appwrite';

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
      Alert.alert("Error", "Please select a file first!");
      return;
    }

    setUploading(true);
    try {
      console.log(fileUri)
      const uploadedUrl = await uploadFile(fileUri, "image"); 
      updateResponse("profileImageUri", uploadedUrl); 
      await createPhotoProfile(uploadedUrl, user.userId);
      router.push('/uploadProject');
    } catch (error) {
      console.error("Upload failed", error);
      Alert.alert("Error", "Failed to upload the file. Please try again.");
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
          <Text className="text-4xl font-semibold">Upload Your Profile Photo</Text>
        </View>

        <UploadButton 
          onFilePicked={handleFilePicked}
          pickerType="image" 
          buttonText="Pick an Image"
          buttonClassName="bg-white p-4 rounded-lg flex items-center justify-center"
          textClassName="text-black text-center"
          containerClassName="flex items-center"
          squareSize={200} 
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
