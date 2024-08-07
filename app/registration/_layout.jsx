import { Stack, Redirect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useGlobalContext } from "../../context/GlobalProvider";

const RegistrationLayout = () => {
  const { loading, isLogged } = useGlobalContext();

  // Redirect if not logged in
  if (!loading && !isLogged) {
    return <Redirect href="/sign-in" />;
  }

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
          name="skills"
          options={{
            headerShown: false,
          }}
        /> 

         <Stack.Screen
          name="ChatPart"
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