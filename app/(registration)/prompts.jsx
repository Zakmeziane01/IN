import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, Image, TextInput, Pressable } from 'react-native';
import { images, stepsBar } from "../../constants";
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import CustomButton from "../../components/CustomButton";
import { useGlobalContext } from '../../context/GlobalProvider';
import { useUserContext } from '../../context/UserContext';
import { updateUserAttribute } from '../../lib/appwrite';
import DropDown from '../../components/DropDown';
import { icons } from "../../constants";

/**
 * Component for handling prompts and user responses.
 * @returns None
 */
const Prompts = () => {
  const { user } = useGlobalContext();                         // Get user info from global context
  const { updateResponse } = useUserContext();                 // Update user response in user context
  const [selectedPrompts, setSelectedPrompts] = useState([]);  // Store selected prompts
  const [currentPrompt, setCurrentPrompt] = useState("");      // Current selected prompt
  const [currentAnswer, setCurrentAnswer] = useState("");      // Current answer to prompt
  const [isSubmitting, setIsSubmitting] = useState(false);     // State for submission loading

  /**
   * Handles the submission of prompts and answers, updating user attributes and responses accordingly.
   * @returns None
   */

  const handlePress = async () => {
      // Validation for minimum prompts and answer
      if (selectedPrompts.length < 2) {
        Alert.alert("Error", "Please select at least 2 prompts.");
        return;
      }
      if (currentPrompt && !currentAnswer) {
        Alert.alert("Error", "Please provide an answer to the selected prompt.");
        return;
      }
    setIsSubmitting(true);
    
      try {
        const promptsString = JSON.stringify(selectedPrompts);              // Convert prompts to string
        await updateUserAttribute(user.userId, "prompts", promptsString);   // Update user attribute in Appwrite
        updateResponse("prompts", promptsString);                           // Update user context
        router.push("/home");                                        // Navigate to next screen
      } catch (error) {
        Alert.alert("Error", error.message); 
      } finally {
        setIsSubmitting(false);
      }
  };

  const handlePromptChange = (selectedPrompt) => {
    setCurrentPrompt(selectedPrompt);                                       // Update current prompt
  };

  const handleAnswerChange = (text) => {
    setCurrentAnswer(text);                                                 // Update current answer
  };

  const handleAddPrompt = () => {
    // Allow a maximum of 2 prompts
    if (selectedPrompts.length >= 2) {
      Alert.alert("Limit Reached", "You can only select up to 2 prompts.");
      return;
    }
    if (currentPrompt && currentAnswer) {
      // Add prompt and answer to the list
      setSelectedPrompts((prev) => [...prev, { prompt: currentPrompt, answer: currentAnswer }]);
      setCurrentPrompt(""); // Reset prompt field
      setCurrentAnswer(""); // Reset answer field
    } else {
      Alert.alert("Error", "Please select a prompt and provide an answer.");
    }
  };

  const handleDeletePrompt = (index) => {
    // Remove a selected prompt by index
    setSelectedPrompts((prev) => prev.filter((item, i) => i !== index));
  };

  return (
    <SafeAreaView className="bg-secondary h-full">
      {/* Logo */}
      <View className="items-center justify-center">
        <Image source={images.Wlogo} resizeMode="contain" className="my-0 w-[150px] h-[100px]" />
      </View>

    {/* Main content */}
    <View className="bg-white rounded-t-[35px]">
        <ScrollView className="h-full">
          {/* Step indicator */}
          <Image source={stepsBar.NextStep1} resizeMode="contain" className="w-[365px] h-[50px] mt-7 mb-2 self-center" />

          {/* Instructions */}
          <View className="mx-3 mt-3">
            <Text className="text-1xl text-black text-semibold font-pmedium mx-3 mt-2 ">
              Add questions & their answers that will show on profile.
            </Text>
          </View>

          {/* Dropdown and input */}
          <View className="w-full justify-center px-3 flex-1" style={{ height: 200 }}>
            <DropDown
              selectedValue={currentPrompt}
              onValueChange={handlePromptChange}                  // Handle prompt selection
              items={[
                { label: 'Describe your work style in three words', value: 'Describe your work style in three words' },
                { label: 'What motivates your best work?', value: 'What motivates your best work?' },
                { label: 'Who inspires you professionally?', value: 'Who inspires you professionally?' },
                { label: 'What’s your greatest strength as a team member?', value: 'What’s your greatest strength as a team member?' },
                { label: 'How do you prioritize under pressure?', value: 'How do you prioritize under pressure?' },
                { label: 'Share a quote that inspires you.', value: 'Share a quote that inspires you' },
                { label: 'What are your career goals?', value: 'What are your career goals?' },
                { label: 'How do you celebrate work successes?', value: 'How do you celebrate work successes?' },
              ]}
            />

            {/* Answer input */}
            <View className="relative">
              <TextInput
                value={currentAnswer}
                onChangeText={handleAnswerChange}                 // Handle answer input
                placeholder="Write your answer here..."
                className="border-2 rounded-lg p-2 mt-4 mx-3 border-gray-200 h-16"
                multiline
                style={{ paddingRight: 50 }}
              />
              <Pressable
                onPress={handleAddPrompt}                          // Add selected prompt
                style={{
                  position: 'absolute',
                  right: 24,
                  top: '50%',
                  transform: [{ translateY: -15 }], 
                  borderWidth: 2,
                  borderRadius: 25,
                  borderColor: "#5bb450",
                  width: 25,
                  height: 25,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image 
                  source={icons.pluss}
                  resizeMode='contain' 
                  className="w-[15px] h-[15px] mb-4 self-center"
                />  
              </Pressable>
            </View>
          </View>
          
          {/* Display selected prompts */}
          {selectedPrompts.length > 0 && (
            <View className="mt-3 w-full justify-center px-8">
              {selectedPrompts.map((item, index) => (
                <View
                  key={index}
                  style={{
                    borderWidth: 2,
                    borderColor: '#5bb450',
                    borderRadius: 10,
                    padding: 10,
                    marginBottom: 10,
                    backgroundColor: '#f9f9f9',
                  }}
                >
                  <Text className="text-base mx-3">{item.prompt}</Text>
                  <Text className="text-sm mx-3 text-gray-400">{item.answer}</Text>
                  <Pressable
                    onPress={() => handleDeletePrompt(index)}                       // Delete selected prompt
                    style={{
                      position: 'absolute',
                      right: 10,
                      top: 10,
                    }}
                  >
                    <Image
                      source={icons.cross}
                      resizeMode='contain'
                      className="w-[20px] h-[20px] mb-4 self-center"
                    />
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </ScrollView>


        <View className="w-full justify-center min-h-[20vh] px-3 flex-1 mt-10 ">
          <CustomButton
            title="Next"
            handlePress={handlePress}                                                 // Proceed to next step
            containerStyles="bg-secondary-200 mb-60"
            textStyles="text-center text-white"
            isLoading={isSubmitting}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Prompts;
