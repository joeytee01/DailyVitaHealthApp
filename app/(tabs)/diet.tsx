import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal } from 'react-native';
import CheckBox from 'expo-checkbox';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

export default function DietScreen() {
  const [selectedDiets, setSelectedDiets] = useState([]);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipText, setTooltipText] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State to store the error message
  const [prioritizedConcerns, setPrioritizedConcerns] = useState([]); // State for concerns

  const navigation = useNavigation();

  const dietOptions = [
    { id: 1, name: 'Vegan', tool_tip: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' },
    { id: 2, name: 'Vegetarian', tool_tip: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' },
    { id: 3, name: 'Plant Based', tool_tip: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' },
    { id: 4, name: 'Pescatarian', tool_tip: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' },
    { id: 5, name: 'Strict Paleo', tool_tip: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' },
    { id: 6, name: 'Ketogenic', tool_tip: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' },
  ];

  // Fetch selected diets and prioritizedConcerns from AsyncStorage when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedDiets = await AsyncStorage.getItem('selectedDiets');
        if (storedDiets) {
          setSelectedDiets(JSON.parse(storedDiets));
        }

        const storedConcerns = await AsyncStorage.getItem('prioritizedConcerns');
        if (storedConcerns) {
          setPrioritizedConcerns(JSON.parse(storedConcerns));
        }
      } catch (error) {
        console.error('Failed to fetch data from AsyncStorage:', error);
      }
    };
    fetchData();
  }, []);

  const handleDietSelection = (dietId) => {
    const selectedDiet = dietOptions.find((option) => option.id === dietId);

    if (!selectedDiet) return; // Prevent errors if dietId doesn't exist

    setSelectedDiets((prevSelectedDiets) => {
      const isAlreadySelected = prevSelectedDiets.some((d) => d.id === dietId);
      if (isAlreadySelected) {
        return prevSelectedDiets.filter((d) => d.id !== dietId);
      }
      return [...prevSelectedDiets, { id: dietId, name: selectedDiet.name }];
    });
  };

  const showTooltip = (tooltip) => {
    setTooltipText(tooltip);
    setTooltipVisible(true);
  };

  const hideTooltip = () => {
    setTooltipVisible(false);
    setTooltipText('');
  };

  const handleNext = async () => {
    if (selectedDiets.length === 0) {
      setErrorMessage('You must select at least one diet to proceed.'); // Show error if no selection
    } else {
      setErrorMessage(''); // Clear error if selection is made
      const selectedDietNames = selectedDiets.map((diet) => diet.name); // Extract names only

      // Save selected diets to AsyncStorage
      await AsyncStorage.setItem('selectedDiets', JSON.stringify(selectedDietNames));

      // Save concerns to AsyncStorage
      await AsyncStorage.setItem('prioritizedConcerns', JSON.stringify(prioritizedConcerns));

      navigation.navigate('Allergies', {
        selectedDiets: JSON.stringify(selectedDietNames), // Passing the selected diets
        prioritizedConcerns: JSON.stringify(prioritizedConcerns), // Passing the concerns from the previous screen
      });
    }
  };

  const handleBackPress = () => {
    navigation.navigate('HealthConcerns'); // Go back to the previous screen
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.title}>Select the diet you follow:*</Text>
        {dietOptions.map((diet) => (
          <View key={diet.id} style={styles.dietOption}>
            <CheckBox
              value={selectedDiets.some((selectedDiet) => selectedDiet.id === diet.id)}
              onValueChange={() => handleDietSelection(diet.id)}
            />
            <View style={styles.textAndIconContainer}>
              <Text style={styles.dietText}>{diet.name}</Text>
              <Ionicons
                name="information-circle-outline"
                size={24}
                color="blue"
                onPress={() => showTooltip(diet.tool_tip)}
                style={styles.infoIcon}
              />
            </View>
          </View>
        ))}

        {/* Tooltip Modal */}
        <Modal
          visible={tooltipVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={hideTooltip}
        >
          <View style={styles.modalBackground}>
            <View style={styles.tooltipContainer}>
              <Text style={styles.tooltipText}>{tooltipText}</Text>
              <Text style={styles.closeButton} onPress={hideTooltip}>
                Close
              </Text>
            </View>
          </View>
        </Modal>

        {/* Show error message if no diets selected */}
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      </ScrollView>

      {/* Footer with Back and Next buttons */}
      <View style={styles.footer}>
        <View style={styles.buttonBack}>
          <Text style={styles.buttonText} onPress={handleBackPress}>Back</Text>
        </View>
        <View style={styles.buttonNext} onTouchEnd={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#77e6b9',
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 50,
    marginBottom: 50,
  },
  dietOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  textAndIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
  },
  dietText: {
    fontSize: 18,
    marginLeft: 10,
  },
  infoIcon: {
    marginLeft: 5,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  tooltipContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  tooltipText: {
    fontSize: 16,
    marginBottom: 20,
  },
  closeButton: {
    fontSize: 18,
    color: 'blue',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  buttonBack: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#CCC',
    borderRadius: 5,
    marginBottom: 30,
  },
  buttonNext: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FF6B6B',
    borderRadius: 5,
    marginBottom: 30,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
  },
});
