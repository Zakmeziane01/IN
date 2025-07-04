// ProjectsSection.js

import React, { useState } from "react";
import { Image, Text, View, Modal, TouchableOpacity } from "react-native";


const getSize = (index, totalProjects) => {

  if (totalProjects === 1) {
    return { height: 250, width: 350 }; // Size for two projects
  }

  if (totalProjects === 2) {
    switch (index) {
      case 0:
    return { height: 175, width: 180 }; // Size for single project
      case 1:
    return { height: 175, width: 180, marginTop: 75 };    
  }
}
  // Handle size when three projects are uploaded
  if (totalProjects === 3) {
    switch (index) {
      case 0:
    return { height: 175, width: 180 }; // Size for single project
      case 1:
    return { height: 175, width: 180 }; 
      case 2:
    return { height: 190, width: 368, marginTop: 3 };       
  }
}

  if (totalProjects === 4) {
    switch (index) {
      case 0:
    return { height: 175, width: 180 }; // Size for single project
      case 1:
    return { height: 175, width: 180 }; 
      case 2:
    return { height: 175, width: 180, marginTop: 6};  
      case 3:
    return { height: 175, width: 180, marginTop: 6};       
  }
}

  // Handle size when three projects are uploaded
  if (totalProjects === 5) {
    switch (index) {
      case 0:
    return { height: 175, width: 180 }; // Size for single project
      case 1:
    return { height: 175, width: 180 }; 
      case 2:
    return { height: 175, width: 180 };  
      case 3:
    return { height: 175, width: 180}; 
      case 4:
    return { height: 175, width: 350};       
  }
}

  // Handle size for 4 or more projects with specific sizes for each index
  if (totalProjects >= 6) {
    switch (index) {
      case 0:
        return { height: 160, width: 130 }; // Size for the first project
      case 1:
        return { height: 140, width: 100 };
      case 2:
        return { height: 180, width: 123 };
      case 3:
        return { height: 155, width: 130, marginTop: -12 };
      case 4:
        return { height: 177, width: 100, marginTop: -33 };
      case 5:
        return { height: 138, width: 123, marginTop: 7 };
      default:
        return { height: 140, width: 100, marginTop: 10 };
    }
  }

  // Default size for any other case
  return { height: 140, width: 100 };
};


const ProjeComponents = ({ projects }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const totalProjects = projects.length; // Calculate total number of projects

  const handleImagePress = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  return (
    <View>
      {/* Conditionally render the title only if there are projects */}
      {totalProjects > 0 && (
        <Text className="font-bold text-xl underline decoration-[#5bb450] decoration-solid ml-3.5">
          Projects
        </Text>
      )}

      <View className="flex-row flex-wrap justify-between mt-3.5">
        {totalProjects > 0 ? (
          projects.map((project, index) => {
            const size = getSize(index, totalProjects); // Pass totalProjects to getSize
            return (
              <TouchableOpacity key={index} onPress={() => handleImagePress(project)}>
                <Image
                  source={{ uri: project }}
                  className="rounded-2xl border-2 border-gray-300"
                  style={{
                    height: size.height,
                    width: size.width,
                    marginTop: size.marginTop,
                    borderRadius: 16,
                  }}
                  onError={() => console.log("Project load error")}
                />
              </TouchableOpacity>
            );
          })
        ) : null}

        {/* Modal for displaying enlarged image */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity style={{ flex: 1, width: '100%' }} onPress={() => setModalVisible(false)}>
              <Image
                source={{ uri: selectedImage }}
                style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
              />
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </View>
  );
};


export default ProjeComponents;




