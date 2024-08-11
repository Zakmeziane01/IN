import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from "expo-router";
import TabsContainer from '../../components/TabsContainer';
import IconButton from '../../components/IconButton'; 
import { useGlobalContext } from "../../context/GlobalProvider";
import { useUserContext } from '../../context/UserContext'; // Import useUserContext
import { updateUserAttribute } from '../../lib/appwrite'; 

const WorkforceSize = () => {
    const { user } = useGlobalContext();
    const { updateResponse } = useUserContext(); // Access updateResponse from user context
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        collaborativeNetworkSize: user.collaborativeNetworkSize || '' // Ensure default value
    });

    // Function to handle form submission
    const handlePress = async () => {
        if (form.collaborativeNetworkSize === "") {
            Alert.alert("Error", "Please fill the field");
            return;
        }

        setIsSubmitting(true);
        try {
            // Update the collaborativeNetworkSize attribute in the backend
            await updateUserAttribute(user.userId, 'collaborativeNetworkSize', form.collaborativeNetworkSize);
            
            // Update the context with the new value
            updateResponse('collaborativeNetworkSize', form.collaborativeNetworkSize);

            // Navigate to the next screen
            router.push("/skills");
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
                    paddingTop: 120
                }}
            >
                <View className="w-full justify-center px-4 my-6">
                    <Text className="text-2xl font-semibold text-black mt-10 font-psemibold">
                        Which would you prefer: working in a group, or with only one Collaborator?
                    </Text>

                    <TabsContainer 
                        value={form.collaborativeNetworkSize}
                        handleChangeText={(e) => setForm({ ...form, collaborativeNetworkSize: e })}
                        mode="selection"
                        options={['One collaborator', 'Group', 'Both']}
                        containerStyles="flex-col mt-4"
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

export default WorkforceSize;
