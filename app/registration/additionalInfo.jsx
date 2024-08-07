import { View, Text, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from "expo-router";
import FormField from '../../components/FormField';
import IconButton from '../../components/IconButton'; 
import { useGlobalContext } from "../../context/GlobalProvider";
import { updateUserAdditionalInfo } from '../../lib/appwrite';  
import PickerComponent from '../../components/PickerComponent';

// Helper function to generate options for pickers
const generateOptions = (start, end) => {
  return Array.from({ length: end - start + 1 }, (_, i) => ({
    label: `${start + i}`,
    value: start + i,
  }));
};

const AdditionalInfo = () => {
  const { user } = useGlobalContext();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    birthday: user.birthday || '',  
  });

  const ageOptions = generateOptions(14, 100); // Example options for age picker

  const handlePress = async () => {
    if (form.firstName === "" || form.birthday === "") {
      Alert.alert("Error", "Please fill in all the fields");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await updateUserAdditionalInfo(user.$id, form.firstName, form.lastName, form.birthday);
      router.replace("/registration/ownGender");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full flex items-center flex-1 h-full px-4 my-6">
          <Text className="text-2xl font-semibold text-white mt-10">
            Oh hey! Let's start with an intro
          </Text>

          <FormField
            title="First Name"
            value={form.firstName}
            handleChangeText={(e) => setForm({ ...form, firstName: e })}
            otherStyles="mt-10"
          />

          <FormField
            title="Last Name"
            value={form.lastName}
            handleChangeText={(e) => setForm({ ...form, lastName: e })}
            otherStyles="mt-9"
          />

          <PickerComponent
            title="Age"
            value={form.birthday}
            placeholder="Select your age"
            onValueChange={(age) => setForm({ ...form, birthday: age })}
            options={ageOptions}
            containerStyles="mt-12"
          />
        </View>
      </ScrollView>

      <View className="absolute bottom-6 right-7">
        <IconButton
          handlePress={handlePress}
          containerStyles=""
          iconStyles="text-white"
          isLoading={isSubmitting}
        />
      </View>
    </SafeAreaView>
  );
}

export default AdditionalInfo;
