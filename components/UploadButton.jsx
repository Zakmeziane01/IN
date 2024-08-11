import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

const UploadButton = ({
  onFilePicked,
  pickerType = 'document', 
  buttonText = 'Pick a file',
  buttonClassName,
  textClassName,
  containerClassName,
  squareSize = 200,
}) => {
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);

  const requestPermission = async () => {
    if (pickerType === 'image') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Sorry, we need camera roll permissions to make this work!');
        return false;
      }
    }
    return true;
  };

  const pickFile = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission && pickerType === 'image') return;

    let result;
    if (pickerType === 'image') {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setImage(result.assets[0].uri);
        if (onFilePicked) {
          onFilePicked(result.assets[0].uri);
        }
      }
    } else if (pickerType === 'document') {
      result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
      });

      if (result.type !== 'cancel') {
        setFile(result.uri);
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
        className={`w-[${squareSize}px] h-[${squareSize}px] rounded-lg border-2 border-gray-400 flex items-center justify-center ${buttonClassName}`}
      >
        <View className="flex items-center justify-center">
          {image ? (
            <Image 
              source={{ uri: image }} 
              style={{ width: squareSize, height: squareSize, resizeMode: 'cover', borderRadius: 10 }} 
            />
          ) : file ? (
            <Text className="text-sm text-black text-center">{file.split('/').pop()}</Text>
          ) : (
            <>
              <Text className="text-2xl text-gray-400">+</Text>
              <Text className={textClassName}>{buttonText}</Text>
            </>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default UploadButton;
