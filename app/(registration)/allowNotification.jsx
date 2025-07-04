import React, { useEffect, useState } from 'react';
import { Alert, View, Text, ScrollView, Image } from 'react-native';
import { images } from "../../constants"; 
import * as Notifications from 'expo-notifications';            // Expo Notifications for handling notifications
import CustomButton from '../../components/CustomButton'; 
import { SafeAreaView } from 'react-native-safe-area-context'; // SafeAreaView to avoid overlap with device's edges
import { router } from "expo-router"; 

const NotificationScreen = () => {
  // State to manage submission/loading state for the button
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Setting up notification handler to display alerts when a notification is received
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,                             // Show alert on receiving notification
        shouldPlaySound: false,                            // Don't play sound for notifications
        shouldSetBadge: false,                             // Don't set badge count
      }),
    });
  }, []);                                                  // Empty dependency array ensures this runs only once on component mount

  // Function to request notification permissions
  const requestPermission = async () => {
    setIsSubmitting(true); // Start loading state
    try {
      const { status } = await Notifications.getPermissionsAsync();          // Check current notification permissions
      if (status !== 'granted') {                                            // If permission is not granted, request it
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') { 
          Alert.alert('Notification Permission', 'Failed to get permission for notifications!');
          return;
        }
      }
      // If permissions are granted, show success alert and navigate to the next screen
      Alert.alert('Notification Permission', 'Notifications have been enabled!');
      router.push("/acceptPrivacy");
    } catch (error) {
      Alert.alert('Error', error.message); 
    } finally {
      setIsSubmitting(false); 
    }
  };

  // Function to handle "Not now" button press, navigating to the career path screen
  const handleNotNow = () => {
    router.push("/careerPath"); 
  };

  return (
    <SafeAreaView className="bg-white h-full"> 
      <View className="flexGrow-1"> 
        <ScrollView> 
          <View className="items-center flex-1 mb-20"> 
            <Text className="text-2xl font-semibold text-secondary-200 mt-10 bg-cover px-3">
              Never miss a message from someone 
            </Text>
            <Image source={images.notification}
              resizeMode='contain' className="my-0 w-[90px] h-[70px]" />
          </View>
        </ScrollView>
      </View>

      <View className="w-full min-h-[vh] px-3 flex-1 mt-80"> 
        {/* Button for enabling notifications */}
        <CustomButton 
          title="Allow notification" 
          handlePress={requestPermission}            // Trigger the permission request function
          containerStyles="bg-secondary-200" 
          textStyles="text-center text-white" 
          isLoading={isSubmitting}                   // Show loading spinner when submitting
        />
        {/* Button for skipping notification permission */}
        <CustomButton 
          title="Not now" 
          handlePress={handleNotNow} 
          containerStyles="bg-white" 
          textStyles="text-center text-secondary-200" 
        />
      </View>
    </SafeAreaView>
  );
};

export default NotificationScreen;   
