import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const ChatsLayout = () => {
  return (
    <>
      {/* Navigation stack for chat-related screens */}
      <Stack>
        <Stack.Screen name="chat" options={{ headerShown: false }} />
        <Stack.Screen name="first-chat" options={{ headerShown: false }} />
        <Stack.Screen name="testscreen" options={{ headerShown: false }} />
        <Stack.Screen name="new-group" options={{ headerShown: false }} />
        <Stack.Screen name="chat-progression" options={{ headerShown: false }} />
        <Stack.Screen name="chat-info" options={{ headerShown: false }} />
        <Stack.Screen name="edit-group-info" options={{ headerShown: false }} />
      </Stack>
      {/* Status bar with dark style and white background */}
      <StatusBar backgroundColor="#ffffff" style="dark" />
    </>
  );
};

export default ChatsLayout;