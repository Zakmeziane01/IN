import { View, Text, Alert, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/FormField';
import { useGlobalContext } from "../../context/GlobalProvider";
import { router } from "expo-router";
import IconButton from '../../components/iconButton'; // Adjust the import path as necessary
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
      router.replace(""); // Adjust the route if necessary
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <ScrollView>
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-2xl font-semibold mt-10 font-psemibold">
            What type of collaborator are you looking for?
          </Text>
          <FormField
            title="Gender"
            value={form.CollabGender}
            handleChangeText={(e) => setForm({ ...form, CollabGender: e })}
            mode="gender" // Ensure this mode is handled in FormField
            otherStyles="mt-7"
          />
        </View>

        <View className="absolute bottom-4 right-4">
          <IconButton
            handlePress={handlePress}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GenderCollaborator;
