import { View, Text, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from "expo-router";
import TabsContainer from '../../components/TabsContainer';
import IconButton from '../../components/IconButton'; 
import CustomButton from '../../components/CustomButton';
import { useGlobalContext } from "../../context/GlobalProvider";
import { updateUserAttribute } from '../../lib/appwrite'; // Updated import

const OwnCareer = () => {
  const { user } = useGlobalContext();
  const [career, setCareer] = useState(user.career || ''); // Initialize with user's current career or empty string
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to handle form submission
  const handlePress = async () => {
    if (!career) { // Check if the career field is empty
      Alert.alert("Error", "Please select an option");
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Update the user's career attribute
      await updateUserAttribute(user.$id, 'career', career);

      // Navigate based on selected career
      switch (career) {
        case 'Student':
          router.replace("/academicPath");
          break;
        case 'Work part-time':
        case 'Work full-time':
          router.replace("/workPositions");
          break;
        case 'Gap year':
          router.replace("/projectType"); // Assuming you have a path for Gap Year
          break;
        default:
          Alert.alert("Error", "Unexpected career option selected");
          break;
      }
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
      
        <View className="w-full flex justify-center h-full px-4 my-6">
          <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
            What do you do for a living?
          </Text>

          <TabsContainer 
            value={career}
            handleChangeText={setCareer} // Directly update the career state
            mode="selection"
            options={['Student', 'Work part-time', 'Work full-time', 'Gap year']}
            containerStyles="flex-col mt-4"
          />
        </View>
      </ScrollView>


        <IconButton
          handlePress={handlePress}
          containerStyles=""
          iconStyles="text-white"
          isLoading={isSubmitting}
        />
    </SafeAreaView>
  );
}

export default OwnCareer;
