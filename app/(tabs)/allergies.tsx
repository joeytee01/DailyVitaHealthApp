import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const allergiesData = [
  { id: 1, name: 'Milk' },
  { id: 2, name: 'Meat' },
  { id: 3, name: 'Wheat' },
  { id: 4, name: 'Nasacort' },
  { id: 5, name: 'Nasalide' },
  { id: 6, name: 'Nasonex' },
];

export default function AllergiesScreen() {
  const route = useRoute(); // Access the route params
  const navigation = useNavigation(); // Access navigation methods
  const { selectedDiets, prioritizedConcerns } = route.params || {}; // Get params from previous screen

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAllergies, setSelectedAllergies] = useState([]);

  // Fetch selected allergies from AsyncStorage when the component mounts
  useEffect(() => {
    const fetchAllergies = async () => {
      try {
        const storedAllergies = await AsyncStorage.getItem('selectedAllergies');
        if (storedAllergies) {
          setSelectedAllergies(JSON.parse(storedAllergies));
        }
      } catch (error) {
        console.error('Failed to fetch allergies from AsyncStorage:', error);
      }
    };
    fetchAllergies();
  }, []);

  // Filter allergies based on search query
  const filteredAllergies = allergiesData.filter(
    (item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()) && !selectedAllergies.includes(item.name)
  );

  const handleSelectAllergy = (allergy) => {
    setSelectedAllergies((prev) => {
      const updatedAllergies = [...prev, allergy];
      AsyncStorage.setItem('selectedAllergies', JSON.stringify(updatedAllergies)); // Save updated allergies to AsyncStorage
      return updatedAllergies;
    });
    setSearchQuery('');
  };

  const handleRemoveAllergy = (allergy) => {
    setSelectedAllergies((prev) => {
      const updatedAllergies = prev.filter((item) => item !== allergy);
      AsyncStorage.setItem('selectedAllergies', JSON.stringify(updatedAllergies)); // Save updated allergies to AsyncStorage
      return updatedAllergies;
    });
  };

  const handleNext = async () => {
    // Save selectedDiets and prioritizedConcerns in AsyncStorage
    await AsyncStorage.setItem('selectedDiets', JSON.stringify(selectedDiets));
    await AsyncStorage.setItem('prioritizedConcerns', JSON.stringify(prioritizedConcerns));

    // Navigate to the next screen with the selected data
    navigation.navigate('LastPage', {
      selectedDiets,
      prioritizedConcerns,
      selectedAllergies,
    });
  };

  const handleBackPress = () => {
    navigation.navigate('Diet'); // Go back to the previous screen
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        Write any specific allergies or sensitivity towards specific things (optional)
      </Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search allergies or sensitivities"
        placeholderTextColor="black"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {searchQuery.length > 0 && (
        <View style={styles.dropdown}>
          {filteredAllergies.map((allergy) => (
            <TouchableOpacity
              key={allergy.id}
              style={styles.dropdownItem}
              onPress={() => handleSelectAllergy(allergy.name)}
            >
              <Text style={styles.allergyText}>{allergy.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <ScrollView horizontal style={styles.selectedContainer}>
        {selectedAllergies.map((allergy, index) => (
          <View key={index} style={styles.pill}>
            <Text style={styles.pillText}>{allergy}</Text>
            <Ionicons
              name="close-circle"
              size={16}
              color="#FF6B6B"
              onPress={() => handleRemoveAllergy(allergy)}
            />
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.buttonBack}>
          <Text style={styles.buttonText} onPress={handleBackPress}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonNext} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#77e6b9',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 50,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#FFF',
    color: 'black',
  },
  dropdown: {
    backgroundColor: '#FFF',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    maxHeight: 150,
  },
  dropdownItem: {
    padding: 10,
  },
  allergyText: {
    fontSize: 16,
  },
  selectedContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F7FA',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 8,
  },
  pillText: {
    fontSize: 14,
    marginRight: 5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
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
});
