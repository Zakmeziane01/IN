import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, ScrollView, Alert } from 'react-native';
import SettingButton from '../../components/SettingButton';
import { useGlobalContext } from "../../context/GlobalProvider";
import { router } from "expo-router";
import { getUserAttributes } from '../../lib/appwrite'; // Ensure you have this function

const Home = () => {
  const { user } = useGlobalContext();
  const [userAttributes, setUserAttributes] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserAttributes = async () => {
      try {
        const attributes = await getUserAttributes(user.$id);
        setUserAttributes(attributes);
      } catch (error) {
        Alert.alert("Error", "Failed to load user attributes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAttributes();
  }, [user.$id]);

  const handleSettingsPress = () => {
    router.push("/setting");
  };

  if (isLoading) {
    return <Text className="text-center text-gray-500">Loading...</Text>; // Or use a spinner/loading indicator
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="p-4">
        <View className="mb-7">
          <SettingButton
            handlePress={handleSettingsPress}
            containerStyles="mb-7"
          />
        </View>
        <View className="bg-white p-4 rounded-lg shadow-md">
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            Welcome, {userAttributes?.firstName || 'User'}
          </Text>
          <Text className="text-gray-700 mb-2">
            <Text className="font-semibold">First Name:</Text> {userAttributes?.firstName || 'N/A'}
          </Text>
          <Text className="text-gray-700 mb-2">
            <Text className="font-semibold">Last Name:</Text> {userAttributes?.lastName || 'N/A'}
          </Text>
          <Text className="text-gray-700 mb-2">
            <Text className="font-semibold">Birthday:</Text> {userAttributes?.birthday || 'N/A'}
          </Text>
          <Text className="text-gray-700 mb-2">
            <Text className="font-semibold">Gender:</Text> {userAttributes?.gender || 'N/A'}
          </Text>
          <Text className="text-gray-700 mb-2">
            <Text className="font-semibold">Address:</Text> {userAttributes?.address || 'N/A'}
          </Text>
          <Text className="text-gray-700 mb-2">
            <Text className="font-semibold">Career Path:</Text> {userAttributes?.careerPath || 'N/A'}
          </Text>
          <Text className="text-gray-700 mb-2">
            <Text className="font-semibold">Collaborative Gender:</Text> {userAttributes?.CollabGender || 'N/A'}
          </Text>
          {/* Add more fields as needed */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


export default Home; 
