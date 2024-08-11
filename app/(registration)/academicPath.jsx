import { View, Text, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from "expo-router";
import FormField from '../../components/FormField';
import IconButton from '../../components/IconButton'; 
import { useGlobalContext } from "../../context/GlobalProvider";
import { updateUserAttribute } from '../../lib/appwrite';  // Updated import
import { useUserContext } from '../../context/UserContext'; 


const AcademicPath = () => {
  const { user } = useGlobalContext();
  const { updateResponse } = useUserContext(); 

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    course: user.course,
    university: user.university,
  });

  // Function to handle form submission
  const handlePress = async () => {
    if (form.course === "" || form.university === "") {
      Alert.alert("Error", "Please fill the fields");
      return;
    }
    setIsSubmitting(true);
    try {
      await updateUserAttribute(user.userId, 'course', form.course);
      await updateUserAttribute(user.userId, 'university', form.university);

      // Update the context with the new values
      updateResponse('course', form.course);
      updateResponse('university', form.university);


      router.push("/projectType");
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
          paddingTop: 120,
          paddingBottom: 20
        }}
      >
        <View className="w-full flex items-center flex-1 h-full px-4 my-6">
          <Text className="text-2xl font-semibold text-white mt-10">
            Where do you study?
          </Text>

          <FormField
            title="Add a college or university"
            value={form.university}
            handleChangeText={(e) => setForm({ ...form, university: e })}
            otherStyles="mt-10"
          />

          <FormField
            title="Course"
            value={form.course}
            handleChangeText={(e) => setForm({ ...form, course: e })}
            otherStyles="mt-9"
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
};

export default AcademicPath;
