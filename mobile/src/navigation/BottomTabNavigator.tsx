import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/main/HomeScreen';
import { PlayScreen } from '../screens/main/PlayScreen';
import { QuizScreen } from '../screens/main/QuizScreen';
import { ExploreScreen } from '../screens/main/ExploreScreen';
import { MemoriesScreen } from '../screens/main/MemoriesScreen';
import { UsScreen } from '../screens/main/UsScreen';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Home, Gamepad2, Brain, Compass, Camera, Heart } from 'lucide-react-native';
import { triggerHaptic } from '../utils/haptics';

const Tab = createBottomTabNavigator();

export const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#FFEBF0',
          borderTopWidth: 1.5,
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
          shadowColor: Colors.primary,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 10,
          elevation: 8,
        },
        tabBarActiveTintColor: Colors.primaryDark,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: Typography.weights.bold,
        },
      }}
      screenListeners={{
        tabPress: () => {
          triggerHaptic('light');
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <Home size={21} color={color} fill={focused ? Colors.primaryLight : 'none'} />
          ),
        }}
      />
      <Tab.Screen
        name="PlayTab"
        component={PlayScreen}
        options={{
          tabBarLabel: 'Play',
          tabBarIcon: ({ color, size, focused }) => (
            <Gamepad2 size={21} color={color} fill={focused ? Colors.primaryLight : 'none'} />
          ),
        }}
      />
      <Tab.Screen
        name="QuizTab"
        component={QuizScreen}
        options={{
          tabBarLabel: '500+ Quiz',
          tabBarIcon: ({ color, size, focused }) => (
            <Brain size={21} color={color} fill={focused ? Colors.primaryLight : 'none'} />
          ),
        }}
      />
      <Tab.Screen
        name="ExploreTab"
        component={ExploreScreen}
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({ color, size, focused }) => (
            <Compass size={21} color={color} fill={focused ? Colors.primaryLight : 'none'} />
          ),
        }}
      />
      <Tab.Screen
        name="MemoriesTab"
        component={MemoriesScreen}
        options={{
          tabBarLabel: 'Memories',
          tabBarIcon: ({ color, size, focused }) => (
            <Camera size={21} color={color} fill={focused ? Colors.primaryLight : 'none'} />
          ),
        }}
      />
      <Tab.Screen
        name="UsTab"
        component={UsScreen}
        options={{
          tabBarLabel: 'Us',
          tabBarIcon: ({ color, size, focused }) => (
            <Heart size={21} color={color} fill={focused ? Colors.loveRed : 'none'} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
