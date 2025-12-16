import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SIZES } from '../constants/theme';
import AuthService from '../services/AuthService';

const { width } = Dimensions.get('window');

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const checkAuthAndNavigate = async () => {
      // 2초 대기 (스플래시 화면 표시)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 인증 상태 확인
      const isLoggedIn = await AuthService.isLoggedIn();

      if (isLoggedIn) {
        // 이미 로그인되어 있으면 Season 화면으로
        navigation.replace('Season');
      } else {
        // 로그인되어 있지 않으면 Landing 화면으로
        navigation.replace('Landing');
      }
    };

    checkAuthAndNavigate();
  }, [navigation]);

  return (
    <LinearGradient
      colors={COLORS.gradients.background}
      style={styles.container}
    >
      <View style={styles.content}>
        <Image
          source={require('../../assets/logo_alpha.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: width * 0.5,
    height: width * 0.5,
    marginBottom: SIZES.padding,
  },
});

export default SplashScreen;
