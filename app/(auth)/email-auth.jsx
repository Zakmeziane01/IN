import { View, Text, TextInput, Button, Alert, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { router } from 'expo-router';
import { verifyEmail } from '../../lib/appwrite'; 

const VerifyEmail = () => {
  const [code, setCode] = useState('');                           // State to hold the verification code input
  const [isSubmitting, setIsSubmitting] = useState(false);        // State to handle submission status

  const handleSubmit = async () => {
    if (code.trim() === '') {                                     // Check if the code input is empty
      Alert.alert('Error', 'Please enter the verification code'); // Alert if the code is empty
      return;
    }

    setIsSubmitting(true);                                        // Set submitting state to true while processing the request

    try {
      // Call the function to verify the email with the entered code
      await verifyEmail(code);
      Alert.alert('Success', 'Email verified successfully'); 
      router.replace('/sign-in');                                // Redirect to sign-in page after successful verification
    } catch (error) {
      Alert.alert('Error', error.message); 
    } finally {
      setIsSubmitting(false);                                   // Reset submitting state after handling the response
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', padding: 16 }}> 
      <View>
        <Text>Please enter the verification code sent to your email:</Text>   
        <TextInput
          value={code}
          onChangeText={setCode}                                // Update the code state as the user types
          placeholder="Verification Code"                       // Placeholder text for the input field
          keyboardType="numeric"                                // Ensure the keyboard is numeric
          style={{ borderWidth: 1, padding: 8, marginTop: 16 }} // Styling for the input field
        />
        <Button title="Verify" onPress={handleSubmit} disabled={isSubmitting} /> {/* Button to submit the form */}
      </View>
    </SafeAreaView>
  );
};

export default VerifyEmail;
