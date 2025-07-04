import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { ID } from 'react-native-appwrite';

// Custom components and utilities
import { icons, images } from '../../constants';
import { databaseId, databases, getChatroomStep, getCurrentUser, messagesCollectionId, updateChatroomStep, updateRequestAuthor, updateStepRequest } from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite';
import CustomButton from '../../components/CustomButton';

const chatProgression = () => {
  const params = useLocalSearchParams();
  const chatroomId = params.chatroomId;
  const groupAdmin = params.groupAdmin;
  const isGroup = params.isGroup;

  const { data: currentUser } = useAppwrite(getCurrentUser);
  const { data: step, refetch } = useAppwrite(() => getChatroomStep(chatroomId));
  const [hasRefetched, setHasRefetched] = useState(false);

  const steps = ['matched', 'startconversation', 'planning', 'startworking'];

  // Refetch data when the screen is focused
  useFocusEffect(() => {
    if (!hasRefetched) {
      setHasRefetched(true);
      setTimeout(function () {
        refetch();
        setHasRefetched(false);
      }, 5000); // Refetch data only once when the tab is focused
    }
  });

  // Send a stage change alert message
  const stageChangeAlert = async () => {
    let payload = {
      body: 'This chat changed stage',
      username: 'alerta',
      chatroomId: chatroomId,
      senderId: 'alerta',
    };

    let response = await databases.createDocument(
      databaseId,
      messagesCollectionId,
      ID.unique(),
      payload
    );
  };

  // Move to the next stage
  const NextStep = async () => {
    const currentIndex = steps.indexOf(step);
    if (isGroup === "true") {
      if (currentIndex < steps.length - 1) {
        const newStep = steps[currentIndex + 1];
        updateChatroomStep(chatroomId, newStep);
        stageChangeAlert();
      } else {
        console.log("You're already at the last step.");
      }
    } else {
      if (currentIndex < steps.length - 1) {
        updateRequestAuthor(chatroomId, "this");
        updateStepRequest(chatroomId, "next");
      } else {
        console.log("You're already at the last step.");
      }
    }
  };

  // Move to the previous stage
  const PrevStep = async () => {
    const currentIndex = steps.indexOf(step);
    if (isGroup === "true") {
      if (currentIndex > 0) {
        const newStep = steps[currentIndex - 1];
        updateChatroomStep(chatroomId, newStep);
        stageChangeAlert();
      } else {
        console.log("You're already at the first step.");
      }
    } else {
      if (currentIndex > 0) {
        updateRequestAuthor(chatroomId, "this");
        updateStepRequest(chatroomId, "previous");
      } else {
        console.log("You're already at the first step.");
      }
    }
  };

  return (
    <SafeAreaView className="bg-primary">
      {/* Header Section */}
      <View className="pt-3 justify-center flex-row">
        <TouchableOpacity className="pr-2" onPress={() => { router.back(); }}>
          <Image
            className="w-[26px] h-[40px]"
            source={icons.backArrowB}
            resizeMode='fill'
          />
        </TouchableOpacity>
        <Text className="text-secondary font-pmedium pt-1.5 text-3xl">
          Collaboration Progress
        </Text>
      </View>

      {/* Progress Section */}
      <ScrollView className="bg-primary h-full">
        <View className="flex-row">
          {/* Progress Image */}
          {step === 'matched' ? (
            <Image
              className="h-[650px] w-[60px] m-4"
              source={images.progress1}
              resizeMode='contain'
            />
          ) : step === 'startconversation' ? (
            <Image
              className="h-[650px] w-[60px] m-4"
              source={images.progress2}
              resizeMode='contain'
            />
          ) : step === 'planning' ? (
            <Image
              className="h-[650px] w-[60px] m-4"
              source={images.progress3}
              resizeMode='contain'
            />
          ) : step === 'startworking' ? (
            <Image
              className="h-[650px] w-[60px] m-4"
              source={images.progress4}
              resizeMode='contain'
            />
          ) : (
            <Image
              className="h-[650px] w-[60px] m-4"
              source={images.progress5}
              resizeMode='contain'
            />
          )}

          {/* Navigation Buttons */}
          <View className="m-1.5 flex-grow">
            <CustomButton
              handlePress={PrevStep}
              title={"Previous Step"}
              containerStyles={"bg-[#162222]"}
              textStyles={"text-white"}
            />
            <CustomButton
              handlePress={NextStep}
              title={"Next Step"}
              containerStyles={"bg-secondary"}
              textStyles={"text-white"}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default chatProgression;