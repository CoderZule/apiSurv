import React from 'react';
import { View, Text, ScrollView, FlatList, StyleSheet } from 'react-native';

const InspectionsHistoryScreen = ({ route }) => {
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
                        <Text style={styles.headerCell}>Reine</Text>
                        <Text style={styles.headerCell}>Colonie</Text>
                        <Text style={styles.headerCell}>Couvain et Mâles</Text>
                        <Text style={styles.headerCell}>Nourritures</Text>
                        <Text style={styles.headerCell}>Maladie et traitement</Text>
                        <Text style={styles.headerCell}>Récoltes</Text>
                        <Text style={styles.headerCell}>Ajouts</Text>
                        <Text style={styles.headerCell}>Enlévements</Text>
                        <Text style={styles.headerCell}>Météo</Text>
                        <Text style={styles.headerCell}>Note</Text>
                    </View>
                    <FlatList
                        data={InspectionsHistoryData}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.tableRow}>
                                <Text style={styles.cell}>
                                    {item.Inspector.firstName} {item.Inspector.lastName}{'\n'}
                                    <Text style={{ color: '#977700' }}>Cin: </Text>{item.Inspector.cin}
                                </Text>

                                <Text style={styles.cell}>
                                    {new Date(item.InspectionDateTime).toLocaleDateString('fr-FR')}{'\n'}
                                    {new Date(item.InspectionDateTime).toLocaleTimeString('fr-FR')}
                                </Text>
                                <Text style={styles.cell}>
                                    {item.Queen.seen ? 'Observée\n' : 'Non observée\n'}

                                    {item.Queen.isMarked ? 'Marquée\n' : ''}

                                    {item.Queen.color && (
                                        <>
                                            <Text style={{ color: '#977700' }}>Couleur: </Text>{item.Queen.color + '\n'}
                                        </>
                                    )}

                                    {item.Queen.clipped ? 'Clippée\n' : ''}
                                    {item.Queen.isSwarmed ? 'Essaimée\n' : ''}

                                    {item.Queen.queenCells && (
                                        <>
                                            <Text style={{ color: '#977700' }}>Cellules royales: </Text>{item.Queen.queenCells + '\n'}
                                        </>
                                    )}

                                    {item.Queen.temperament && (
                                        <>
                                            <Text style={{ color: '#977700' }}>Tempérament: </Text>{item.Queen.temperament + '\n'}
                                        </>
                                    )}

                                    {item.Queen.note && (
                                        <>
                                            <Text style={{ color: '#977700' }}>Note: </Text>{item.Queen.note}
                                        </>
                                    )}
                                </Text>

                                <Text style={styles.cell}>
                                    {item.Colony.deadBees ? 'Des abeilles mortes sont présentes' : 'Aucune abeille morte'}{'\n'}
                                    <Text style={{ color: '#977700' }}> Force: </Text>{item.Colony.strength}{'\n'}
                                    <Text style={{ color: '#977700' }}> Tempérament: </Text>{item.Colony.temperament}
                                    <Text style={{ color: '#977700' }}> Supers: </Text>{item.Colony.supers}{'\n'}
                                    <Text style={{ color: '#977700' }}> Cadres de pollen: </Text>{item.Colony.pollenFrames}{'\n'}
                                    <Text style={{ color: '#977700' }}> Cadres au total: </Text>{item.Colony.TotalFrames}{'\n'}
                                    {item.Colony.note && (
                                        <>
                                            <Text style={{ color: '#977700' }}>Note: </Text>{item.Colony.note}{'\n'}
                                        </>
                                    )}

                                </Text>
                                <Text style={styles.cell}>
                                    <Text style={{ color: '#977700' }}>État: </Text>{item.Brood.state}{'\n'}
                                    <Text style={{ color: '#977700' }}> Nombre total du couvain: </Text>{item.Brood.totalBrood}{'\n'}
                                    <Text style={{ color: '#977700' }}>Couvain mâle: </Text>{item.Brood.maleBrood}{'\n'}
                                    <Text style={{ color: '#977700' }}>Mâles observés: </Text>{item.DronesSeen ? 'Oui' : 'Non'}{'\n'}

                                </Text>
                                {item.Supplies ? (
                                    <Text style={styles.cell}>
                                        <Text style={{ color: '#977700' }}>Produit: </Text>{item.Supplies.product}{'\n'}
                                        <Text style={{ color: '#977700' }}>Ingrédients: </Text>{item.Supplies.ingredients.name}{'\n'}
                                        <Text style={{ color: '#977700' }}>Quantité: </Text>{item.Supplies.ingredients.quantity}{'\n'}
                                        <Text style={{ color: '#977700' }}>Unité: </Text>{item.Supplies.ingredients.unit}{'\n'}
                                        <Text style={{ color: '#977700' }}>Note: </Text>{item.Supplies.note}{'\n'}

                                    </Text>
                                ) : (<Text style={styles.cell}>-</Text>)}
                                {item.BeeHealth ? (
                                    <Text style={styles.cell}>
                                        <Text style={{ color: '#977700' }}>Maladie: </Text>{item.BeeHealth.disease}{'\n'}
                                        <Text style={{ color: '#977700' }}>Traitement: </Text>{item.BeeHealth.treatment}{'\n'}
                                        <Text style={{ color: '#977700' }}>Durée: </Text>
                                        {item.BeeHealth.duration.from && new Date(item.BeeHealth.duration.from).toLocaleDateString('fr-FR')}
                                        {' '} à{' '}
                                        {item.BeeHealth.duration.to && new Date(item.BeeHealth.duration.to).toLocaleDateString('fr-FR')}
                                        {'\n'}
                                        <Text style={{ color: '#977700' }}>Quantité: </Text>{item.BeeHealth.quantity}{'\n'}
                                        <Text style={{ color: '#977700' }}>Doses: </Text> {item.BeeHealth.doses}{'\n'}
                                        <Text style={styles.cell}>
                                            <Text style={{ color: '#977700' }}>Note: </Text>
                                            {item.BeeHealth.note ? item.BeeHealth.note : '-'}
                                        </Text>
                                    </Text>
                                ) : (<Text style={styles.cell}>-</Text>)}
                                <Text style={styles.cell}>
                                    <Text style={{ color: '#977700' }}>Réserves de miel: </Text> {item.HoneyStores}{'\n'}
                                    <Text style={{ color: '#977700' }}>Réserves de pollen: </Text>{item.PollenStores}
                                </Text>
                                {item.Adding ? (
                                    <Text style={styles.cell}>

                                        {item.Adding.ActivityAdd}{'\n'}
                                        <Text style={{ color: '#977700' }}> Quantité ajoutée: </Text> {item.Adding.QuantityAdded}
                                    </Text>
                                ) : (<Text style={styles.cell}>-</Text>)}
                                {item.Removing ? (
                                    <Text style={styles.cell}>
                                        {item.Removing.ActivityRemove}{'\n'}
                                        <Text style={{ color: '#977700' }}> Quantité retirée: </Text> {item.Removing.QuantityRemoved}
                                    </Text>
                                ) : (<Text style={styles.cell}>-</Text>)}
                                <Text style={styles.cell}>
                                    <Text style={{ color: '#977700' }}>Condition: </Text>{item.Weather.condition}{'\n'}
                                    <Text style={{ color: '#977700' }}>Température: </Text>{item.Weather.temperature}°C{'\n'}
                                    <Text style={{ color: '#977700' }}>Humidité: </Text>{item.Weather.humidity}%{'\n'}
                                    <Text style={{ color: '#977700' }}>Pression: </Text>{item.Weather.pressure}{'\n'}
                                    <Text style={{ color: '#977700' }}>Vitesse du vent: </Text>{item.Weather.windSpeed} m/s{'\n'}
                                    <Text style={{ color: '#977700' }}>Direction du vent: </Text>{item.Weather.windDirection}°
                                </Text>
                                {item.Note ? (
                                    <Text style={styles.cell}>
                                        {item.Note}
                                    </Text>
                                ) : (
                                    <Text style={styles.cell}>-</Text>
                                )}
                            </View>
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
    },
    centeredView: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    centeredText: {
        fontSize: 20,
        textAlign: 'center',
        marginTop: 50, // Adjust as needed
    },
  
    tableContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        marginTop:30
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
        borderBottomColor: '#ccc',
        minHeight: 50,
    },
    headerCell: {
        padding: 10,
        fontWeight: 'bold',
        width: 250,
        flex: 1,
        textAlign: 'center',
        borderRightWidth: 1,
        borderRightColor: '#ccc',
    },
    cell: {
        padding: 10,
        flex: 1,
        width: 250,
        borderRightWidth: 1,
        borderRightColor: '#ccc',
        borderLeftWidth: 1,
        borderLeftColor: '#ccc',
        textAlign: 'center',
        fontSize: 15,

    },
});

export default InspectionsHistoryScreen;
