import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SIZES } from '../constants/theme';

const { width } = Dimensions.get('window');

const LandingScreen = () => {
  const navigation = useNavigation();

  const handleSignIn = () => {
    // Mock Auth logic could go here
    navigation.replace('Season');
  };

  const handleGameStart = () => {
    navigation.replace('Season');
  };

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
        <Text style={styles.title}>틀린그림찾기</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleGameStart} activeOpacity={0.8}>
            <LinearGradient
              colors={COLORS.gradients.primaryButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>게임 시작하기</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSignIn} activeOpacity={0.8}>
            <LinearGradient
              colors={COLORS.gradients.secondaryButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.button, styles.secondaryButton]}
            >
              <Text style={styles.buttonText}>로그인</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: SIZES.padding,
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
    marginBottom: SIZES.padding,
  },
  title: {
    fontSize: SIZES.h1,
    fontWeight: '900',
    color: COLORS.white,
    marginBottom: SIZES.padding * 3,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
  },
  buttonContainer: {
    width: '100%',
    gap: 20,
  },
  button: {
    paddingVertical: 16,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  secondaryButton: {
    // Add margin or specific styles if needed
  },
  buttonText: {
    color: COLORS.white,
    fontSize: SIZES.button,
    fontWeight: 'bold',
  },
});

export default LandingScreen;
