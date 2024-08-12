import React from "react";
import { Dimensions, TouchableWithoutFeedback, Image, Text, View, ScrollView,  } from "react-native";
import { CheckBadgeIcon } from "react-native-heroicons/solid";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

const DatesCard = ({ item, handleClick }) => {
  console.log("Item details:", item);

  return (
    <View className="relative flex-1 bg-white" style={{ width: width , height: height }}>
      <TouchableWithoutFeedback onPress={() => handleClick(item)}>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 10,
          paddingBottom: 130,
        }}
      >
          <View style={{ flex: 1, padding: 10 }}>
              {/* Name and Profile Picture */}
              <Text className="text-2xl text-black font-bold mb-3 mt-7">
                {item.firstName} {item.lastName}
              </Text>
              {item.photoProfile ? (
                <Image
                  source={{ uri: item.photoProfile }}
                  className="w-full h-2/4 rounded-3xl"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-2/4 bg-green-600 justify-center items-center rounded-3xl">
                  <Text className="text-xl text-white">No Image Available</Text>
                </View>
              )}

              {/* Additional Information */}
              <View className="mt-7">
                <Text className="text-lg text-black mb-7">
                  <Text className="font-bold">About: </Text>{item.aboutYou || "No information available"}
                </Text>
                <View className="border-t-2 border-gray-300 my-4 mt-3 mb-3" />
                <Text className="text-lg text-black mb-7">
                  <Text className="font-bold">Career: </Text>{item.career || "No information available"}
                </Text>
                <View className="border-t-2 border-gray-300 my-4 mt-3 mb-3" />
                <Text className="text-lg text-black mb-7">
                  <Text className="font-bold">Languages: </Text>{item.languageSpoken || "No information available"}
                </Text>
                <View className="border-t-2 border-gray-300 my-4 mt-3 mb-3" />
                <Text className="text-lg text-black mb-7">
                <View className="border-t-2 border-gray-300 my-4 mt-3 mb-3" />
                  <Text className="font-bold">University: </Text>{item.university || "No information available"}
                </Text>
                <View className="border-t-2 border-gray-300 my-4 mt-3 mb-3" />
                <Text className="text-lg text-black mb-7">
                  <Text className="font-bold">Collaborative Network Size: </Text>{item.collaborativeNetworkSize || "No information available"}
                </Text>
                <View className="border-t-2 border-gray-300 my-4 mt-3 mb-3" />
                <Text className="text-lg text-black mb-7">
                  <Text className="font-bold">Course: </Text>{item.course || "No information available"}
                </Text>
              </View>
            </View>
          </ScrollView>

      </TouchableWithoutFeedback>



    </View>
  );
};

export default DatesCard;
