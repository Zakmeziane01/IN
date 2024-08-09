import React, { useEffect, useState } from 'react';
import { Alert, View, Text, ScrollView } from 'react-native';
import * as Notifications from 'expo-notifications';
import CustomButton from '../../components/CustomButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import IconButton from '../../components/IconButton';
import { router } from "expo-router";

const NotificationScreen = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
  }, []);

  const requestPermission = async () => {
    setIsSubmitting(true);
    try {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Notification Permission', 'Failed to get permission for notifications!');
          return;
        }
      }
      Alert.alert('Notification Permission', 'Notifications have been enabled!');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNotNow = () => {
    router.push("/uploadPhotos"); 
    } 




  return (
    <SafeAreaView className="bg-white h-full">
    <ScrollView
     contentContainerStyle={{
       height: "100%",
       marginHorizontal: 20,
       paddingTop:120
    }}
    >
      
        <View className="w-full flex items-center flex-1 h-full px-4 my-6">
          <Text className="text-2xl font-semibold text-black mt-10">
            Never miss a message from someone
          </Text>

        </View>

        
        <CustomButton 
            title="Allow notification" 
            handlePress={requestPermission} 
            containerStyles="mt-10 mb-4"
            isLoading={isSubmitting}
          />
          
          <CustomButton 
            title="Not now" 
            handlePress={handleNotNow} 
            containerStyles="mb-4"
          />
      </ScrollView>


    </SafeAreaView>
  );
};

export default NotificationScreen;
