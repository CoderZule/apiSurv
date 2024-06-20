import React from 'react';
import { View, Text, ScrollView, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const InspectionsHistoryScreen = ({ route, navigation }) => {
    const { InspectionsHistoryData } = route.params;


    if (!InspectionsHistoryData || InspectionsHistoryData.length === 0) {
        return (
            <View style={[styles.container, styles.centeredView]}>
                <Text style={styles.centeredText}>Aucune inspection ajoutée pour le moment</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView horizontal={true}>

                <View style={styles.tableContainer}>
                    <View style={styles.tableHeader}>
                        <Text style={styles.headerCell}>Inspecteur</Text>
                        <Text style={styles.headerCell}>Date et Heure</Text>

                    </View>
                    <FlatList
                        data={InspectionsHistoryData}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.tableRow}
                                activeOpacity={0.6}
                                onPress={() => navigation.navigate('InspectionDetailsScreen', { inspectionData: item })}
                            >
                                <Text style={styles.cell}>
                                    {item.Inspector.firstName} {item.Inspector.lastName}{'\n'}
                                    <Text style={{ color: '#977700' }}>Cin: </Text>{item.Inspector.cin}
                                </Text>
                                <Text style={styles.cell}>
                                    {new Date(item.InspectionDateTime).toLocaleDateString('fr-FR')}{'\n'}
                                    {new Date(item.InspectionDateTime).toLocaleTimeString('fr-FR')}
                                </Text>
                            </TouchableOpacity>




                        )}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FBF5E0',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },
    centeredView: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    centeredText: {
        fontSize: 20,
        textAlign: 'center',
        marginTop: 50,
    },

    tableContainer: {
        borderTopWidth: 1,
        borderColor: '#ccc',
        marginTop: 30,

    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f1f1f1',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',


    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        backgroundColor: '#fff',

        borderBottomColor: '#ccc',
        minHeight: 50,
    },
    headerCell: {
        padding: 10,
        fontWeight: 'bold',
        width: 100,
        flex: 1,
        textAlign: 'center',
        borderRightWidth: 1,
        borderRightColor: '#ccc',
        borderLeftWidth: 1,
        borderLeftColor: '#ccc',
        fontSize: 18,

    },
    cell: {
        padding: 10,
        flex: 1,
        width: 150,
        borderRightWidth: 1,
        borderRightColor: '#ccc',
        borderLeftWidth: 1,
        borderLeftColor: '#ccc',
        textAlign: 'center',
        fontSize: 15,




    },
});

export default InspectionsHistoryScreen;
