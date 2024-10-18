import { View, Text, ScrollView, Alert,Image } from 'react-native';
import { images, stepsBar } from "../../constants";
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from "expo-router";
import FormField from '../../components/FormField';
import CustomButton from "../../components/CustomButton";
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


      router.push("/careerPath");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-secondary h-full">

    <View className="items-center justify-center">
      <Image source={images.Wlogo}
        resizeMode='contain'  className="my-0 w-[150px] h-[100px]"/>
    </View>

    <View className="flexGrow-1">
      <ScrollView className="h-full bg-white rounded-[35px]">
        <Image source={stepsBar.Step7}
        resizeMode='contain' className="w-[365px] h-[50px] mt-7 mb-2 self-center"/>

    <View>
    <Text className="text-2xl text-secondary text-semibold font-pmedium ml-3.5  mt-2 ">Where do you study?</Text>
    </View>

    <View className = " w-full justify-center min-h-[25vh] px-3 flex-1 mt-2">   
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

    <View className="w-full justify-center min-h-[37vh] px-3 flex-1 mt-2">
      <CustomButton 
          title="Next"
          handlePress={handlePress}
          containerStyles="bg-secondary-200"
          textStyles="text-center text-white"
          isLoading={isSubmitting}
        />
        </View>
    
      </ScrollView>   
      </View>

     

    </SafeAreaView>
  );
};

export default AcademicPath;
