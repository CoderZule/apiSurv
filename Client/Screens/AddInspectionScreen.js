import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Text, TextInput } from 'react-native';

const AddInspectionScreen = ({ route }) => {
  const { hiveData } = route.params;
  const [color, setColor] = useState(hiveData.Color);
  const [type, setType] = useState(hiveData.Type);

   const handleColorChange = (text) => setColor(text);  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Ajouter une Inspection</Text>
      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Text style={styles.label}>Couleur</Text>
          <TextInput
            style={styles.textInput}
            value={color}
            onChangeText={handleColorChange}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FBF5E0',
    paddingHorizontal: 24,
    paddingVertical: 45,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: '#977700',
    textAlign: 'center',
    marginBottom: 20,
  },
  detailsContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
  },
  detailItem: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#342D21',
    marginBottom: 8,
  },
  textInput: {
    fontSize: 16,
    fontWeight: '400',
    color: '#797979',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
});

export default AddInspectionScreen;
