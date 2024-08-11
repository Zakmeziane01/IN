import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import TabsContainer from '../../components/TabsContainer';
import IconButton from '../../components/IconButton'; 
import { useGlobalContext } from '../../context/GlobalProvider';
import { useUserContext } from '../../context/UserContext';
import { updateUserAttribute } from '../../lib/appwrite';

const OwnCareer = () => {
  const { user } = useGlobalContext();
  const { updateResponse } = useUserContext(); 

  const [career, setCareer] = useState(user.career || ''); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePress = async () => {
    if (!career) { // Check if the career field is empty
      Alert.alert("Error", "Please select an option");
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Update the user's career attribute
      await updateUserAttribute(user.userId, 'career', career);

      // Update the context with the selected career
      updateResponse('career', career);

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
          height: "60%",
          marginHorizontal: 2,
          paddingTop: 30
        }}
      >
        <View className="w-full flex justify-center h-full px-4 my-6">
          <Text className="text-2xl font-semibold text-black mt-10 font-psemibold">
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
        containerStyles="bg-black mb-4"
        iconStyles="text-white"
        isLoading={isSubmitting}
      />
    </SafeAreaView>
  );
};

export default OwnCareer;
