import { View, Text,ScrollView, Image, Alert,Dimensions} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import { router, Link } from 'expo-router';
import { images } from "../../constants";
import {createUser, logOut, getCurrentUser} from "../../lib/appwrite"
import FormField from '../../components/FormField';
import CustomButton from "../../components/CustomButton";
import { useGlobalContext } from "../../context/GlobalProvider"; 
import { StatusBar } from 'expo-status-bar';


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

      router.replace("/home")
      
    } catch (error) {
      Alert.alert("Error",error.message)
    } finally {
      setIsSubmitting(false)
    }
  };

  return (
    <SafeAreaView className="bg-secondary h-full">
      <View className="items-center justify-center">
        <Image source={images.Wlogo}
          resizeMode='contain' className="my-0 w-[235px] h-[160px]"/>
      </View>

      <View className="flexGrow-1">
      <ScrollView className="h-full bg-white rounded-t-[35px]">
      <View className = " w-full justify-center min-h-[65vh] px-4 my-6 flex-1">
        <View className="flex items-center flex-row">
          <Text className="text-3xl text-secondary text-semibold font-psemibold ml-3"> Sign Up </Text>
          {/* <Image source={images.logo}
              resizeMode='contain' className=" w-[160px] h-[90px] ml-2 flex-shrink"/> */}
        </View>
        <FormField
        placeholder="Username"
        value={form.username}
        handleChangeText={(e) => setForm({...form, username:e})}
        otherStyles='mt-2'
        />
        <FormField 
        placeholder="Email"
        value={form.email}
        handleChangeText={(e) => setForm({...form, email:e})}
        otherStyles='margin-top-2'
        keyboardType='email-address'
        />
        <FormField
        placeholder="Password"
        value={form.password}
        handleChangeText={(e) => setForm({...form, password:e})}
        />

        <CustomButton className=" px-4 my-6"
        title = "Sign up"
        handlePress={submit}
        containerStyles="mt-10 bg-secondary mx-3"
        textStyles="text-white"
        isLoading={isSubmitting}
        
        />
        <View className="justify-center pt-5 flex-row gap-2">
          <Text className="text-lg text-gray-100 font-pregular">
            Have an account already?
          </Text>
          <Link href="/sign-in" className='text-lg font-psemibold text-secondary'>Log in</Link>
        </View>
        </View>

      </ScrollView>
      </View>
      <StatusBar backgroundColor='#5bb450' style='light'/> 
    </SafeAreaView>
  )
}

export default SignUp