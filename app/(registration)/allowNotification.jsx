import React, { useEffect, useState } from 'react';
import { Alert, View, Text, ScrollView,Image } from 'react-native';
import { images } from "../../constants";
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
      router.push("/acceptPrivacy"); 
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNotNow = () => {
    router.push("/careerPath"); 
    } 

  return (
  
      <SafeAreaView className="bg-white h-full">
        <View className="flexGrow-1">
          <ScrollView>
            <View className="items-center flex-1  mb-20">
              <Text className="text-2xl font-semibold text-secondary-200 mt-10  bg-cover  px-3 "  >
                Never miss a message from someone
              </Text>
              <Image source={images.notification}
                resizeMode='contain' className="my-0 w-[90px] h-[70px]" />
            </View>
          </ScrollView>
        </View>
  
    
          <View className="w-full min-h-[vh] px-3 flex-1 mt-80">
            <CustomButton 
              title="Allow notification" 
              handlePress={requestPermission} 
              containerStyles="bg-secondary-200"
              textStyles="text-center text-white"
              isLoading={isSubmitting}
            />
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
