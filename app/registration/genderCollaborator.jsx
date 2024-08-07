import { View, Text, Alert, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import TabsContainer from '../../components/TabsContainer';
import IconButton from '../../components/IconButton'; 
import { useGlobalContext } from "../../context/GlobalProvider";
import { router } from "expo-router";

import { CollaboratorGender } from '../../lib/appwrite'; 

const GenderCollaborator = () => {
  const { user } = useGlobalContext();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    CollabGender: user.CollabGender || "" // Ensure default value if user.CollabGender is undefined
  });

  const handlePress = async () => {
    if(form.CollabGender === ""){
      Alert.alert("Error", "Please fill in all the fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await CollaboratorGender(user.$id, form.CollabGender);
      router.replace("/registration/ownCareer"); 
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <ScrollView>
      <View className="w-full flex justify-center h-full px-4 my-6">
      <Text className="text-2xl font-semibold text-black mt-10 font-psemibold">
            What type of collaborator are you looking for?
          </Text>

          <TabsContainer className="flex flex-col"
            value={form.CollabGender}
            handleChangeText={(e) => setForm({ ...form, CollabGender: e })}
            mode="selection" 
            options={['Male', 'Female', 'Both']} 
            otherStyles="mt-7"
            containerStyles="flex-col mt-7"
          />

          <IconButton
            handlePress={handlePress}
            containerStyles="mt-7 self-end"
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GenderCollaborator;
