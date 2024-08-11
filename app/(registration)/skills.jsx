import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, SafeAreaView } from 'react-native';
import { router } from "expo-router";
import FormField from '../../components/FormField';
import IconButton from '../../components/IconButton'; 
import { useGlobalContext } from "../../context/GlobalProvider";
import { useUserContext } from "../../context/UserContext"; // Import useUserContext
import { updateUserAttribute } from '../../lib/appwrite';

const Skills = () => {
    const { user } = useGlobalContext();
    const { updateResponse } = useUserContext(); // Access updateResponse from UserContext
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        generalSkills: user.generalSkills || '', // Ensure default value
        aboutYou: user.aboutYou || '',
        languageSpoken: user.languageSpoken || ''
    });

    // Function to handle form submission
    const handlePress = async () => {
        if (form.generalSkills === "" || form.aboutYou === "" || form.languageSpoken === "") {
            Alert.alert("Error", "Please fill in all the fields");
            return;
        }

        setIsSubmitting(true);
        try {
            // Update each attribute in the backend
            await updateUserAttribute(user.userId, 'generalSkills', form.generalSkills);
            await updateUserAttribute(user.userId, 'aboutYou', form.aboutYou);
            await updateUserAttribute(user.userId, 'languageSpoken', form.languageSpoken);

            // Update the context with new values
            updateResponse('generalSkills', form.generalSkills);
            updateResponse('aboutYou', form.aboutYou);
            updateResponse('languageSpoken', form.languageSpoken);

            // Navigate to the next screen
            router.push("/uploadPhotos");

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
                    height: "30%",
                    marginHorizontal: 20,
                    paddingTop: 20,
                    marginBottom: 100
                }}
            >
                <View className="w-full px-4 my-6">
                    <Text className="text-2xl font-semibold text-black mt-10 font-psemibold">
                        Which skills best define you?
                    </Text>

                    <FormField
                        title="General Skills"
                        value={form.generalSkills}
                        handleChangeText={(e) => setForm({ ...form, generalSkills: e })}
                        otherStyles="mt-3"
                    />

                    <FormField
                        title="About You"
                        value={form.aboutYou}
                        handleChangeText={(e) => setForm({ ...form, aboutYou: e })}
                        otherStyles="mt-3"
                        containerStyles="h-60"
                        multiline={true}
                        numberOfLines={20}
                    />

                    <FormField
                        title="Language Spoken"
                        value={form.languageSpoken}
                        handleChangeText={(e) => setForm({ ...form, languageSpoken: e })}
                        otherStyles="mt-3"
                    />
                </View>
            </ScrollView>

            <IconButton
                handlePress={handlePress}
                containerStyles="mt-7"
                isLoading={isSubmitting}
            />
        </SafeAreaView>
    );
};

export default Skills;
