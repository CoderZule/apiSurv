 
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const HiveDetailsScreen = ({ route }) => {
    const { hiveData } = route.params; 

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Hive Details</Text>
            <View style={styles.detailsContainer}>
                <Text style={styles.label}>Hive ID:</Text>
                <Text style={styles.text}>{hiveData._id}</Text>
                <Text style={styles.label}>Hive Color:</Text>
                <Text style={styles.text}>{hiveData.Color}</Text>
           
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    detailsContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 16,
        borderRadius: 10,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    text: {
        fontSize: 16,
    },
});

export default HiveDetailsScreen;
