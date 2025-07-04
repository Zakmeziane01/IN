import React, { useState} from 'react';
import { View, Text, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from "expo-router";

import { images } from "../../constants";
import FormField from '../../components/FormField';
import CustomButton from "../../components/CustomButton";
import { getCurrentUser, signIn} from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";   
import { StatusBar } from 'expo-status-bar';

const SignIn = () => {
  const { setUser, setIsLogged } = useGlobalContext(); // Access global context for user state and login status
  const [isSubmitting, setIsSubmitting] = useState(false); // Track the submission state (loading)
  const [form, setForm] = useState({ // Manage form state (email and password)
    email: "",
    password: "",
  });

  const submit = async () => {  // Called when the submit button is pressed
    if (form.email == "" || form.password === "") { // Check if email or password is empty
      Alert.alert("Error", "Please fill in all the fields"); // Alert if fields are missing
      return;
    }

    setIsSubmitting(true); // Set submitting state to true while handling the request

    try {
      await signIn(form.email, form.password); // Call signIn function with email and password
      const result = await getCurrentUser(); // Get the current logged-in user's data
      console.log(result); // Log the result (current user)
      setUser(result); // Set the user state with the retrieved data
      setIsLogged(true); // Update login status to true
      router.push("/home"); // Redirect to the home
    } catch (error) {
      Alert.alert("Error", error.message); // Show error message if login fails
    } finally {
      setIsSubmitting(false); // Reset submitting state after request is complete
    }
  };

  return (
    <SafeAreaView className="bg-secondary h-full"> {/* Safe area view with background color */}
      <View className="items-center justify-center">
        <Image source={images.Wlogo} resizeMode='contain' className="my-0 w-[235px] h-[160px]" /> {/* Logo image */}
      </View>
      <View className="flexGrow-1">
        <ScrollView className="h-full bg-white rounded-[35px]"> {/* Scrollable container for the form */}
          <View className="w-full justify-center min-h-[65vh] px-4 my-6 flex-1">
            <View className="flex items-center flex-row">
              <Text className="text-3xl text-secondary text-semibold font-psemibold ml-3"> Log in </Text> {/* Login header */}
            </View>

            {/* Form fields for email and password */}
            <FormField
              value={form.email}
              handleChangeText={(e) => setForm({ ...form, email: e })}
              otherStyles='mt-3'
              placeholder="Email"
              keyboardType='email-address'
            />
            <FormField
              value={form.password}
              handleChangeText={(e) => setForm({ ...form, password: e })}
              placeholder="Password"
              otherStyles='mt-3'
            />

            {/* Submit button to log in */}
            <CustomButton
              className="px-4 my-6"
              title="Log in"
              handlePress={submit}
              containerStyles="mt-10 bg-secondary mx-3"
              isLoading={isSubmitting}
              textStyles="text-white"
            />
            <View className="justify-center pt-5 flex-row gap-2">
              <Text className="text-lg text-gray-100 font-pregular">
                Don't have an account?
              </Text>
              <Link href="/sign-up" className='text-lg font-psemibold text-secondary'>Sign up</Link> {/* Link to sign-up page */}
            </View>
          </View>
        </ScrollView>
      </View>
      <StatusBar backgroundColor='#5bb450' style='light' /> {/* Custom status bar with light text on green background */}
    </SafeAreaView>
  )
}

export default SignIn;
