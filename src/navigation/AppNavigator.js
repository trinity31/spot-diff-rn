import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import LandingScreen from '../screens/LandingScreen';
import StageScreen from '../screens/StageScreen';
import GameScreen from '../screens/GameScreen';

import { COLORS } from '../constants/theme';

import SeasonScreen from '../screens/SeasonScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.white },
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen
          name="Season"
          component={SeasonScreen}
          options={{
            headerShown: false, // User requested to hide header
            title: '시즌 선택',
            headerBackTitle: '',
            headerBackTitleVisible: false,
            headerStyle: { backgroundColor: COLORS.primary.purple },
            headerTintColor: COLORS.white,
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <Stack.Screen
          name="Stage"
          component={StageScreen}
          options={{
            headerShown: true,
            title: '스테이지 선택',
            headerBackTitleVisible: false,
            headerBackTitle: '',
            headerStyle: { backgroundColor: COLORS.primary.purple },
            headerTintColor: COLORS.white,
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <Stack.Screen name="Game" component={GameScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
