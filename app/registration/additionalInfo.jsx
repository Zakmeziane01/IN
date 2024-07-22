import { View, Text, ScrollView, Alert,TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from "expo-router";
import FormField from '../../components/FormField';
import CustomButton from "../../components/CustomButton";
import { useGlobalContext } from "../../context/GlobalProvider";
import { updateUserAdditionalInfo } from '../../lib/appwrite';  // Import the function

import DatePicker from 'react-native-datepicker';





const AdditionalInfo = () => {
  const { user } = useGlobalContext();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    birthday: new Date(),
    gender: ''
  });

  // Function to handle form submission
  const submit = async () => {  
    if(form.firstName === "" || form.birthday === ""|| form.gender === ""){
      Alert.alert("Error", "Please fill in all the fields");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await updateUserAdditionalInfo(user.$id, form.firstName, form.lastName, form.birthday);
      router.replace("");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full flex justify-center h-full px-4 my-6">
          <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
            Additional Information
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
            otherStyles="mt-7"
          />

          <Text className="text-white mt-7">Birthday</Text>
          <DatePicker
            className="w-full bg-black-100 text-white border-0 mt-2 rounded-md"
            selected={form.birthday}
            onChange={(date) => setForm({ ...form, birthday: date })}
            dateFormat="yyyy-MM-dd"
            maxDate={new Date()}
            showYearDropdown
            scrollableYearDropdown
          />

          <Text className="text-white mt-7">Gender</Text>
          <View className="flex flex-row mt-2">
            <TouchableOpacity onPress={() => setForm({ ...form, gender: 'Male' })} className={`p-2 rounded-md ${form.gender === 'Male' ? 'bg-secondary' : 'bg-black-100'}`}>
              <Text className="text-white">Male</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setForm({ ...form, gender: 'Female' })} className={`p-2 rounded-md ml-4 ${form.gender === 'Female' ? 'bg-secondary' : 'bg-black-100'}`}>
              <Text className="text-white">Female</Text>
            </TouchableOpacity>
          </View>

          <CustomButton
            title="Submit"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Link
              href="/sign-in"
              className="text-lg font-psemibold text-secondary"
            >
              Skip
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default AdditionalInfo;
