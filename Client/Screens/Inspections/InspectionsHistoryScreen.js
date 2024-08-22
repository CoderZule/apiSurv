import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
 
const InspectionsHistoryScreen = ({ route, navigation }) => {
    const { InspectionsHistoryData } = route.params;

    if (!InspectionsHistoryData || InspectionsHistoryData.length === 0) {
        return (
            <View style={[styles.container, styles.centeredView]}>
                <Image
                    source={require('../../assets/notfound.png')}
                    style={styles.image}
                    resizeMode="contain"
                />
                <Text style={styles.centeredText}>لم يتم إضافة أي متابعة حتى الآن.</Text>
            </View>
        );
    }

    const lastItemIndex = InspectionsHistoryData.length - 1;

    return (
        <View style={styles.container}>
            
            <FlatList
                data={InspectionsHistoryData}
                keyExtractor={(item, index) => index.toString()}
                ListHeaderComponent={
                    <Text style={styles.title}>سجل المتابعات الدورية </Text>
                }
                renderItem={({ item, index }) => (
                    <ImageBackground source={require('../../assets/inshis.jpg')} style={styles.inspectionItem}>

                        <TouchableOpacity
                            style={[
                                styles.inspectionContent,
                                index === lastItemIndex ? styles.lastInspectionItem : null,
                            ]}
                            activeOpacity={0.6}
                            onPress={() => {
                                const params = {
                                    inspectionData: item,
                                    badge: index === lastItemIndex ? true : false,
                                };

                                navigation.navigate('InspectionDetailsScreen', params);
                            }}
                        >

                            <Text style={styles.inspectorText}>
                                {item.Inspector.firstName} {item.Inspector.lastName}
                            </Text>
                            <Text style={styles.dateText}>
                                {new Date(item.InspectionDateTime).toLocaleDateString('fr-FR')}
                            </Text>
                            <Text style={styles.timeText}>
                                {new Date(item.InspectionDateTime).toLocaleTimeString('fr-FR')}
                            </Text>
                            {index === lastItemIndex && (
                                <View style={styles.badge}>
                                    <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>أخر متابعة</Text>
                                </View>
                            )}
                            {index !== lastItemIndex && <View style={styles.divider} />}

                        </TouchableOpacity>

                    </ImageBackground>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FBF5E0',
        padding: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 50,
        color: '#977700',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },
    centeredView: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    centeredText: {
        fontSize: 16,
        textAlign: 'center',
    },
    inspectionItem: {
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
        overflow: 'hidden',
    },
    inspectionContent: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',  
        padding: 10,
        borderRadius: 5,
    },
    lastInspectionItem: {
        borderWidth: 1,
        borderColor: "#2EB922",
    },
    inspectorText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    dateText: {
        fontSize: 14,
        color: '#666',
    },
    timeText: {
        fontSize: 14,
        color: '#666',
    },
    badge: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        backgroundColor: "#2EB922",
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 5,
        zIndex: 1,
    },
    divider: {
        height: 1,
        backgroundColor: '#ccc',
        width: '90%',
        position: 'absolute',
        bottom: 0,
    },
    image: {
        width: 240,
        height: 200,
    },
});

export default InspectionsHistoryScreen;
