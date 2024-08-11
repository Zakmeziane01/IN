import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, ScrollView, Alert, Image } from 'react-native';
import SettingButton from '../../components/SettingButton';
import { useGlobalContext } from "../../context/GlobalProvider";
import { router } from "expo-router";
import { getUserAttributes } from '../../lib/appwrite'; // Ensure you have this function
import { useUserContext } from '../../context/UserContext';
import * as Location from 'expo-location';

const Profile = () => {
  const { user } = useGlobalContext();
  const [userAttributes, setUserAttributes] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileImageUri, setProfileImageUri] = useState('');
  const [address, setAddress] = useState(''); // New state for address
  const { getResponses } = useUserContext();

  useEffect(() => {
    const fetchUserAttributes = async () => {
      try {
        const attributes = await getUserAttributes(user.userId);
        setProfileImageUri(attributes.profileImageUri || ''); 
        setUserAttributes(attributes);

        // Reverse geocoding
        if (attributes.latitude && attributes.longitude) {
          const [result] = await Location.reverseGeocodeAsync({
            latitude: parseFloat(attributes.latitude),
            longitude: parseFloat(attributes.longitude),
          });
          setAddress(result?.city || 'N/A'); // You can format the address as needed
        }

        const responses = getResponses();
        setProfileImageUri(responses.profileImageUri || '');
      } catch (error) {
        Alert.alert("Error", "Failed to load user attributes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAttributes();
  }, [user.userId]);

  const handleSettingsPress = () => {
    router.push("/setting");
  };

  if (isLoading) {
    return <Text className="text-center text-gray-500">Loading...</Text>; // Or use a spinner/loading indicator
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 100,
        }}
      >
        <View className="mb-7">
          <SettingButton
            handlePress={handleSettingsPress}
            containerStyles="mb-7"
          />
        </View>
        <View className="shadow-md">
          <Text className="font-semibold text-4xl ">
            {userAttributes?.firstName || 'N/A'}
          </Text>
          <Text className="font-pregular text-4xl mt-7 ">
            {userAttributes?.careerPath || 'N/A'}
          </Text>

          <View className={`w-60 h-60 rounded-2xl mt-7 border-2 ${profileImageUri ? 'border-transparent' : 'border-gray-300'} bg-gray-100 flex items-center justify-center mb-4`}>
            {profileImageUri ? (
              <Image
                source={{ uri: profileImageUri }}
                className="w-full h-full rounded-full"
              />
            ) : (
              <Text className="text-gray-500">No Image</Text>
            )}
          </View>

          <View className="border-t-2 border-gray-300 my-4 mt-7" />
          <Text className="font-pregular text-xl mt-7 ">
            <Text className="font-psemibold">About Me: </Text>   
            {userAttributes?.aboutYou || 'N/A'}
          </Text>

          <View className="border-t-2 border-gray-300 my-4 mt-7" />
          <Text className="font-pregular text-xl mt-7 ">
            <Text className="font-psemibold">Skills: </Text>{userAttributes?.generalSkills || 'N/A'}
          </Text>

          <View className="border-t-2 border-gray-300 my-4 mt-7" />
          <Text className="font-pregular text-xl mt-7 ">
            <Text className="font-psemibold">I am looking for: </Text>{userAttributes?.projectDivision || 'N/A'}
          </Text>

          <View className="border-t-2 border-gray-300 my-4 mt-7" />
          <Text className="font-pregular text-xl mt-7 ">
            <Text className="font-psemibold">University: </Text>{userAttributes?.university || 'N/A'}
          </Text>

          <View className="border-t-2 border-gray-300 my-4 mt-7" />
          <Text className="font-pregular text-xl mt-7 ">
            <Text className="font-psemibold">Jobs: </Text>{userAttributes?.employmentRoles || 'N/A'}
          </Text>

          <View className="border-t-2 border-gray-300 my-4 mt-7" />
          <Text className="font-pregular text-xl mt-7 ">
            <Text className="font-psemibold">Language: </Text>  {userAttributes?.languageSpoken || 'N/A'}
          </Text>

          <View className="border-t-2 border-gray-300 my-4 mt-7" />
          <Text className="font-pregular text-xl mt-7 ">
            <Text className="font-psemibold">Age:</Text> {userAttributes?.birthday || 'N/A'} 
            <Text className="font-psemibold">   Gender: </Text>{userAttributes?.gender || 'N/A'}
          </Text>

          <View className="border-t-2 border-gray-300 my-4 mt-7" />
          <Text className="font-pregular text-xl mt-7 ">
            <Text className="font-psemibold">Address: </Text>{address || 'N/A'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
