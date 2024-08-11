import React, { useState } from 'react';
import { Text, View, Alert, ScrollView } from 'react-native';
import MultiPicker from '../../components/MultiPicker';
import IconButton from '../../components/IconButton'; 
import { updateUserAttribute } from '../../lib/appwrite'; 
import { useGlobalContext } from '../../context/GlobalProvider'; 
import { useUserContext } from '../../context/UserContext'; // Import useUserContext
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context'; 

const CareerPath = () => {
  const { user } = useGlobalContext(); 
  const { updateResponse } = useUserContext(); // Access updateResponse from user context

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


  const handlePress = async () => {
    if (selectedValues.length === 0) {
      Alert.alert("Error", "Please select at least one career path");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const careerPathString = selectedValues.join(', '); // Convert array to string
      
      // Update the user's career path attribute
      await updateUserAttribute(user.userId, 'careerPath', careerPathString);
      
      // Update the context with the selected career paths
      updateResponse('careerPath', careerPathString);

      // Navigate to the next page
      router.push("/genderCollaborator");
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
          height: "60%",
          marginHorizontal: 20,
          paddingTop: 120
        }}
      >
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-3xl font-bold mb-14">What Inspires you?</Text>
          <MultiPicker
            selectedValue={selectedValues}
            onValueChange={handleValueChange}
            items={pickerItems}
          />
        </View>
      </ScrollView>

        <IconButton
          handlePress={handlePress}
          containerStyles="bg-black"
          iconStyles="text-white"
          isLoading={isSubmitting}
        />
      
      </SafeAreaView>
  );
};

export default CareerPath;
