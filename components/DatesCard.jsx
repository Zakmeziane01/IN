import React, { useEffect } from "react";
import {TouchableWithoutFeedback, Image, Text, View, Pressable} from "react-native";
import {images, icons} from "../constants";
import ProjeComponents from './ProjectComponents';
import { Linking } from "react-native";



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

  const parsedPrompts = item.prompts ? JSON.parse(item.prompts) : [];

  const handleLinkPress = (link) => {
    if (link) {
      // Logic to open the link, e.g., using Linking API
      Linking.openURL(link).catch(err => console.error("An error occurred", err));
    } else {
      console.log("No link available");
    }
  };


  return (
  
  <TouchableWithoutFeedback onPress={() => handleClick(item)}>
    
     <View>    
      
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

            <View className="mb-7 ml-3.5">
              <Text className="font-bold text-3xl text-secondary-200">INSPIRED</Text>
              <Text className="font-bold text-3xl mt-1">
                {item.careerPath ? item.careerPath.split(', ')[0] : "No information available"}
              </Text>
            </View>

           <View className="mt-7 rounded-lg border-2 border-white bg-white shadow-sm">
           <View className="my-3.5">
              <Text className="font-bold text-xl ml-3.5" style={{ textDecorationLine: 'underline', textDecorationColor: '#5bb450', textDecorationStyle: 'solid' }}>
                About
              </Text>
              <Text className="text-sm mt-2 ml-3.5">{item.aboutYou || "No information available"}</Text>
              </View>
          </View>


          <View className="mt-3.5 min-h-[30vh] rounded-lg border-2 border-white bg-white shadow-sm"> 
            <View className="ml-3.5">  

                    <View className="mt-3.5 flex flex-row items-center">
                    <View className="bg-[#d4e8ce] w-[30px] h-[30px] rounded-full items-center justify-center">
                      <Image 
                        source={icons.Birthday}
                        resizeMode='contain' 
                        className="w-[15px] h-[15px]"
                      /></View>
                      <Text className="text-sm font-medium mx-3.5">{item.age || "No information available"}</Text>
                    </View>
                    

                    <View className="mt-7 flex flex-row items-center">
                    <View className="bg-[#d4e8ce] w-[30px] h-[30px] rounded-full items-center justify-center">
                        {item.career === 'Work part-time' || item.career === 'Work full-time' ? (
                          <Image 
                            source={icons.work}
                            resizeMode='contain' 
                            className="w-[15px] h-[15px]"
                          />
                        ) : item.career === 'Student' ? (
                          <Image 
                            source={icons.university} // Assuming you have an icon for university
                            resizeMode='contain' 
                            className="w-[15px] h-[15px]"
                          />
                        ) : (
                          <Image 
                            source={icons.defaultIcon}                        //The default icon is used when the item.career value does not match any of the specified conditions ('Work part-time', 'Work full-time', or 'Student').
                            resizeMode='contain' 
                            className="w-[15px] h-[15px]"
                          />
                        )}
                        </View>

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
                  <View className="bg-[#d4e8ce] w-[30px] h-[30px] rounded-full items-center justify-center">  
                    <Image 
                        source={icons.locationFeed}
                        resizeMode='contain' 
                        className="w-[15px] h-[15px]"
                      />
                  </View>
                    <Text className="text-sm font-medium mx-3.5"> {item.city || "No information available"}</Text>
                </View>
                    
                
                
                <View className="mt-7 flex flex-row items-center">
                  <View className="bg-[#d4e8ce] w-[30px] h-[30px] rounded-full items-center justify-center">
                    <Image 
                      source={icons.languageFeed}
                      resizeMode='contain' 
                      className="w-[15px] h-[15px]"
                    />
                  </View>
                  <Text className="text-sm font-medium mx-3.5">
                    {item.languageSpoken || "No information available"}
                  </Text>
                </View>

            </View> 
          </View>

        <View className="rounded-lg border-2 border-white bg-white mt-3.5 shadow-sm">
          <View className="flex justify-center items-center my-3">
            <Image 
              source={icons.relationship}
              resizeMode='contain' 
              className="w-[27px] h-[27px] "
            />
          </View>
          <Text className="font-bold text-base text-center mb-3.5">{item.projectDivision || "No information available"}</Text>
        </View>


        <View className="mt-3.5 rounded-lg border-2 border-white bg-white shadow-sm">
        <View className="my-3.5">
        <Text className="font-bold text-lg ml-3.5" style={{ textDecorationLine: 'underline', textDecorationColor: '#5bb450', textDecorationStyle: 'solid' }}>Skills</Text>
        <Text className="text-sm ml-3.5 mt-2">{item.generalSkills || "No information available"} </Text>
        </View>
        </View>
   </View>

        
       {parsedPrompts.length > 0 && (
            <View className="mt-3.5 min-h-[15vh] rounded-lg border-2 border-white bg-white shadow-sm">
              <Text className="text-sm mt-7 ml-3.5">{parsedPrompts[0].prompt}</Text>
              <Text className="font-bold text-xl mt-2.5 ml-3.5">{parsedPrompts[0].answer}</Text>
            </View>
          )}

       
      
    
       {item.projects && item.projects.length > 0 && (
            <View className="mt-10 flex-shrink-0">
              <ProjeComponents projects={item.projects} />
            </View>
          )}



        {item.links && item.links.length > 0 && (
            <View className="justify-center mt-3.5 rounded-lg border-2 border-white bg-white h-16 shadow-sm">
              <Pressable onPress={() => handleLinkPress(item.links)}>
                <Text 
                  className="font-semibold ml-3.5"
                  numberOfLines={1}
                  style={{ 
                    textAlign: 'center',
                    overflow: 'hidden',
                    width: '90%',
                  }}
                >
                  {item.links}
                </Text>
              </Pressable>
            </View>
          )}

        {parsedPrompts.length > 1 && (
            <View className="mt-3.5 min-h-[15vh] rounded-lg border-2 border-white bg-white shadow-sm">
              <Text className="text-sm mt-7 ml-3.5">{parsedPrompts[1].prompt}</Text>
              <Text className="font-bold text-xl mt-2.5 ml-3.5">{parsedPrompts[1].answer}</Text>
            </View>
        )}
       

    
</View>
     

      </TouchableWithoutFeedback>

      
  );
  
};

export default DatesCard;



