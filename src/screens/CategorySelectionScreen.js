import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const categories = [
  'Education', 'Economy', 'Finance', 'Weather', 'Culture',
  'Fashion', 'Entertainment', 'Politics', 'Health', 'Sports', 'Technology'
];

export default function CategorySelectionScreen({ route, navigation }) {
  const { user } = route.params;
  const [selectedCategories, setSelectedCategories] = useState([]);

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category)); // Remove the category from the selected categories
    } else if (selectedCategories.length < 3) {
      setSelectedCategories([...selectedCategories, category]); // Add the category to the selected categories
    } else {
      Alert.alert('Limit Reached', 'You can only select up to 3 categories');
    }
  };

  const handleContinue = async () => {
    if (selectedCategories.length !== 3) {
      Alert.alert('Selection Required', 'Please select exactly 3 categories');
      return;
    }

    try {
      // Initialize categories with higher coefficients for selected ones
      
    //   console.log(selectedCategories);
      await axios.post(`${API_BASE_URL}/category/initialize`, {
        userId: user.id,
        categories: selectedCategories
      });
      // Reset navigation stack and navigate to Home
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home', params: { user } }],
      });
    } catch (error) {
      console.error('Error initializing categories:', error);
      Alert.alert('Error', 'Failed to save category preferences');
    }
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        selectedCategories.includes(item) && styles.selectedCategory
      ]}
      onPress={() => toggleCategory(item)}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategories.includes(item) && styles.selectedCategoryText
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Interests</Text>
      <Text style={styles.subtitle}>Select 3 categories that interest you the most</Text>
      
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={item => item}
        numColumns={2}
        contentContainerStyle={styles.categoriesList}
        columnWrapperStyle={styles.row}
      />

      <View style={styles.footer}>
        <Text style={styles.selectionCount}>
          {selectedCategories.length}/3 categories selected
        </Text>
        <TouchableOpacity
          style={[
            styles.continueButton,
            selectedCategories.length !== 3 && styles.buttonDisabled
          ]}
          onPress={handleContinue}
          disabled={selectedCategories.length !== 3}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 100,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  categoriesList: {
    paddingBottom: 16,
    paddingHorizontal: 8,
  },
  categoryCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    margin: 6,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 70,
    maxWidth: '47%',
  },
  selectedCategory: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#495057',
    textAlign: 'center',
  },
  selectedCategoryText: {
    color: '#fff',
    fontWeight: '600',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    alignItems: 'center',
  },
  selectionCount: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  continueButton: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  row: {
    justifyContent: 'space-between',
  },
}); 