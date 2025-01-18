import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';  // Use this to access route params
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

export default function LastPage() {
  const route = useRoute(); // Access the route params

  const { selectedDiets, prioritizedConcerns, selectedAllergies } = route.params || {};  // Access passed params

  const [sunExposure, setSunExposure] = useState(null);
  const [smoking, setSmoking] = useState(null);
  const [alcoholConsumption, setAlcoholConsumption] = useState(null);
  const [errorMessages, setErrorMessages] = useState({}); // State to hold error messages

  // Fetch data from AsyncStorage when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedSunExposure = await AsyncStorage.getItem('sunExposure');
        const storedSmoking = await AsyncStorage.getItem('smoking');
        const storedAlcoholConsumption = await AsyncStorage.getItem('alcoholConsumption');

        if (storedSunExposure) setSunExposure(storedSunExposure);
        if (storedSmoking) setSmoking(storedSmoking);
        if (storedAlcoholConsumption) setAlcoholConsumption(storedAlcoholConsumption);
      } catch (error) {
        console.error('Failed to fetch data from AsyncStorage:', error);
      }
    };

    fetchData();
  }, []);

  // Function to handle when the button is pressed
  const handleButtonPress = async () => {
    // Check if any questions are unanswered and show error messages accordingly
    const newErrorMessages = {};
    if (sunExposure === null) newErrorMessages.sunExposure = 'This question is required.';
    if (smoking === null) newErrorMessages.smoking = 'This question is required.';
    if (alcoholConsumption === null) newErrorMessages.alcoholConsumption = 'This question is required.';

    if (Object.keys(newErrorMessages).length > 0) {
      setErrorMessages(newErrorMessages);
      return; // Prevent submission if there are unanswered questions
    }

    // Log the data
    console.log('Selected Diets:', selectedDiets);
    console.log('Prioritized Concerns:', prioritizedConcerns);
    console.log('Selected Allergies:', selectedAllergies);
    console.log('Sun Exposure Answer:', sunExposure);
    console.log('Smoking Answer:', smoking);
    console.log('Alcohol Consumption Answer:', alcoholConsumption);

    // Save to AsyncStorage before proceeding
    try {
      await AsyncStorage.setItem('selectedDiets', JSON.stringify(selectedDiets));
      await AsyncStorage.setItem('prioritizedConcerns', JSON.stringify(prioritizedConcerns));
      await AsyncStorage.setItem('selectedAllergies', JSON.stringify(selectedAllergies));
      await AsyncStorage.setItem('sunExposure', sunExposure);
      await AsyncStorage.setItem('smoking', smoking);
      await AsyncStorage.setItem('alcoholConsumption', alcoholConsumption);

      // Proceed with any further action (e.g., navigate to another screen or display message)
    } catch (error) {
      console.error('Error saving data to AsyncStorage:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>
        Is your daily exposure to sun limited? <Text style={styles.required}>*</Text>
      </Text>
      <View style={styles.optionGroup}>
        <View style={styles.checkboxRow}>
          <TouchableOpacity
            style={[styles.checkbox, sunExposure === 'Yes' && styles.selectedCircle]}
            onPress={() => setSunExposure('Yes')}
          />
          <Text style={styles.optionText}>Yes</Text>
        </View>
        <View style={styles.checkboxRow}>
          <TouchableOpacity
            style={[styles.checkbox, sunExposure === 'No' && styles.selectedCircle]}
            onPress={() => setSunExposure('No')}
          />
          <Text style={styles.optionText}>No</Text>
        </View>
      </View>
      {errorMessages.sunExposure && <Text style={styles.errorText}>{errorMessages.sunExposure}</Text>}

      <Text style={styles.question}>
        Do you currently smoke (tobacco or marijuana)? <Text style={styles.required}>*</Text>
      </Text>
      <View style={styles.optionGroup}>
        <View style={styles.checkboxRow}>
          <TouchableOpacity
            style={[styles.checkbox, smoking === 'Yes' && styles.selectedCircle]}
            onPress={() => setSmoking('Yes')}
          />
          <Text style={styles.optionText}>Yes</Text>
        </View>
        <View style={styles.checkboxRow}>
          <TouchableOpacity
            style={[styles.checkbox, smoking === 'No' && styles.selectedCircle]}
            onPress={() => setSmoking('No')}
          />
          <Text style={styles.optionText}>No</Text>
        </View>
      </View>
      {errorMessages.smoking && <Text style={styles.errorText}>{errorMessages.smoking}</Text>}

      <Text style={styles.question}>
        On average, how many alcoholic beverages do you have in a week? <Text style={styles.required}>*</Text>
      </Text>
      <View style={styles.optionGroup}>
        <View style={styles.checkboxRow}>
          <TouchableOpacity
            style={[styles.checkbox, alcoholConsumption === '0 - 1' && styles.selectedCircle]}
            onPress={() => setAlcoholConsumption('0 - 1')}
          />
          <Text style={styles.optionText}>0 - 1</Text>
        </View>
        <View style={styles.checkboxRow}>
          <TouchableOpacity
            style={[styles.checkbox, alcoholConsumption === '2 - 5' && styles.selectedCircle]}
            onPress={() => setAlcoholConsumption('2 - 5')}
          />
          <Text style={styles.optionText}>2 - 5</Text>
        </View>
        <View style={styles.checkboxRow}>
          <TouchableOpacity
            style={[styles.checkbox, alcoholConsumption === '5+' && styles.selectedCircle]}
            onPress={() => setAlcoholConsumption('5+')}
          />
          <Text style={styles.optionText}>5+</Text>
        </View>
      </View>
      {errorMessages.alcoholConsumption && <Text style={styles.errorText}>{errorMessages.alcoholConsumption}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
        <Text style={styles.buttonText}>Get my personalized vitamin</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#77e6b9',
  },
  question: {
    fontSize: 18,
 
    marginTop: 30,
  },
  required: {
    color: 'red',
  },
  optionGroup: {
    flexDirection: 'column', // Stack the checkboxes vertically
    marginBottom: 20,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center', // Align checkbox and text horizontally
    marginBottom: 10,
  },
  checkbox: {
    width: 25,
    height: 25,
    borderRadius: 25 / 2, // Circle shape
    borderWidth: 2,
    borderColor: '#333',
    marginRight: 10, // Space between circle and text
  },
  selectedCircle: {
    backgroundColor: 'grey', // Fill the circle with a color when selected
  },
  optionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    paddingVertical: 15,
    backgroundColor: '#FF6B6B',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
});
