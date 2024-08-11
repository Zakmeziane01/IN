import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import UploadButton from '../../components/UploadButton';
import IconButton from '../../components/IconButton';
import { router } from 'expo-router';

const UploadDocumentPage = () => {
  const [files, setFiles] = useState(Array(6).fill(null));
  const [uploading, setUploading] = useState(false);

  const handleFilePicked = (index, uri) => {
    const newFiles = [...files];
    newFiles[index] = uri;
    setFiles(newFiles);
  };

  const handleUpload = async () => {
    const uploadedFilesCount = files.filter(file => file !== null).length;

    if (uploadedFilesCount < 2) {
      Alert.alert(
        "Insufficient Uploads",
        "You need to upload at least two documents to proceed.",
        [{ text: "OK" }]
      );
      return;
    }

    setUploading(true);
    try {
  
      console.log("Upload success", files);
      router.push('/allDone');
    } catch (error) {
      console.error("Upload failed", error);
      Alert.alert(
        "Upload Failed",
        "Failed to upload the files. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView
        contentContainerStyle={{
          height: "30%",
          marginHorizontal: 30,
        }}
      >
        <Text className="text-3xl font-semibold mt-7 mb-14">
          Select the documents that best showcase your work
        </Text>

        <View className="flex flex-wrap flex-row justify-center">
          {files.map((file, index) => (
            <UploadButton
              key={index}
              onFilePicked={(uri) => handleFilePicked(index, uri)}
              pickerType="document"
              buttonText="Pick a file"
              containerClassName="m-3"
              buttonClassName="bg-white" 
              textClassName="text-center text-gray-500"
              squareSize={100} 
            />
          ))}
        </View>

        <Text className="text-red-500 text-center mt-4">
          You need to upload at least two documents to proceed.
        </Text>
      </ScrollView>

      <IconButton
        handlePress={handleUpload}
        isLoading={uploading}
        containerStyles="shadow-lg"
        iconStyles="text-white"
      />
    </SafeAreaView>
  );
};

export default UploadDocumentPage;
