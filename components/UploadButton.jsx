import React, { useState } from 'react';
import { View, TouchableOpacity, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';

const UploadButton = ({ onFilePicked, pickerType, containerClassName, squareSize = 90, isUploaded = false, plusIcon }) => {
  
  const [mediaUri, setMediaUri] = useState(null); // Updated to handle both images and videos

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Sorry, we need camera roll permissions to make this work!');
      return false;
    }
    return true;
  };

  const pickFile = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    let result;
    if (pickerType === 'media') {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All, // Allow both images and videos
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setMediaUri(result.assets[0].uri);
        if (onFilePicked) {
          onFilePicked(result.assets[0].uri);
        }
      }
    }
  };

  return (
    <View className={containerClassName}>
      <TouchableOpacity
        onPress={pickFile}
        className={`w-[${squareSize}px] h-[${squareSize}px] rounded-lg border-2 flex items-center justify-center border-gray-300`}
      >
        <View className="flex items-center justify-center" style={{ width: squareSize, height: squareSize }}>
          {mediaUri ? (
            // Check if the picked file is a video
            mediaUri.endsWith('.mp4') || mediaUri.endsWith('.mov') ? (
            <Video
              source={{ uri: mediaUri }}
              shouldPlay={false} // Set to false if you want to allow the user to control playback
              style={{ width: squareSize, height: squareSize, borderRadius: 10 }}
              isLooping={false}
              useNativeControls // Allows user to control playback
            />
            ) : (
              <Image
                source={{ uri: mediaUri }}
                style={{ width: squareSize, height: squareSize, resizeMode: 'cover', borderRadius: 10 }}
              />
            )
          ) : (
            <Image
              source={plusIcon}
              style={{ width: squareSize * 0.3, height: squareSize * 0.3, resizeMode: 'contain' }} // Smaller size for the icon
            />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default UploadButton;
