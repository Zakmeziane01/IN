import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from "expo-router";
import TabsContainer from '../../components/TabsContainer';
import IconButton from '../../components/IconButton'; 
import { useGlobalContext } from "../../context/GlobalProvider";
import { updateUserAttribute } from '../../lib/appwrite'; // Updated import

const WorkforceSize = () => {
    const { user } = useGlobalContext();
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
            // Use the new updateUserAttribute function
            await updateUserAttribute(user.$id, 'collaborativeNetworkSize', form.collaborativeNetworkSize);
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
           paddingTop:120
        }}
        >
          
                <View className="w-full  justify-center  px-4 my-6">
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
