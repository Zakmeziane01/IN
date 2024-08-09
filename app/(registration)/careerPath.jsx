import React, { useState } from 'react';
import { SafeAreaView, Text, View, Alert } from 'react-native';
import MultiPicker from '../../components/MultiPicker';
import IconButton from '../../components/IconButton'; 
import { updateUserAttribute } from '../../lib/appwrite'; // Updated import
import { useGlobalContext } from "../../context/GlobalProvider"; 
import { router } from "expo-router";
import { ScrollView } from 'react-native-web';

const CareerPath = () => {
  const { user } = useGlobalContext(); 
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
      const careerPathString = selectedValues.join(', '); // Convert array to string
      
      // Use the new updateUserAttribute function
      await updateUserAttribute(user.$id, 'careerPath', careerPathString);
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
       height: "100%",
       marginHorizontal: 20,
       paddingTop:120
    }}
    >
      
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default CareerPath;
