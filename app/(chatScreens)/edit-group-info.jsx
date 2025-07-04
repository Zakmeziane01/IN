import React, { useEffect } from "react";
import { Dimensions, TouchableWithoutFeedback, Image, Text, View, ScrollView } from "react-native";
import { images, icons } from "../../constants";
import { useLocalSearchParams } from "expo-router";

const { width, height } = Dimensions.get("window");

const EditGroupInfo = () => {
  const params = useLocalSearchParams();
  const item = params.userItem;

  // Log item data for debugging
  useEffect(() => {
    console.log("Component mounted or updated");
    console.log("Profile Image URL:", item?.photoProfile);

    if (!item?.photoProfile) {
      console.log("No profile image available.");
    }
  }, [item]);

  // Handle career selection (stub function)
  const handleCareerSelect = (careerType) => {
    console.log("Selected career:", careerType);
  };

  if (!item) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-gray-500">No user data available.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="bg-white">
      <View className="flex-1 p-2.5">
        {/* Header Section */}
        <View className="justify-center items-center">
          <Image
            source={images.RectangleFeed}
            resizeMode="contain"
            className="w-[355px] h-[150px] absolute top-0"
          />
          <View className="h-[45px]" />

          {/* Profile Image */}
          {item.photoProfile ? (
            <Image
              source={{ uri: item.photoProfile }}
              resizeMode="contain"
              className="h-40 w-40 rounded-2xl"
              onError={() => console.log("Image load error")}
            />
          ) : (
            <View className="h-40 w-40 rounded-2xl bg-black justify-center items-center">
              <Text className="text-xl text-white">No Image Available</Text>
            </View>
          )}

          {/* User Name */}
          <Text className="text-xl text-black font-bold mb-3 mt-3.5">
            {item.firstName} {item.lastName}
          </Text>
        </View>

        {/* Career Information */}
        <View className="mt-7">
          <Text className="font-bold text-3xl text-secondary-200">INSPIRED</Text>
          <Text className="font-bold text-3xl mt-1">
            {item.careerPath || "No information available"}
          </Text>
        </View>

        {/* About Section */}
        <View className="mt-7">
          <Text
            className="font-bold text-xl"
            style={{
              textDecorationLine: "underline",
              textDecorationColor: "#5bb450",
              textDecorationStyle: "solid",
            }}
          >
            About
          </Text>
          <Text className="text-sm mt-3.5">
            {item.aboutYou || "No information available"}
          </Text>
        </View>

        {/* User Details Section */}
        <View className="mt-7 min-h-[29vh] rounded-2xl border-2 border-gray-200">
          <View className="ml-3.5">
            {/* Birthday */}
            <View className="mt-3.5 flex flex-row items-center">
              <Image source={icons.Birthday} resizeMode="contain" className="w-[30px] h-[30px]" />
              <Text className="text-sm font-medium mx-3.5">
                {item.birthday || "No information available"}
              </Text>
            </View>

            {/* Career/Education */}
            <View className="mt-7 flex flex-row items-center">
              {item.career === "Work part-time" || item.career === "Work full-time" ? (
                <Image source={icons.work} resizeMode="contain" className="w-[30px] h-[30px]" />
              ) : item.career === "Student" ? (
                <Image source={icons.university} resizeMode="contain" className="w-[30px] h-[30px]" />
              ) : (
                <Image source={icons.defaultIcon} resizeMode="contain" className="w-[30px] h-[30px]" />
              )}
              <Text className="text-sm font-medium mx-3.5">
                {item.career === "Work part-time" || item.career === "Work full-time" ? (
                  <TouchableWithoutFeedback onPress={() => handleCareerSelect(item.career)}>
                    <Text>
                      {item.career} {item.employmentRoles ? ` - ${item.employmentRoles}` : ""}
                    </Text>
                  </TouchableWithoutFeedback>
                ) : item.career === "Student" ? (
                  <TouchableWithoutFeedback onPress={() => handleCareerSelect("Student")}>
                    <Text>
                      {item.university} {item.course ? ` - ${item.course}` : ""}
                    </Text>
                  </TouchableWithoutFeedback>
                ) : (
                  <Text>No information available</Text>
                )}
              </Text>
            </View>

            {/* Location */}
            <View className="mt-7 flex flex-row items-center">
              <Image source={icons.locationFeed} resizeMode="contain" className="w-[30px] h-[30px]" />
              <Text className="text-sm font-medium mx-3.5">
                {item.city || "No information available"}
              </Text>
            </View>

            {/* Language */}
            <View className="mt-7 flex flex-row items-center">
              <Image source={icons.languageFeed} resizeMode="contain" className="w-[30px] h-[30px]" />
              <Text className="text-sm font-medium mx-3.5">
                {item.languageSpoken || "No information available"}
              </Text>
            </View>
          </View>
        </View>

        {/* Relationship Status */}
        <View className="border-t-2 border-gray-200 mt-10">
          <View className="flex justify-center items-center mt-3.5">
            <Image source={icons.relationship} resizeMode="contain" className="w-[30px] h-[30px]" />
          </View>
          <Text className="font-bold text-base mt-3.5 text-center">
            {item.projectDivision || "No information available"}
          </Text>
        </View>

        {/* General Skills */}
        <View className="mt-10">
          <View className="border-t-2 border-gray-200" />
          <Text
            className="font-bold text-lg mt-10"
            style={{
              textDecorationLine: "underline",
              textDecorationColor: "#5bb450",
              textDecorationStyle: "solid",
            }}
          >
            General Skills
          </Text>
          <Text className="text-sm mt-3.5">
            {item.generalSkills || "No information available"}
          </Text>
        </View>

        {/* Projects */}
        <View className="mt-7">
          <Text className="font-bold text-xl underline decoration-[#5bb450] decoration-solid">
            Projects
          </Text>
          {item.projects && item.projects.length > 0 ? (
            item.projects.map((project, index) => (
              <Image
                key={index}
                source={{ uri: project }}
                resizeMode="contain"
                className="h-20 w-20 rounded-2xl mt-3.5 mr-2"
                onError={() => console.log("Project load error")}
              />
            ))
          ) : (
            <View className="h-40 w-40 rounded-2xl bg-black justify-center items-center mt-3.5">
              <Text className="text-xl text-white">No Projects Available</Text>
            </View>
          )}
        </View>

        {/* Links */}
        <View className="justify-center mt-7 rounded-2xl border-2 border-gray-200 h-16">
          <Text className="font-bold text-center text-base">
            {item.links || "No Links available"}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default EditGroupInfo;