import React, { useState } from "react";
import { SafeAreaView, Text, Alert } from "react-native";
import { useRouter } from "expo-router";
import CustomButton from "../../components/CustomButton";
import { logOut, getCurrentUser } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

export default function SettingScreen() {
  const {user, setUser, setIsLogged} = useGlobalContext();
  const router = useRouter();
  const [isSubmitting, setSubmitting] = useState(false);

  const handlePressLogOut = async () => {
    setSubmitting(true);
    try {
      // Check for existing session
      const currentUser = await getCurrentUser();
      if (currentUser) {
        // Log out the current user
        
        await logOut();
        setUser(null);
        setIsLogged(false);
        router.replace("/sign-in");
        
      } else {
        // Handle the case where no user is currently logged in
        Alert.alert("Error", "No user is currently logged in.");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <Text className="text-xl font-bold mb-4">Settings</Text>
      <CustomButton
        title="Log Out"
        handlePress={handlePressLogOut}
        isLoading={isSubmitting}
      />
    </SafeAreaView>
  );
}
