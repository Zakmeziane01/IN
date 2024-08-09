import { View, Text, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from "expo-router";
import TabsContainer from '../../components/TabsContainer';
import IconButton from '../../components/IconButton'; 
import { useGlobalContext } from "../../context/GlobalProvider";
import { updateUserAttribute } from '../../lib/appwrite';

const OwnGender = () => {
  const { user } = useGlobalContext();
  const [gender, setGender] = useState(user.gender || ''); // Initialize with user's gender or empty string
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to handle form submission
  const handlePress = async () => {
    if (!gender) { // Check if gender is selected
      Alert.alert("Error", "Please select your gender");
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Update the user's gender attribute
      await updateUserAttribute(user.$id, 'gender', gender);
      router.push("/allowNotification");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingVertical: 40,
        }}
      >
        <View>
          <Text className="text-black font-bold text-2xl mb-5">
            Select your gender
          </Text>

          <TabsContainer 
            value={gender}
            handleChangeText={setGender} // Directly update the gender state
            mode="selection"
            options={['Male', 'Female', 'Others']}
            containerStyles="flex-col mt-4"
          />
        </View>

        <IconButton
          handlePress={handlePress}
          containerStyles="self-center mt-10"
          iconStyles="text-white"
          isLoading={isSubmitting}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

export default OwnGender;
