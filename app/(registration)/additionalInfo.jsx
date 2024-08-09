import { View, Text, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from "expo-router";
import FormField from '../../components/FormField';
import IconButton from '../../components/IconButton'; 
import { useGlobalContext } from "../../context/GlobalProvider";
import { updateUserAttribute } from '../../lib/appwrite';
import PickerComponent from '../../components/PickerComponent';

// Helper function to generate options for pickers
const generateOptions = (start, end) => {
  return Array.from({ length: end - start + 1 }, (_, i) => ({
    label: `${start + i}`,
    value: start + i,
  }));
};

const AdditionalInfo = () => {
  const { user } = useGlobalContext();

  // Separate state variables for each form field
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
      await updateUserAttribute(user.$id, 'firstName', firstName);
      await updateUserAttribute(user.$id, 'lastName', lastName);
      await updateUserAttribute(user.$id, 'birthday', formattedBirthday);
      
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
       height: "100%",
       marginHorizontal: 20,
       paddingTop:120
    }}
    >
        <View className="w-full flex items-center flex-1 h-full px-4 my-6">
          <Text className="text-2xl font-semibold text-black mt-10">
            Oh hey! Let's start with an intro
          </Text>

          <FormField
            title="First Name"
            value={firstName}
            handleChangeText={setFirstName} // Directly setting the state
            otherStyles="mt-10"
          />

          <FormField
            title="Last Name"
            value={lastName}
            handleChangeText={setLastName} // Directly setting the state
            otherStyles="mt-9"
          />

          <PickerComponent
            title="Age"
            value={birthday}
            placeholder="Select your age"
            onValueChange={setBirthday} // Directly setting the state
            options={ageOptions}
            containerStyles="mt-12"
          />

        </View>
      </ScrollView>

      <View className="">
       <IconButton
          handlePress={handlePress}
          containerStyles=""
          iconStyles="text-white"
          isLoading={isSubmitting}
        />
      </View>
    </SafeAreaView>
  );
}

export default AdditionalInfo;
