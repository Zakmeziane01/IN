//underscore layout will present in all of the routes.

//rnfes  =  expert component with styles in react native 

// Import necessary dependencies
import { useEffect } from "react";
import  { useFonts} from "expo-font"
import { SplashScreen, Stack } from "expo-router";

import GlobalProvider from "../context/GlobalProvider";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Define the RootLayout component
const RootLayout = () => {

  // Load fonts using useFonts hook from expo-font
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

    // useEffect hook to handle font loading and splash screen hiding
  useEffect(() => {

    // Throw error if fontsLoaded fails
    if (error) throw error;

    // Hide splash screen if fonts are loaded
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  // Render null if fonts are not loaded
  if (!fontsLoaded) {
    return null;
  }

  if (!fontsLoaded && !error) {
    return null;
  }

  // Return the component structure once fonts are loaded and splash screen is hidden
  return (
 
    //using teh global provider all the screens will have access to the data within tha value 
  <GlobalProvider>  
    <Stack>
    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    <Stack.Screen name="index" options={{ headerShown: false }} />
    <Stack.Screen name="registration" options={{ headerShown: false }} />
    <Stack.Screen name="search/[query]" options={{ headerShown: false }} />
    </Stack>
  </GlobalProvider>
  )
}

// Export the RootLayout component
export default RootLayout;