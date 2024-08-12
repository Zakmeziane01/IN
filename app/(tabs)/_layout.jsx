import { StatusBar } from "expo-status-bar";
import { Redirect, Tabs, Stack } from "expo-router";
import { View, Text,Image} from "react-native";
import { useGlobalContext } from "../../context/GlobalProvider";
import {icons} from  "../../constants"; 
import Loader from "../../components/Loader";   

const TabIcon = ({ icon, color, name, focused }) => {       //Define a function-al component named TabIcon that takes four props: icon, color, name, and fo-cused.

  return (
    <View className="flex items-center justify-center gap-1">        
      <Image
        source={icon}   //source={icon}: Set the source of the image using the icon prop.
        resizeMode="contain"
        tintColor={color}
        className="w-3.4 h-3"
      />
      <Text
      className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
      style={{ color: color }}
      >
      {name} 
      </Text>
      
    </View>
  );           
};

const TabsLayout = () => {   
  
  
  const { loading, isLogged } = useGlobalContext();

 // if (!loading && !isLogged) return <Redirect href="/sign-in" />;
  
  return (
    <>
    <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#FFA001",
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarShowLabel: false,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "white",
            borderTopWidth: 1,
            borderTopColor: "white",
            height: 84,
          },
        }}
      >          
    
    <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                name="Home"
                focused={focused}
              />
            ),
          }}

    />


    <Tabs.Screen
          name="chat"
          options={{
            title: "Messages",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.plus}
                color={color}
                name="Messages"
                focused={focused}
              />
            ),
          }}
        />

        
    <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.profile}
                color={color}
                name="Profile"
                focused={focused}
              />
            ),
          }}
        />


</Tabs>
  


<Loader isLoading={loading} />
<StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};
export default TabsLayout;

