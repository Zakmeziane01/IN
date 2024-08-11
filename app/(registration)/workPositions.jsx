import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from "expo-router";
import FormField from '../../components/FormField';
import IconButton from '../../components/IconButton'; 
import { useGlobalContext } from "../../context/GlobalProvider";
import { useUserContext } from '../../context/UserContext'; // Import useUserContext
import { updateUserAttribute } from '../../lib/appwrite'; // Updated import

const WorkPositions = () => {
    const { user } = useGlobalContext();
    const { updateResponse } = useUserContext(); // Access updateResponse from user context

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        employmentRoles: user.employmentRoles || '', // Ensure default value
    });

    // Function to handle form submission
    const handlePress = async () => {
        if (form.employmentRoles === "") {
            Alert.alert("Error", "Please fill in the field");
            return;
        }

        setIsSubmitting(true);
        try {
            // Update user attributes in the backend
            await updateUserAttribute(user.userId, 'employmentRoles', form.employmentRoles);

            // Update the context with the new value
            updateResponse('employmentRoles', form.employmentRoles);

            // Navigate to the next screen
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
                    flexGrow: 1,
                    justifyContent: 'center',
                    paddingHorizontal: 20,
                    paddingVertical: 40,
                }}
            >
                <View className="w-full flex justify-center h-full px-4 my-6">
                    <Text className="text-2xl font-semibold text-black">
                        Where do you work?
                    </Text>

                    <FormField 
                        title="Tell us more about your work"
                        value={form.employmentRoles}
                        handleChangeText={(e) => setForm({ ...form, employmentRoles: e })}
                        otherStyles="mt-7"
                        containerStyles="h-40"
                        multiline={true}
                        numberOfLines={20}
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
