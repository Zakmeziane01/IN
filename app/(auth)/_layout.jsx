import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useGlobalContext } from "../../context/GlobalProvider";
import Loader from "../../components/Loader";

const AuthLayout = () => {
  const { loading, isLogged } = useGlobalContext();                   // Fetch loading state and login status from the global context

  if (!loading && isLogged) return <Redirect href="/uploadPhoto" />;  // Redirect to upload photo page if logged in and not loading

  return (
    <>
      <Stack>
        <Stack.Screen
          name="sign-in"
          options={{
            headerShown: false,                                      // Sign-in screen without header
          }}
        />
        <Stack.Screen
          name="sign-up"
          options={{
            headerShown: false,                                      // Sign-up screen without header
          }}
        />
        <Stack.Screen
          name="email-auth"
          options={{
            headerShown: false,                                     // Email authentication screen without header
          }}
        />
      </Stack>

      <Loader isLoading={loading} />                              {/* Loader component to show loading state while fetching auth status */}
      <StatusBar backgroundColor="#161622" style="light" />       {/* Custom status bar with dark background and light text */}
    </>
  )
}

export default AuthLayout;
