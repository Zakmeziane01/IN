import React, { useState, useEffect} from 'react';
import { View, Text,ScrollView, Image,Alert,Dimensions} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Link,router} from "expo-router"

import { images } from "../../constants";
import FormField from '../../components/FormField';
import CustomButton from "../../components/CustomButton";
import { getCurrentUser, signIn, logOut} from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";   
import { StatusBar } from 'expo-status-bar';

const SignIn = () => {
  const { setUser, setIsLogged} = useGlobalContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async () => {  //called submit on click 
    
    if(form.email == "" || form.password === ""){
      Alert.alert("Error", "Please fill in all the fields")
    }
    
    setIsSubmitting(true);

    try {
      await signIn(form.email, form.password);
      const result = await getCurrentUser();
      console.log(result)
      setUser(result);
      setIsLogged(true);
      router.push("/welcomeScreen")
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
      <ScrollView className="h-full bg-white rounded-[35px]">
      <View className = " w-full justify-center min-h-[65vh] px-4 my-6 flex-1">
        <View className="flex items-center flex-row">
          <Text className="text-3xl text-secondary text-semibold font-psemibold ml-3"> Log in </Text>
          {/* <Image source={images.logo}
              resizeMode='contain' className=" w-[160px] h-[90px] ml-2 flex-shrink"/> */}
        </View>
      
        <FormField
        // title="Email"
        value={form.email}
        handleChangeText={(e) => setForm({...form, email:e})}
        otherStyles='mt-3'
        placeholder="Email"
        keyboardType='email-address'
        />
        <FormField
        // title="Password"
        value={form.password}
        handleChangeText={(e) => setForm({...form, password:e})}
        placeholder="Password"
        otherStyles='mt-3'
        />

        <CustomButton className=" px-4 my-6"
        title = "Log in"
        handlePress={submit}
        containerStyles="mt-10 bg-secondary mx-3"
        isLoading={isSubmitting}
        textStyles="text-white"
        />
        <View className="justify-center pt-5 flex-row gap-2">
          <Text className="text-lg text-gray-100 font-pregular">
            Don't have an account?
          </Text>
          <Link href="/sign-up" className='text-lg font-psemibold text-secondary'>Sign up</Link>
        </View>
      </View>
        
      </ScrollView>
      </View>
      <StatusBar backgroundColor='#5bb450' style='light'/> 
    </SafeAreaView>
  )
}

export default SignIn 