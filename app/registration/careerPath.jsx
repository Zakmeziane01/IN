import React, { useState } from 'react';
import { SafeAreaView, Text, View, Alert } from 'react-native';
import MultiPicker from '../../components/MultiPicker';

import { careerPath } from '../../lib/appwrite'; // Import the function
import { useGlobalContext } from "../../context/GlobalProvider"; // Assuming you use context for user info
import { router } from "expo-router";
import IconButton from '../../components/iconButton';

const CareerPath = () => {
  const { user } = useGlobalContext(); // Get user data from global context
  const [selectedValues, setSelectedValues] = useState(['Web-developer']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleValueChange = (value, pickerIndex) => {
    const newValues = [...selectedValues];
    newValues[pickerIndex] = value;
    setSelectedValues(newValues);
  };

  const pickerItems = [
    [
      { label: 'App-developer', value: 'App-developer' },
      { label: 'Clothing line', value: 'Clothing line' },
      { label: 'News letter', value: 'News letter' },
      { label: 'Event planer', value: 'Event planer' },
      { label: 'E-commercer', value: 'E-commercer' },
      { label: 'Photographer', value: 'Photographer' },
      { label: 'Youtuber', value: 'Youtuber' },
    ],
  ];

  // Function to handle form submission
  const handlePress = async () => {
    if (selectedValues.length === 0) {
      Alert.alert("Error", "Please select at least one career path");
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Convert the array of selected values into a comma-separated string
      const careerPathString = selectedValues.join(', ');                //Convert Array to String: selectedValues.join(', ') transforms the array into a comma-separated string. This way, you ensure that you're sending a valid string format to the Appwrite function.
      
      // Call the careerPath function with the formatted string
      await careerPath(user.$id, careerPathString);
      router.replace("/registration/genderCollaborator");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };




  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-xl font-bold mb-4">What Inspires you?</Text>
        <MultiPicker
          selectedValue={selectedValues}
          onValueChange={handleValueChange}
          items={pickerItems}
        />
      </View>
      <View className="absolute bottom-4 right-4">
        <IconButton
          handlePress={handlePress}
          containerStyles=""
          iconStyles="text-white"
          isLoading={isSubmitting}
        />
      </View>
    </SafeAreaView>
  );
};
export default CareerPath;
