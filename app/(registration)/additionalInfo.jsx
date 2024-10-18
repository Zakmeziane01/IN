import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, Image} from 'react-native';
import { images, stepsBar } from "../../constants";
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from "expo-router";
import FormField from '../../components/FormField';
import CustomButton from "../../components/CustomButton";
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
    
    <SafeAreaView className="bg-secondary h-full">

    <View className="items-center justify-center">
      <Image source={images.Wlogo}
        resizeMode='contain'  className="my-0 w-[150px] h-[100px]"/>
    </View>

    <View className="flexGrow-1">
      <ScrollView className="h-full bg-white rounded-[35px]">
        <Image source={stepsBar.Step1}
        resizeMode='contain' className="w-[365px] h-[50px] mt-7 mb-2 self-center"/>

    <View className = " w-full justify-center min-h-[25vh] px-4 flex-1 mt-1 ">
        
          <Text className="text-2xl text-secondary text-semibold font-pmedium ml-3"> What's your name?</Text>
          <FormField
            value={firstName}
            handleChangeText={(text) => setFirstName(text)}
            placeholder={"First Name * "}
          />

          <FormField
            value={lastName}
            handleChangeText={(text) => setLastName(text)}
            placeholder={"Last Name * "}
          />
    </View>

    <View className="w-full justify-center self-center "  >
           <Text className="text-2xl text-semibold font-pmedium text-secondary mt-10 mb-3 ml-3 ">What's yours age?</Text>

          <PickerComponent
            options={ageOptions}
            selectedValue={birthday}
            onValueChange={(value) => setBirthday(value)}
            />
    </View>
    <View className="mx-2 my-3">
      <CustomButton 
          title="Next"
          handlePress={handlePress}
          containerStyles="mt-20 bg-secondary-200"
          textStyles="text-center text-white"
          isLoading={isSubmitting}
        />
        </View>
    
      </ScrollView>   
      </View>

     

    </SafeAreaView>
  );
};

export default AdditionalInfo;
