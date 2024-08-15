import { Stack, Redirect } from "expo-router";
import { StatusBar } from "expo-status-bar";


const RegistrationLayout = () => {
  // Redirect if not logged in

  return (
    <>
      <Stack>
        <Stack.Screen
          name="welcomeScreen"
          options={{
            headerShown: false,
          }}
        />
        
        <Stack.Screen
          name="additionalInfo"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="ownGender"
          options={{
            headerShown: false,
          }}
        />
      
        <Stack.Screen
          name="localization"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="allowNotification"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="careerPath"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="genderCollaborator"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="ownCareer"
          options={{
            headerShown: false,
          }}
        /> 

        <Stack.Screen
          name="workPositions"
          options={{
            headerShown: false,
          }}
        /> 

        <Stack.Screen
          name="academicPath"
          options={{
            headerShown: false,
          }}
        /> 
           
        <Stack.Screen
          name="projectType"
          options={{
            headerShown: false,
          }}
        /> 

        <Stack.Screen
          name="workforceSize"
          options={{
            headerShown: false,
          }}
        /> 

        <Stack.Screen
          name="skills"
          options={{
            headerShown: false,
          }}
        /> 

        <Stack.Screen
          name="uploadPhotos"
          options={{
            headerShown: false,
          }}
        />

        
        <Stack.Screen
          name="uploadProject"
          options={{
            headerShown: false,
          }}
        />


        <Stack.Screen
          name="acceptPrivacy"
          options={{
            headerShown: false,
          }}
        />


       <Stack.Screen
          name="allDone"
          options={{
            headerShown: false,
          }}
        />
    
         </Stack>

      

      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default RegistrationLayout;