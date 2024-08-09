import { View, Text, TextInput, Button, Alert, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { router } from 'expo-router';
import { verifyEmail } from '../../lib/appwrite'; // Import your verification function

const VerifyEmail = () => {
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (code.trim() === '') {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }

    setIsSubmitting(true);

    try {
      // Call the function to verify the email
      await verifyEmail(code);
      Alert.alert('Success', 'Email verified successfully');
      router.replace('/sign-in'); // Redirect to sign-in page or next step
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
      <View>
        <Text>Please enter the verification code sent to your email:</Text>
        <TextInput
          value={code}
          onChangeText={setCode}
          placeholder="Verification Code"
          keyboardType="numeric"
          style={{ borderWidth: 1, padding: 8, marginTop: 16 }}
        />
        <Button title="Verify" onPress={handleSubmit} disabled={isSubmitting} />
      </View>
    </SafeAreaView>
  );
};

export default VerifyEmail;
