import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from "expo-router";
import FormField from '../../components/FormField';
import IconButton from '../../components/IconButton'; 
import { useGlobalContext } from "../../context/GlobalProvider";
import { updateUserAttribute } from '../../lib/appwrite';
import PickerComponent from '../../components/PickerComponent';
import { useUserContext } from '../../context/UserContext';

// Helper function to generate options for pickers
const generateOptions = (start, end) => {
  return Array.from({ length: end - start + 1 }, (_, i) => ({
    label: `${start + i}`,
    value: start + i,
  }));
};

const AdditionalInfo = () => {
  const { user } = useGlobalContext();
  const { updateResponse } = useUserContext();

  // State variables for form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ageOptions = generateOptions(14, 100);

  const handlePress = async () => {
    if (firstName === "" || birthday === "") {
      Alert.alert("Error", "Please fill in all the fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const formattedBirthday = String(birthday); // Ensure birthday is a string
      
      console.log(user.userId)
      // Update user attributes
      await updateUserAttribute(user.userId, 'firstName', firstName);
      await updateUserAttribute(user.userId, 'lastName', lastName);
      await updateUserAttribute(user.userId, 'birthday', formattedBirthday);

      // Update context with new responses
      updateResponse('firstName', firstName);
      updateResponse('lastName', lastName);
      updateResponse('birthday', formattedBirthday);

      // Navigate to the next screen
      router.push("/ownGender");
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
          justifyContent: 'center',
          paddingHorizontal: 20,
          paddingVertical: 20,
        }}
      >
        <View className="w-full">
          <Text className="text-2xl font-semibold text-black mb-6">What's your name</Text>

          <FormField
            value={firstName}
            handleChangeText={(text) => setFirstName(text)}
            placeholder={"First Name (required)"}
          />

          <FormField
            value={lastName}
            handleChangeText={(text) => setLastName(text)}
            placeholder={"Last Name (required)"}
          />

           <Text className="text-2xl font-semibold text-black mt-14 mb-3">What's yours age?</Text>

          <PickerComponent
            options={ageOptions}
            selectedValue={birthday}
            onValueChange={(value) => setBirthday(value)}
      
          />
        </View>
      </ScrollView>

      <View className="px-6 pb-6">
        <IconButton
          handlePress={handlePress}
          containerStyles="bg-primary p-4 rounded-full"
          iconStyles="text-white"
          isLoading={isSubmitting}
        />
      </View>
    </SafeAreaView>
  );
};

export default AdditionalInfo;
