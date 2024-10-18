// ProjectsSection.js

import React from "react";
import { Image, Text, View } from "react-native";

const getSize = (index, totalProjects) => {
  // Handle size when only one project is uploaded
  if (totalProjects === 1) {
    return { height: 180, width: 200 }; // Size for single project
  }

  // Handle size when two projects are uploaded
  if (totalProjects === 2) {
    return { height: 160, width: 140 }; // Size for two projects
  }

  // Handle size when three projects are uploaded
  if (totalProjects === 3) {
    return { height: 150, width: 130 }; // Size fossr three projects
  }

  // Handle size for 4 or more projects with specific sizes for each index
  if (totalProjects >= 4) {
    switch (index) {
      case 0:
        return { height: 160, width: 120 }; // Size for the first project
      case 1:
        return { height: 140, width: 100 };
      case 2:
        return { height: 180, width: 120 };
      case 3:
        return { height: 155, width: 120, marginTop: -12 };
      case 4:
        return { height: 177, width: 100, marginTop: -33 };
      case 5:
        return { height: 138, width: 120, marginTop: 7 };
      default:
        return { height: 140, width: 100, marginTop: 10 };
    }
  }

  // Default size for any other case
  return { height: 140, width: 100 };
};


const ProjeComponents = ({ projects }) => {
  const totalProjects = projects.length; // Calculate total number of projects

  return (
    <View className="flex-row flex-wrap justify-between mt-3.5">
      {totalProjects > 0 ? (
        projects.map((project, index) => {
          const size = getSize(index, totalProjects); // Pass totalProjects to getSize
          return (
            <Image
              key={index}
              source={{ uri: project }}
              className="rounded-2xl border-2 border-white"
              style={{
                height: size.height,
                width: size.width,
                marginTop: size.marginTop,
                borderRadius: 16,
              }}
              onError={() => console.log("Project load error")}
            />
          );
        })
      ) : (
        <View className="h-[160px] w-[160px] rounded-2xl bg-black justify-center items-center mt-3.5">
          <Text className="text-2xl text-white">No project Available</Text>
        </View>
      )}
    </View>
  );
};


export default ProjeComponents;




