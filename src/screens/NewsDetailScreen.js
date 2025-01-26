import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share } from 'react-native';
import axios from 'axios';

import { API_BASE_URL } from '../config/api';

export default function NewsDetailScreen({ route, navigation }) {
  console.log('Route Params:', route.params); // Debug what we're receiving
  
  if (!route.params?.news || !route.params?.user) {
    console.error('Missing required navigation params:', route.params);
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Error: Missing required data</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { news, user } = route.params;
  const [hasUpdated, setHasUpdated] = useState(false);

  useEffect(() => { // prevent multiple updates
    // Update category interest when viewing the article
    updateCategoryInterest();
  }, []);

  const updateCategoryInterest = async () => {
    try {
      await axios.post(`${API_BASE_URL}/category/update`, {
        userId: user.id,
        category: news.category
      });
    } catch (error) {
      console.error('Error updating category interest:', error);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${news.title}\n\n${news.summary}\n\nCategory: ${news.category}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.category}>{news.category}</Text>
        <Text style={styles.title}>{news.title}</Text>
        <Text style={styles.date}>
          {new Date(news.date).toLocaleDateString()}
        </Text>
        <Text style={styles.summary}>{news.summary}</Text>
        
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.shareButtonText}>Share</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  category: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
  },
  summary: {
    fontSize: 18,
    lineHeight: 28,
    color: '#444',
    marginBottom: 24,
  },
  shareButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 