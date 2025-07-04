import React, { useState } from 'react';
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    View,
    Text,
    Alert,
    Image,
    TouchableOpacity,
    ScrollView,
  } from "react-native";
  import { images, stepsBar } from "../../constants";
  import { icons } from "../../constants";
  import CustomButton from "../../components/CustomButton";
  import { useGlobalContext } from "../../context/GlobalProvider";
  import { useUserContext } from '../../context/UserContext';
  import { createPhotoProfile} from '../../lib/appwrite';


/**
 * Function to handle uploading a photo by selecting from the device's gallery.
 * It uses the ImagePicker library to select an image, then uploads it to the server.
 * @returns None
 */
const uploadPhoto = () => {
    const router = useRouter();
    const { user } = useGlobalContext();
    const [uploading, setUploading] = useState(false);
    const { updateResponse } = useUserContext();
    const [form, setForm] = useState({
      thumbnail: null,
    });
  
    // Open gallery function
    const openPicker = async () => {
      // Request permission to access media library
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        return Alert.alert("Permission to access gallery is required!");
      }

      // Open gallery to pick an image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,            // Only allow images
        allowsEditing: true,                                        // Allow basic editing (optional)
        aspect: [4, 3],                                             // Define aspect ratio (optional)
        quality: 1,                                                 // Image quality (1 is the highest)
      });

      if (!result.canceled) {
        setForm({
          ...form,
          thumbnail: result.assets[0],                              // Set the selected image
        });
      } else {
        Alert.alert("No image selected");
      }
    };

    // Submit function
    const handleUpload = async () => {
      if (!form.thumbnail) {
        return Alert.alert("Please upload an image");
      }

      setUploading(true);
      try { 
        await createPhotoProfile(form.thumbnail.uri, user.userId);
        console.log(user)
        console.log("from photo", user.userId)
        Alert.alert("Success", "Image uploaded successfully");
        router.push("/uploadProject");
      } catch (error) {
        Alert.alert("Error", error.message);
      } finally {
        setForm({
          thumbnail: null,
        });
        setUploading(false);
      }
    };


    return (
      <SafeAreaView className="bg-secondary h-full">
  
      <View className="items-center justify-center">
        <Image source={images.Wlogo}
          resizeMode='contain'  className="my-0 w-[150px] h-[100px]"/>
      </View>
  
      <View className="flexGrow-1">
        <ScrollView className="h-full bg-white rounded-[35px]">
          <Image source={stepsBar.NextStep2}
          resizeMode='contain' className="w-[365px] h-[50px] mt-7 mb-2 self-center"/>
  
      <View className="justify-center items-center">
      <Text className="text-2xl text-balck text-semibold font-pmedium justify-center mt-2">Upload profile photo</Text>
      </View>
  
      <View className = " w-full justify-center min-h-[25vh] px-3 flex-1 mt-10">   

      <TouchableOpacity onPress={openPicker}>
              {form.thumbnail ? (
                <View className="justify-center items-center">
                <Image
                  source={{ uri: form.thumbnail.uri }}
                  resizeMode="contain"
                  className="h-60 w-60 px-4 rounded-2xl"
                />
                </View>
              ) : (
                <View className="justify-center items-center">
                <View className="h-60 w-60 px-4 bg-white rounded-2xl border-2 border-gray-300 flex justify-center items-center">
                <Image
                  source={icons.plus}
                  resizeMode="contain"
                  alt="plus"
                  className="w-14 h-14" 
                />
                </View>
                </View>
              )}

       </TouchableOpacity>
      
            <View className="w-full justify-center min-h-[40vh] px-3 flex-1">
            <View className="flex flex-row justify-center mb-4 mr-3.5">              
            <Image
              source={icons.attention}
              resizeMode="contain"
              alt="attention"
              className="w-8 h-8 mx-3"
            />
            <Text className="text-xs text-gray-500">
              Uploading a professional picture helps potential matches recognize you and improves trust in work collaborations.
            </Text>
          </View>  
            <CustomButton 
              title="Next"
              handlePress={handleUpload}
              containerStyles="bg-secondary-200"
              textStyles="text-center text-white"
              isLoading={uploading}
            />
          </View>
 
      </View>
  

      
        </ScrollView>   
        </View>
  
       
  
      </SafeAreaView>
    );
  };

export default uploadPhoto;
