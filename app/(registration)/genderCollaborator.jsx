import { View, Text, Alert, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import TabsContainer from '../../components/TabsContainer';
import IconButton from '../../components/IconButton'; 
import { useGlobalContext } from "../../context/GlobalProvider";
import { router } from "expo-router";
import { updateUserAttribute } from '../../lib/appwrite';

const GenderCollaborator = () => {
  const { user } = useGlobalContext();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [collabGender, setCollabGender] = useState(user.CollabGender || "");

  const handlePress = async () => {
    if (collabGender === "") {
      Alert.alert("Error", "Please select a collaborator gender");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateUserAttribute(user.$id, 'CollabGender', collabGender);
      router.replace("/ownCareer"); 
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
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingVertical: 40,
        }}
      >
        <View>
          <Text className="text-black font-bold text-2xl mb-5">
            What type of collaborator are you looking for?
          </Text>

          <TabsContainer 
            value={collabGender}
            handleChangeText={setCollabGender}
            mode="selection" 
            options={['Male', 'Female', 'Both']} 
          />
        </View>      

        <IconButton
          handlePress={handlePress}
          containerStyles="self-center mt-10"
          iconStyles="text-white"
          isLoading={isSubmitting}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default GenderCollaborator;
