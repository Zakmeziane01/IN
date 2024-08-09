import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, SafeAreaView } from 'react-native';
import { router } from "expo-router";
import FormField from '../../components/FormField';
import IconButton from '../../components/IconButton'; 
import { useGlobalContext } from "../../context/GlobalProvider";
import { updateUserAttribute } from '../../lib/appwrite'; // Updated import

const Skills = () => {
    const { user } = useGlobalContext();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        generalSkills: user.generalSkills || '', // Ensure default value
        aboutYou: user.aboutYou || '',
        languageSpoken: user.languageSpoke || ''
    });

    // Function to handle form submission
    const handlePress = async () => {
        if (form.generalSkills === "" || form.aboutYou === "" || form.languageSpoken === "") {
            Alert.alert("Error", "Please fill in all the fields");
            return;
        }

        setIsSubmitting(true);
        try {
            // Update each attribute using the new updateUserAttribute function
            await updateUserAttribute(user.$id, 'generalSkills', form.generalSkills);
            await updateUserAttribute(user.$id, 'aboutYou', form.aboutYou);
            await updateUserAttribute(user.$id, 'languageSpoken', form.languageSpoken);
            router.replace("/allowNotification");
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
          
                <View className="w-full px-4 my-6">
                    <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
                        Which skills best define you?
                    </Text>

                    <FormField
                        title="General Skills"
                        value={form.generalSkills}
                        handleChangeText={(e) => setForm({ ...form, generalSkills: e })}
                        otherStyles="mt-10"
                    />

                    <FormField
                        title="About You"
                        value={form.aboutYou}
                        handleChangeText={(e) => setForm({ ...form, aboutYou: e })}
                        otherStyles="mt-7"
                        otherStyles2="h-60"
                    />

                    <FormField
                        title="Language Spoken"
                        value={form.languageSpoken}
                        handleChangeText={(e) => setForm({ ...form, languageSpoken: e })}
                        otherStyles="mt-7"
                    />

                </View>

                
                <IconButton
                        handlePress={handlePress}
                        containerStyles="mt-7"
                        isLoading={isSubmitting}
                    />
            </ScrollView>
        </SafeAreaView>
    );
};

export default Skills;
