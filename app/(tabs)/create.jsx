import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Platform,
} from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { getMessages, sendMessage, getCurrentUser } from "../../lib/appwrite"; 
import { router } from "expo-router";

const android = Platform.OS === "android";

const Create = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messageBody, setMessageBody] = useState('');
  const [user, setUser] = useState(null);

  // Fetch current user and messages
  useEffect(() => {
    const fetchUserAndMessages = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);

        const messagesData = await getMessages();
        setMessages(messagesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndMessages();
  }, []);

  // Handle sending a message
  const handleSubmit = async () => {
    if (!messageBody.trim()) {
      setError('Message cannot be empty');
      return;
    }

    try {
      const response = await sendMessage(user, messageBody);
      setMessages(prevMessages => [response, ...prevMessages]);
      setMessageBody('');
      setError(null);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error: {error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ paddingTop: android ? hp(3) : 0 }}>
      <View className="px-4">
        <Text className="uppercase font-semibold text-neutral-500 tracking-wider">
          Matches
        </Text>
      </View>
      
      {/* Chat List */}
      <View className="px-4">
        <View className="border-b border-neutral-300 py-4">
          <Text className="uppercase font-semibold text-neutral-500 tracking-wider">
            CHAT
          </Text>
        </View>

        <FlatList
          data={messages}
          keyExtractor={(item) => item.$id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="w-full py-3 items-center flex-row border-b border-neutral-300"
              onPress={() =>
                router.push("./chatDetailsScreen", {
                  chat: item.body,
                  imgUrl: item.imgUrl,
                  name: item.username,
                  age: item.age,
                })
              }
            >
              {/* Avatar */}
              <View className="w-[17%] justify-center" style={{ width: hp(7), height: hp(7) }}>
                <Image
                  source={{ uri: item.imgUrl }}
                  style={{ width: "90%", height: "90%" }}
                  className="rounded-full"
                />
              </View>

              {/* Information */}
              <View className="w-[82%]" style={{ height: hp(6) }}>
                <View className="flex-row justify-between items-center">
                  <View className="flex-row justify-center">
                    <View className="flex-row">
                      <Text className="font-bold text-base">
                        {item.username}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-sm tracking-tight">
                    {item.timeSent}
                  </Text>
                </View>
                <View>
                  <Text className="font-semibold text-xs text-neutral-500">
                    {item.body.length > 45 ? item.body.slice(0, 45) + "..." : item.body}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Message Input */}
      <View className="mx-4 mt-6 flex-row items-center rounded-2xl bg-neutral-200 px-3 py-4">
        <TextInput
          value={messageBody}
          onChangeText={setMessageBody}
          placeholder="Type a message"
          placeholderTextColor={"gray"}
          style={{ fontSize: hp(1.7) }}
          className="flex-1 text-base mb-1 pl-1 tracking-widest"
        />
        <TouchableOpacity onPress={handleSubmit}>
          <Text className="font-bold text-base">Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Create;
