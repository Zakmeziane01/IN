import React, { useEffect } from "react";
import { Dimensions, TouchableWithoutFeedback, Image, Text, View} from "react-native";
import {images, icons} from "../constants";
import ProjeComponents from './ProjectComponents';
const { width, height } = Dimensions.get("window");


const DatesCard = ({ item, handleClick }) => {

  const handleCareerSelect = (careerType) => {
    onCareerSelect(careerType);
  };


  useEffect(() => {
    console.log("Component mounted or updated");
    console.log("Profile Image URL:", item.projects);

    if (!item.photoProfile) {
      console.log("No profile image available.");
    }
  }, [item]);

  return (
  
  <TouchableWithoutFeedback onPress={() => handleClick(item)}>
     <View className="flex-1 p-2.5">    
      
          <View className="justify-center items-center">
          <Image 
            source={images.RectangleFeed} 
            resizeMode='contain' 
            className="w-[355px] h-[150px] absolute top-0" // Use absolute positioning
          />
          <View className="h-[45px]" /> 

          {/* Conditional rendering for the profile image */}
          {item.photoProfile ? (
            <Image
              source={{ uri: item.photoProfile }}
              resizeMode="contain"
              className="h-40 w-40 rounded-2xl" // Keep this relative to ensure it stays in place
              onError={() => console.log('Image load error')}
            />
          ) : (
            <View className="h-40 w-40 rounded-2xl bg-black justify-center items-center relative">
              <Text className="text-xl text-white">No Image Available</Text>
            </View>
          )}

          <Text className="text-xl text-black font-bold mb-3 mt-3.5">
            {item.firstName} {item.lastName}
          </Text>
        </View>


              {/* Additional Information */}
         <View className="mt-7 ">

            <View className="mb-7">
              <Text className="font-bold text-3xl text-secondary-200">INSPIRED</Text>
              <Text className="font-bold text-3xl mt-1">{item.careerPath || "No information available"}</Text>
            </View>

           <View className="mt-7">
              <Text className="font-bold text-xl" style={{ textDecorationLine: 'underline', textDecorationColor: '#5bb450', textDecorationStyle: 'solid' }}>
                About
              </Text>
              <Text className="text-sm mt-3.5">{item.aboutYou || "No information available"}</Text>
          </View>


          <View className="mt-7 min-h-[29vh] rounded-2xl border-2 border-gray-200"> 
            <View className="ml-3.5">         
                    <View className="mt-3.5 flex flex-row items-center">
                      <Image 
                        source={icons.Birthday}
                        resizeMode='contain' 
                        className="w-[30px] h-[30px]"
                      />
                      <Text className="text-sm font-medium mx-3.5">{item.birthday || "No information available"}</Text>
                    </View>
                    

                    <View className="mt-7 flex flex-row items-center">
                        {item.career === 'Work part-time' || item.career === 'Work full-time' ? (
                          <Image 
                            source={icons.work}
                            resizeMode='contain' 
                            className="w-[30px] h-[30px]"
                          />
                        ) : item.career === 'Student' ? (
                          <Image 
                            source={icons.university} // Assuming you have an icon for university
                            resizeMode='contain' 
                            className="w-[30px] h-[30px]"
                          />
                        ) : (
                          <Image 
                            source={icons.defaultIcon}                        //The default icon is used when the item.career value does not match any of the specified conditions ('Work part-time', 'Work full-time', or 'Student').
                            resizeMode='contain' 
                            className="w-[30px] h-[30px]"
                          />
                        )}
                        <Text className="text-sm font-medium mx-3.5">{(item.career === 'Work part-time' || item.career === 'Work full-time') ? (
                          <TouchableWithoutFeedback onPress={() => handleCareerSelect(item.career)}>
                            <Text>{item.career} {item.employmentRoles ? ` - ${item.employmentRoles}` : ""}</Text>
                          </TouchableWithoutFeedback>
                        ) : item.career === 'Student' ? (
                          <TouchableWithoutFeedback onPress={() => handleCareerSelect('Student')}>
                            <Text>{item.university}{item.course ? ` - ${item.course}` : ""}</Text>
                          </TouchableWithoutFeedback>
                        ) : (
                          <Text>No information available</Text>
                        )}
                      </Text>
                  </View>

                <View className="mt-7 flex flex-row items-center">     
                    <Image 
                        source={icons.locationFeed}
                        resizeMode='contain' 
                        className="w-[30px] h-[30px]"
                      />
                    <Text className="text-sm font-medium mx-3.5"> {item.city || "No information available"}</Text>
                </View>
                    
                
                
                <View className="mt-7 flex flex-row items-center"> 
                    <Image 
                        source={icons.languageFeed}
                        resizeMode='contain' 
                        className="w-[30px] h-[30px]"
                      />
                      <Text className="text-sm font-medium mx-3.5">{item.languageSpoken || "No information available"}</Text>
              </View>
              </View> 
          </View>

        <View className="border-t-2 border-gray-200  mt-10">
          <View className="flex justify-center items-center mt-3.5">
            <Image 
              source={icons.relationship}
              resizeMode='contain' 
              className="w-[30px] h-[30px] "
            />
          </View>
          <Text className="font-bold text-base mt-3.5 text-center">{item.projectDivision || "No information available"}</Text>
        </View>


        <View className="mt-10">
        <View className="border-t-2 border-gray-200"/>
        <Text className="font-bold text-lg mt-10" style={{ textDecorationLine: 'underline', textDecorationColor: '#5bb450', textDecorationStyle: 'solid' }}>General Skills</Text>
        <Text className="text-sm mt-3.5">{item.generalSkills || "No information available"} </Text>
        
        </View>
   </View>
    
       <View className="mt-8">
          <Text className="font-bold text-xl underline decoration-[#5bb450] decoration-solid">
            Projects
          </Text>
           <ProjeComponents 
           projects={item.projects} />
       </View>



      <View className="justify-center mt-7 rounded-2xl border-2 border-gray-200 h-16">
        <Text className="font-bold text-center text-base">{item.links || "No Links available"}</Text>
      </View>

    
</View>
     

      </TouchableWithoutFeedback>

      
  );
  
};

export default DatesCard;



