import { View, Text, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { updatePhoneNumber } from "../../lib/appwrite";
import FormField from '../../components/FormField';
import CustomButton from "../../components/CustomButton";
import { useGlobalContext } from "../../context/GlobalProvider";

const PhoneAuth = () => {
  const { user } = useGlobalContext();
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    if (phone === "") {
      Alert.alert("Error", "Please enter your phone number");
      return;
    }

    setIsSubmitting(true);
    try {
      await updatePhoneNumber(user.$id, phone);
      Alert.alert("Success", "Phone number updated successfully");
      // Navigate to the next screen or home page
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView>
      <View>
        <Text>Enter your phone number</Text>
        <FormField
          label="Phone Number"
          value={phone}
          onChangeText={(text) => setPhone(text)}
        />
        <CustomButton
          title={isSubmitting ? "Submitting..." : "Submit"}
          onPress={submit}
          disabled={isSubmitting}
        />
      </View>
    </SafeAreaView>
  );
};

export default PhoneAuth;
