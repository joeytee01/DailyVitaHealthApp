import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // Import Tab Navigator
import { useColorScheme } from '@/hooks/useColorScheme';  // Assuming this hook is correctly imported
import { HapticTab } from '@/components/HapticTab';  // Custom tab button component
import { IconSymbol } from '@/components/ui/IconSymbol';  // Icon component
import { Colors } from '@/constants/Colors';  // Your color constants

// Import the screens directly from the same 'tabs' folder
import index from './index';  // Adjusted import path
import HealthConcernsScreen from './HealthConcernsScreen';  // Adjusted import path
import DietScreen from './diet';  // Adjusted import path
import AllergiesScreen from './allergies';  // Adjusted import path
import LastPageScreen from './lastpage';  // Adjusted import path

const Tab = createBottomTabNavigator();  // Create Tab Navigator

const TabLayout = () => {
  const colorScheme = useColorScheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: (props) => <HapticTab {...props} />,  // Custom tab button
        tabBarStyle: Platform.select({
          ios: {
            display: 'none',
            position: 'absolute',
          },
          default: { display: 'none' },
        }),
      }}>
      <Tab.Screen
        name="index"
        component={index}  // Use the Health Concerns Screen
        options={{
          title: 'index',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="heart.fill" color={color} />,
        }}
      />
      {/* Health Concerns Tab */}
      <Tab.Screen
        name="HealthConcerns"
        component={HealthConcernsScreen}  // Use the Health Concerns Screen
        options={{
          title: 'Health Concerns',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="heart.fill" color={color} />,
        }}
      />
      
      {/* Diet Tab */}
      <Tab.Screen
        name="Diet"
        component={DietScreen}  // Use the Diet Screen
        options={{
          title: 'Diet',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="leaf.fill" color={color} />,
        }}
      />

      {/* Allergies Tab */}
      <Tab.Screen
        name="Allergies"
        component={AllergiesScreen}  // Use the Allergies Screen
        options={{
          title: 'Allergies',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="exclamationmark.triangle.fill" color={color} />,
        }}
      />
      
      {/* Last Page Tab */}
      <Tab.Screen
        name="LastPage"
        component={LastPageScreen}  // Use the Last Page Screen
        options={{
          title: 'Last Page',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="checkmark.circle.fill" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default TabLayout;
