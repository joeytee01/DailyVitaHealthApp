import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

export default function HomeScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    // Clear AsyncStorage when the component is mounted
    AsyncStorage.clear()
      .then(() => {
        console.log('AsyncStorage has been cleared');
      })
      .catch((error) => {
        console.error('Error clearing AsyncStorage', error);
      });
  }, []); // Empty dependency array ensures it runs only once when the component mounts

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Welcome to DailyVita</Text>
      <Text style={styles.subtitle}>
        Hello, we are here to make your life healthier and happier
      </Text>

      {/* Illustration */}
      <Image
        source={require('@/assets/images/first-page.png')}
        style={styles.illustration}
        resizeMode="contain"
      />

      {/* Description */}
      <Text style={styles.description}>
        We will ask a couple of questions to better understand your vitamin needs.
      </Text>

      {/* Get Started Button */}
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('HealthConcerns')}
      >
        <Text style={styles.buttonText}>Get started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#77e6b9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 50,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'left',
    marginVertical: 10,
  },
  illustration: {
    height: 200,
    width: '100%',
    alignSelf: 'center',
  },
  description: {
    fontSize: 14,
    color: '#444',
    textAlign: 'left',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignSelf: 'center',
    marginBottom: 50,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});
