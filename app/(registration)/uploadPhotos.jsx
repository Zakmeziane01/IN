import React, { useState } from 'react';
import { View, Text, Image, Alert, ScrollView, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import IconButton from '../../components/IconButton'; 
import { useRouter } from "expo-router";
import { updataImage } from  '../../lib/appwrite';
import { useGlobalContext } from "../../context/GlobalProvider";

const ImageUploadScreen = () => {
  const { user } = useGlobalContext();
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const openPicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*', // This will allow only images
        copyToCacheDirectory: false,
      });

      if (result.type === 'success') {
        setImage(result.uri); // Save the image URI to the state
      } else {
        Alert.alert("Cancelled", "No file selected");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while picking the file");
    }
  };

  const handleUpload = async () => {
    if (!image) {
      Alert.alert("Error", "Please select an image first");
      return;
    }

    setUploading(true);

    try {
      // Assuming updataImage function takes the user ID and image URI
      await updataImage(user.$id, image);
      Alert.alert("Success", "Image uploaded successfully!");
      router.push('/someNextPage'); // Navigate to another page if necessary
    } catch (error) {
      Alert.alert("Upload Error", error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
        <View className="mb-6">
          <Text className="text-xl font-semibold mb-4">Upload Image</Text>
          <Button title="Pick Image" onPress={openPicker} />
        </View>

        {image && (
          <View className="mb-6">
            <Image source={{ uri: image }} className="w-full h-64" resizeMode="contain" />
          </View>
        )}

        <IconButton
          handlePress={handleUpload}
          containerStyles="mt-6"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ImageUploadScreen;
