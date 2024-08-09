import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from "expo-router";
import FormField from '../../components/FormField';
import IconButton from '../../components/IconButton'; 
import { useGlobalContext } from "../../context/GlobalProvider";
import { updateUserAttribute } from '../../lib/appwrite'; // Updated import

const WorkPositions = () => {
    const { user } = useGlobalContext();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        employmentRoles: user.employmentRoles || '', // Ensure default value
    });

    // Function to handle form submission
    const handlePress = async () => {
        if (form.employmentRoles === "") {
            Alert.alert("Error", "Please fill in all the fields");
            return;
        }

        setIsSubmitting(true);
        try {
            // Use the new updateUserAttribute function
            await updateUserAttribute(user.$id, 'employmentRoles', form.employmentRoles);
            router.replace("/projectType");
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
           paddingTop:120
        }}
        >
          
                <View className="w-full flex justify-center h-full px-4 my-6">
                    <Text className="text-2xl font-semibold text-black font-psemibold">Where do you work?</Text>

                    <FormField 
                        title="Tell more about your work"
                        value={form.employmentRoles}
                        handleChangeText={(e) => setForm({ ...form, employmentRoles: e })}
                        otherStyles="mt-7"
                        containerStyles="h-60"
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

export default WorkPositions;
