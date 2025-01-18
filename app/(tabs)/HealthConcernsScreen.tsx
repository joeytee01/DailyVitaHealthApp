import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';  // Import AsyncStorage

export default function HealthConcernsScreen() {
  const navigation = useNavigation(); // Get the navigation object
  const healthConcerns = [
    { id: 1, name: 'Sleep' },
    { id: 2, name: 'Immunity' },
    { id: 3, name: 'Stress' },
    { id: 4, name: 'Joint Support' },
    { id: 5, name: 'Digestion' },
    { id: 6, name: 'Mood' },
    { id: 7, name: 'Energy' },
    { id: 8, name: 'Hair, Nail, Skin' },
    { id: 9, name: 'Weight Loss' },
    { id: 10, name: 'Fitness' },
  ];

  const [selectedConcerns, setSelectedConcerns] = useState([]);
  const [prioritizedConcerns, setPrioritizedConcerns] = useState([]);
  const [errorMessage, setErrorMessage] = useState(''); // State to store the error message

  // Function to save prioritizedConcerns to AsyncStorage
  const savePrioritizedConcerns = async (concerns) => {
    try {
      await AsyncStorage.setItem('prioritizedConcerns', JSON.stringify(concerns));
    } catch (error) {
      console.error('Error saving concerns to AsyncStorage:', error);
    }
  };

  // Load prioritizedConcerns from AsyncStorage when the screen is loaded
  useEffect(() => {
    const loadPrioritizedConcerns = async () => {
      try {
        const storedConcerns = await AsyncStorage.getItem('prioritizedConcerns');
        if (storedConcerns) {
          setPrioritizedConcerns(JSON.parse(storedConcerns));
        }
      } catch (error) {
        console.error('Error loading concerns from AsyncStorage:', error);
      }
    };

    loadPrioritizedConcerns();
  }, []);  // Empty dependency array ensures this runs once on mount

  // Handle concern selection (up to 5)
  const toggleConcernSelection = (concern) => {
    if (selectedConcerns.includes(concern)) {
      const updatedConcerns = selectedConcerns.filter((item) => item !== concern);
      setSelectedConcerns(updatedConcerns);
      setPrioritizedConcerns(updatedConcerns);
      savePrioritizedConcerns(updatedConcerns); // Save to AsyncStorage
    } else if (selectedConcerns.length < 5) {
      const updatedConcerns = [...selectedConcerns, concern];
      setSelectedConcerns(updatedConcerns);
      setPrioritizedConcerns(updatedConcerns);
      savePrioritizedConcerns(updatedConcerns); // Save to AsyncStorage
    }
  };

  const renderItem = ({ item, drag, isActive }) => (
    <TouchableOpacity
      style={[styles.priorityItem, isActive && styles.priorityItemActive]}
      onLongPress={drag}
    >
      <Text style={styles.priorityText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <>
      <Text style={styles.title}>Select the top health concerns (up to 5) *</Text>
      <View style={styles.concernsContainer}>
        {healthConcerns.map((concern) => (
          <TouchableOpacity
            key={concern.id}
            style={[styles.concernButton, selectedConcerns.includes(concern.name) && styles.concernButtonSelected]}
            onPress={() => toggleConcernSelection(concern.name)}
          >
            <Text style={[styles.concernText, selectedConcerns.includes(concern.name) && styles.concernTextSelected]}>
              {concern.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.subtitle}>Prioritize</Text>
    </>
  );

  const handleNextPress = () => {
    if (selectedConcerns.length === 0) {
      setErrorMessage('You must select at least one concern to proceed.'); // Show error if no selection
    } else {
      setErrorMessage(''); // Clear error if selection is made
      // Navigate to the DietScreen and pass prioritizedConcerns as a parameter
      navigation.navigate('Diet', {
        prioritizedConcerns, // Pass the data here
      });
    }
  };

  const handleBackPress = () => {
    navigation.goBack(); // Go back to the previous screen
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <DraggableFlatList
        ListHeaderComponent={renderHeader}
        data={prioritizedConcerns}
        onDragEnd={({ data }) => {
          setPrioritizedConcerns(data);  // Update array after drag
          savePrioritizedConcerns(data); // Save reordered data to AsyncStorage
        }}
        keyExtractor={(item, index) => `draggable-priority-item-${index}`}
        renderItem={renderItem}
      />
      <View style={styles.footer}>
        <TouchableOpacity style={styles.buttonBack}>
          <Text style={styles.buttonText} onPress={handleBackPress}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonNext} onPress={handleNextPress}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>

      {/* Show error message if no concerns selected */}
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#77e6b9',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  concernsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  concernButton: {
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 5,
  },
  concernButtonSelected: {
    backgroundColor: '#6CC3F2',
  },
  concernText: {
    fontSize: 14,
    color: '#555',
  },
  concernTextSelected: {
    color: '#FFF',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  priorityItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 5,
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  priorityItemActive: {
    backgroundColor: '#E0F7FA',
  },
  priorityText: {
    fontSize: 16,
    color: '#333',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  buttonBack: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#CCC',
    borderRadius: 5,
  },
  buttonNext: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FF6B6B',
    borderRadius: 5,
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
