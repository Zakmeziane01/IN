import React, { useState, useEffect, useRef } from "react";
import { View, Text, Dimensions, TouchableOpacity, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Carousel from "react-native-snap-carousel";
import DatesCard from "../../components/DatesCard";
import DatesCardGroup from "../../components/DatesCardGroup";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useGlobalContext } from "../../context/GlobalProvider";
import { getAllUsers, addMatch, createChatRoom, checkMatchExists, getChatRoomId } from "../../lib/appwrite";
import { router } from "expo-router";

const { width } = Dimensions.get("window");
const android = Platform.OS === "android";

const Home = () => {
  const { user } = useGlobalContext();
  const [users, setUsers] = useState([]);
  const [websocket, setWebSocket] = useState(null);
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);      //Keeps track of the current item in the carousel.

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        setUsers(response);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();

    const ws = new WebSocket('ws://localhost:8080');    //Sets up a WebSocket connection to 'ws://localhost:8080'.   common in development environments where you're testing both the client and server on the same machine.   common in development environments where you're testing both the client and server on the same machine.
  
    ws.onopen = () => {
      console.log('WebSocket connected');
      setWebSocket(ws);
    };

    ws.onmessage = (event) => {
      console.log('Message from server:', event.data);
      // Handle incoming messages
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setWebSocket(null);
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleMessagePress = async () => {
    try {
      const currentUser = user;
      if (!currentUser) throw new Error("No current user found");

      const selectedUser = users[currentIndex];
      if (selectedUser && currentUser.userId !== selectedUser.userId) {
        // Check if match already exists
        const matchExists = await checkMatchExists(currentUser.userId, selectedUser.userId);
        if (!matchExists) {
          await addMatch(currentUser.userId, selectedUser.userId);
        }

        // Check if chat room already exists
        let chatRoomId = await getChatRoomId(currentUser.userId, selectedUser.userId);
        if (!chatRoomId) {
          chatRoomId = await createChatRoom(currentUser.userId, selectedUser.userId);
        }

        if (chatRoomId) {

          router.push(`/chatDetailsScreen?chatRoomId=${chatRoomId}`);
          // Notify other clients about the new chat room
          if (websocket) {
            websocket.send(JSON.stringify({ type: 'NEW_CHAT_ROOM', chatRoomId }));
          }
        } else {
          console.error("Failed to create chat room");
        }
      } else {
        console.log("Cannot match with yourself");
      }
    } catch (error) {
      console.error("Error handling message press:", error);
    }
  };

  const handleRefusePress = () => {                        //Moves the carousel to the next item.
    if (carouselRef.current) {
      const nextIndex = (currentIndex + 1) % users.length;
      carouselRef.current.snapToItem(nextIndex);
      setCurrentIndex(nextIndex);
    }
  };

  const renderItem = ({ item }) => (                    //Renders each item in the carousel using the DatesCard component.
    <DatesCard item={item} handleClick={(clickedItem) => console.log('Card clicked')} />  
  );

  return (
    <SafeAreaView className={`flex-1 bg-white ${android ? 'pt-2' : 'pt-0'}`}>

        <ScrollView className="bg-white h-full">   
          <View className="mt-10">
            <DatesCardGroup>   
            </DatesCardGroup>  
          </View> 

          <View className="flex-1 justify-center">
              <Carousel
                ref={carouselRef}
                data={users}
                renderItem={renderItem}
                sliderWidth={width}
                itemWidth={width * 0.95}
                inactiveSlideScale={0.9}
                inactiveSlideOpacity={0.3}
                onSnapToItem={(index) => setCurrentIndex(index)}
              />
            </View>
        </ScrollView>


            <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 14 }}>
              <TouchableOpacity
                style={{ backgroundColor: "blue", borderRadius: 8, padding: 10, marginRight: 14 }}
                onPress={handleMessagePress}
              >
                <Text style={{ color: "white", fontSize: 18 }}>Send</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ backgroundColor: "red", borderRadius: 8, padding: 10 }}
                onPress={handleRefusePress}
              >
                <Text style={{ color: "white", fontSize: 18 }}>Next</Text>
              </TouchableOpacity>
            </View>

      </SafeAreaView>
        );
      };

export default Home;
