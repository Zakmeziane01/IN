import React, { useState, useEffect } from "react";
import { View, TextInput, Button, FlatList, Text, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, SafeAreaView } from "react-native";
import { fetchMessages, sendMessage } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';

const ChatScreen = () => {
  const { chatRoomId } = useLocalSearchParams();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useGlobalContext();

  if (!chatRoomId) {
    Alert.alert("Error", "Chat room ID is missing.");
    return null;
  }

  useEffect(() => {
    const loadMessages = async () => {
      setLoading(true);
      try {
        const fetchedMessages = await fetchMessages(chatRoomId);
        setMessages(fetchedMessages);
      } catch (error) {
        console.error("Error loading messages:", error);
        Alert.alert("Error", "Failed to load messages.");
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [chatRoomId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const newMessageData = { chatRoomId, senderId: user.userId, content: newMessage };
      await sendMessage(chatRoomId, user.userId, newMessage);
      setNewMessage("");
      setMessages((prevMessages) => [...prevMessages, newMessageData]);
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert("Error", "Failed to send message.");
    }
  };

  if (loading) {
    return (
      <View className={`flex-1 justify-center items-center bg-white`}>
        <ActivityIndicator size="large" color="#00b894" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View className={`flex-1 bg-white`}>
          <FlatList
            data={messages}
            keyExtractor={(item) => item.$id}
            renderItem={({ item }) => (
              <View className={`p-4 ${item.senderId === user.userId ? 'bg-green-100' : 'bg-white'} mb-2 border border-gray-300 rounded-lg`}>
                <Text className={`text-sm ${item.senderId === user.userId ? 'text-green-800' : 'text-gray-800'}`}>
                  {item.senderId === user.userId ? "You" : "Other"}: {item.content}
                </Text>
              </View>
            )}
            style={{ flex: 1 }}
          />
          <View className={`p-4 border-t border-gray-300 bg-white`}>
            <TextInput
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Type a message"
              className={`border border-gray-300 p-3 rounded-lg`}
            />
            <Button title="Send" onPress={handleSendMessage} color="#00b894" />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
