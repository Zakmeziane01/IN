import React, { useState } from 'react';
import { Text, View, Alert, Image} from 'react-native';
import { images, stepsBar } from "../../constants";
import CustomButton from "../../components/CustomButton";
import CareerPathOptions from '../../components/CareerPathOptions';
import { updateUserAttribute } from '../../lib/appwrite'; 
import { useGlobalContext } from '../../context/GlobalProvider'; 
import { useUserContext } from '../../context/UserContext';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const CareerPath = () => {
  const { user } = useGlobalContext(); 
  const { updateResponse } = useUserContext();

  const [selectedValues, setSelectedValues] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pickerItems = [
    { label: 'App-developer', value: 'App-developer', description: 'Create mobile applications for various platforms.' },
    { label: 'Clothing line', value: 'Clothing line', description: 'Design and sell your own clothing line.' },
    { label: 'Newsletter', value: 'News letter', description: 'Curate and distribute engaging newsletters.' },
    { label: 'Event planner', value: 'Event planer', description: 'Plan and organize events for various occasions.' },
    { label: 'E-commerce', value: 'E-commercer', description: 'Build and manage online stores and businesses.' },
    { label: 'Photographer', value: 'Photographer', description: 'Capture stunning images for various purposes.' },
    { label: 'Youtuber', value: 'Youtuber', description: 'Create and share content on YouTube.' },
    // ... other options
  ];

  const handlePressOption = (value) => {
    if (selectedValues.includes(value)) {
      // If already selected, remove the value
      setSelectedValues(selectedValues.filter(item => item !== value));
    } else {
      // If not selected, check the count before adding
      if (selectedValues.length < 2) {
        setSelectedValues([...selectedValues, value]);
      } else {
        Alert.alert("Limit Reached", "You can select a maximum of 2 options.");
      }
    }
  };

  const handlePress = async () => {
    if (selectedValues.length < 1) {
      Alert.alert("Error", "Please select at least one career path");
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Update the user's career path attribute with selected values
      await updateUserAttribute(user.userId, 'careerPath', selectedValues.join(', ')); // Join selected values
      updateResponse('careerPath', selectedValues);

      router.push("/projectType");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  

  return (
    <SafeAreaView className="bg-secondary h-full">
      <View className="items-center justify-center">
        <Image 
          source={images.Wlogo}
          resizeMode='contain'
          className="my-0 w-[150px] h-[100px]"/>
      </View>

      <View className="flex-grow-1">
        <View className="h-full bg-white rounded-[35px] px-4 pt-8">
          <Image 
            source={stepsBar.Step8}
            resizeMode='contain' 
            className="w-[365px] h-[50px] mb-4 self-center"
          />
      
          <Text className="text-2xl text-secondary text-semibold font-pmedium ml-3 mt-7 ">
            What Inspires You?
          </Text>           
         
        <View className="h-[400px]">
        <CareerPathOptions className="mt-3.5 "
          options={pickerItems}
          selectedValues={selectedValues}
          onPressOption={handlePressOption}        
        />
        </View>
     
          
      <View className="w-full justify-center min-h-[10vh] px-3 flex-1 mt-2 max-h-1">
      <CustomButton 
          title="Next"
          handlePress={handlePress}
          containerStyles="bg-secondary-200"
          textStyles="text-center text-white"
          isLoading={isSubmitting}
        />
        </View>
         
          
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CareerPath;
