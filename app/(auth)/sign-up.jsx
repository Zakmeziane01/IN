import { View, Text,ScrollView, Image, Alert,Dimensions} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import { router, Link } from 'expo-router';
import { images } from "../../constants";
import {createUser, logOut, getCurrentUser} from "../../lib/appwrite"
import FormField from '../../components/FormField';
import CustomButton from "../../components/CustomButton";
import { useGlobalContext } from "../../context/GlobalProvider";  // we use global context state when our user has logged in and automatically redirect them to the homapage  



const SignUp = () => {
  
  const { setUser, setIsLogged } = useGlobalContext();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

 

   // Function to handle form submission
  const submit = async () => {  
    // Check if any form fields are empty
    if(form.username === "" || form.email === "" || form.password === ""){
      Alert.alert("Error", "Please fill in all the fields");
    }
    
    setIsSubmitting(true);
    try {
      


      // Call createUser function with form data
      const result = await createUser(form.email, form.password, form.username)
      
      setUser(result.targets[0])
      setIsLogged(true);

      router.replace("/welcomeScreen")
      
    } catch (error) {
      Alert.alert("Error",error.message)
    } finally {
      setIsSubmitting(false)
    }
  };

   

  return (
    <SafeAreaView className="bg-white h-full">
     <ScrollView
        contentContainerStyle={{
          height: "100%",
          alignItems: 'center',
          paddingHorizontal: 16,
       }}
       >
        
      <View
          className="w-full flex justify-center h-full px-4 my-6"
          style={{
            
          }}
        >
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[34px]"
          />

          <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
            Create account
          </Text>

          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-10"
          />

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

            <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Have an account already?
            </Text>
            <Link
              href="/sign-in"
              className="text-lg font-psemibold text-secondary"
            >
              Sign in
            </Link>
          </View>

          </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp