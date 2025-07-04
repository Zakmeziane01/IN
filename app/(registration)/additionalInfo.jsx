import React, { useState} from 'react';
import { View, Text, ScrollView, Alert, Image } from 'react-native';
import { images, stepsBar } from "../../constants";
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from "expo-router";
import FormField from '../../components/FormField';
import CustomButton from "../../components/CustomButton";
import { useGlobalContext } from "../../context/GlobalProvider";
import { updateUserAttribute } from '../../lib/appwrite';
import PickerComponent from '../../components/PickerComponent';
import { useUserContext } from '../../context/UserContext';

// Function to calculate the age from the birthdate
const calculateAge = (birthDate) => {
  const today = new Date();
  const birthYear = birthDate.getFullYear();
  const birthMonth = birthDate.getMonth();
  const birthDay = birthDate.getDate();

  let age = today.getFullYear() - birthYear;

  // Adjust age if the birthday hasn't occurred yet this year
  if (today.getMonth() < birthMonth || (today.getMonth() === birthMonth && today.getDate() < birthDay)) {
    age--;
  }
  return age;
};

const AdditionalInfo = () => {
  const { user } = useGlobalContext();                       // Fetch user data from global context
  const { updateResponse } = useUserContext();               // Function to update user context response

  // State variables for form fields
  const [firstName, setFirstName] = useState(""); 
  const [lastName, setLastName] = useState(""); 
  const [birthday, setBirthday] = useState(new Date());      // State to manage birthdate, initialized to current date
  const [isSubmitting, setIsSubmitting] = useState(false);   // State to manage form submission status

  // Handle the submission of the form
  const handlePress = async () => {
    if (firstName === "" || !birthday) {                     // Check if fields are filled
      Alert.alert("Error", "Please fill in all the fields"); 
      return;
    }
    setIsSubmitting(true);                                  
    try {
      const age = calculateAge(birthday);                   // Calculate the user's age based on the selected birthdate

      // Update the user's attributes in the database
      await updateUserAttribute(user.userId, 'firstName', firstName);
      await updateUserAttribute(user.userId, 'lastName', lastName);
      await updateUserAttribute(user.userId, 'birthday', birthday.toISOString());  // Store birthdate in ISO format
      await updateUserAttribute(user.userId, 'age', String(age));                  // Save age as a string

      // Update the response in the context
      updateResponse('firstName', firstName);
      updateResponse('lastName', lastName);
      updateResponse('birthday', birthday.toISOString());
      updateResponse('age', String(age));                                          // Update the age in the context

      router.push("/ownGender"); 
    } catch (error) {
      Alert.alert("Error", error.message); 
    } finally {
      setIsSubmitting(false); 
    }
  };

  return (
    <SafeAreaView className="bg-secondary h-full">

      {/* Logo */}
      <View className="items-center justify-center">
        <Image source={images.Wlogo}
          resizeMode='contain'  className="my-0 w-[150px] h-[100px]"/>
      </View>

      <View className="flexGrow-1">
        <ScrollView className="h-full bg-white rounded-[35px]">
          <Image source={stepsBar.Step1}
            resizeMode='contain' className="w-[365px] h-[50px] mt-7 mb-2 self-center"/>

          <View className=" w-full justify-center min-h-[25vh] px-4 flex-1 mt-1 ">
            <Text className="text-2xl text-secondary text-semibold font-pmedium ml-3"> What's your name?</Text>
            <FormField
              value={firstName}
              handleChangeText={(text) => setFirstName(text)} // Update first name when text changes
              placeholder={"First Name * "}
            />

            <FormField
              value={lastName}
              handleChangeText={(text) => setLastName(text)}  // Update last name when text changes
              placeholder={"Last Name * "}
            />
          </View>

          <View className="w-full justify-center self-center">
            <Text className="text-2xl text-semibold font-pmedium text-secondary mt-10 mb-3 ml-3 ">What's your age?</Text>

            {/* Picker component for selecting birthdate */}
            <PickerComponent
              title="Select your birthdate"
              onValueChange={(value) => setBirthday(value)}  // Update birthday when a date is selected
            />
          </View>

          {/* Submit Button */}
          <View className="mx-2 my-3">
            <CustomButton 
                title="Next"
                handlePress={handlePress}                   // Call handlePress on button press
                containerStyles="mt-20 bg-secondary-200"
                textStyles="text-center text-white"
                isLoading={isSubmitting}                    // Show loading state while submitting
              />
          </View>

        </ScrollView>   
      </View>
    </SafeAreaView>
  );
};

export default AdditionalInfo;
