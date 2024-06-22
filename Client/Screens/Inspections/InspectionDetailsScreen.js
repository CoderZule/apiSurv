import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Modal, Switch, Button, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EditInspectionModal from './EditInspectionModal';

const InspectionDetails = ({ route, navigation }) => {
  const { inspectionData, badge } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({ ...inspectionData });

  const handleModalInputChange = (section, field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    // Save the edited data (you can also perform any API call here to save the data on the server)
    // In this example, we simply close the modal and log the updated formData
    setModalVisible(false);
    console.log(formData);
  };

  const renderIconAndTextSeen = (condition) => {
    if (condition) {
      return (
        <View style={styles.iconContainer}>
          <Text style={styles.highlight}>Observée</Text>
          <Ionicons name="checkmark-outline" size={20} color="green" style={styles.icon} />
        </View>
      );
    } else {
      return (
        <View style={styles.iconContainer}>
          <Text style={styles.highlight}>Non observée</Text>
          <Ionicons name="close-outline" size={20} color="red" style={styles.icon} />
        </View>
      );
    }
  }

  const renderIconAndText = (text, condition) => {
    if (condition) {
      return (
        <View style={styles.iconContainer}>
          <Text style={styles.highlight}>{text}</Text>
          <Ionicons name="checkmark-outline" size={20} color="green" style={styles.icon} />
        </View>
      );
    } else {
      return (
        <View style={styles.iconContainer}>
          <Text style={styles.highlight}>{text}</Text>
          <Ionicons name="close-outline" size={20} color="red" style={styles.icon} />
        </View>
      );
    }
  };

  const weatherConditionMapping = {
    Thunderstorm: 'Orage',
    Drizzle: 'Bruine',
    Rain: 'Pluie',
    Snow: 'Neige',
    Mist: 'Brume',
    Smoke: 'Fumée',
    Haze: 'Brume sèche',
    Dust: 'Poussière',
    Fog: 'Brouillard',
    Sand: 'Sable',
    Ash: 'Cendre',
    Squall: 'Rafale',
    Tornado: 'Tornade',
    Clear: 'Dégagé',
    Clouds: 'Nuages',
  };

  const translateCondition = (condition) => {
    for (const key in weatherConditionMapping) {
      if (condition.includes(key)) {
        return weatherConditionMapping[key];
      }
    }
    return condition;
  };

  const renderWeatherIcon = (condition) => {
    if (condition.includes('Thunderstorm')) {
      return <Ionicons name="thunderstorm-outline" size={20} color="black" style={styles.icon} />;
    } else if (condition.includes('Drizzle')) {
      return <Ionicons name="rainy-outline" size={20} color="blue" style={styles.icon} />;
    } else if (condition.includes('Rain')) {
      return <Ionicons name="rainy-outline" size={20} color="blue" style={styles.icon} />;
    } else if (condition.includes('Snow')) {
      return <Ionicons name="snow-outline" size={20} color="white" style={styles.icon} />;
    } else if (
      condition.includes('Mist') ||
      condition.includes('Smoke') ||
      condition.includes('Haze') ||
      condition.includes('Dust') ||
      condition.includes('Fog') ||
      condition.includes('Sand') ||
      condition.includes('Ash') ||
      condition.includes('Squall') ||
      condition.includes('Tornado')
    ) {
      return <Ionicons name="cloud-outline" size={20} color="gray" style={styles.icon} />;
    } else if (condition.includes('Clear')) {
      return <Ionicons name="sunny-outline" size={20} color="orange" style={styles.icon} />;
    } else if (condition.includes('Clouds')) {
      return <Ionicons name="cloudy-outline" size={20} color="gray" style={styles.icon} />;
    } else {
      return <Ionicons name="help-outline" size={20} color="red" style={styles.icon} />;
    }
  };

  const translatedCondition = translateCondition(inspectionData.Weather.condition);

  const renderBadge = () => {
    if (badge) {
      return (
        <View style={styles.badge}>
          <Text style={{ color: 'white', fontSize: 12 }}>Dernière inspection</Text>
        </View>
      );
    }
    return null;
  };
  return (
    <ScrollView style={styles.container}>


      <View style={styles.card}>
        {renderBadge()}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="create-outline" size={40} color="orange" style={styles.icon} />
        </TouchableOpacity>

        <View style={styles.row}>
          <Text style={styles.label}>Inspecteur</Text>
          <Text style={styles.value}>{inspectionData.Inspector.firstName} {inspectionData.Inspector.lastName}</Text>
        </View>
        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>CIN</Text>
          <Text style={styles.value}>{inspectionData.Inspector.cin}</Text>
        </View>
        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{new Date(inspectionData.InspectionDateTime).toLocaleDateString('fr-FR')}</Text>
        </View>
        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>Heure</Text>
          <Text style={styles.value}>{new Date(inspectionData.InspectionDateTime).toLocaleTimeString('fr-FR')}</Text>
        </View>
        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.header}>Reine</Text>
          <Text style={styles.value}>
            {renderIconAndTextSeen(inspectionData.Queen.seen)}{'\n\n'}
            {renderIconAndText('Marquée', inspectionData.Queen.isMarked)}

            {'\n\n'}
            {inspectionData.Queen.color && (
              <>
                <Text style={styles.highlight}>Couleur: </Text>{inspectionData.Queen.color} <Ionicons name="color-palette-outline" size={20} color="fuchsia" style={styles.icon} /> {'\n\n'}
              </>
            )}
            {renderIconAndText('Clippée', inspectionData.Queen.clipped)}
            {'\n\n'}
            {renderIconAndText('Essaimée', inspectionData.Queen.isSwarmed)}
            {'\n\n'}
            {inspectionData.Queen.queenCells && (
              <>
                <Text style={styles.highlight}>Cellules royales: </Text>{inspectionData.Queen.queenCells} <Ionicons name="keypad-outline" size={20} color="blue" style={styles.icon} />{'\n\n'}
              </>
            )}
            {inspectionData.Queen.temperament && (
              <>
                <Text style={styles.highlight}>Tempérament: </Text>{inspectionData.Queen.temperament} <Ionicons name="happy-outline" size={20} color="gray" style={styles.icon} /> {'\n\n'}
              </>
            )}
            {inspectionData.Queen.note && (
              <>
                <Text style={styles.highlight}>Note: </Text>{inspectionData.Queen.note} <Ionicons name="receipt-outline" size={20} color="pink" style={styles.icon} />
              </>
            )}
          </Text>
        </View>
        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.header}>Colonie</Text>
          <Text style={styles.value}>
            <Ionicons name="return-down-forward-outline" size={20} color="brown" style={styles.icon} /> {inspectionData.Colony.deadBees ? 'Des abeilles mortes sont présentes' : 'Aucune abeille morte'}{'\n\n'}
            <Text style={styles.highlight}>Force: </Text>{inspectionData.Colony.strength} <Ionicons name="fitness-outline" size={20} color="blue" style={styles.icon} />{'\n\n'}
            <Text style={styles.highlight}>Tempérament: </Text>{inspectionData.Colony.temperament} <Ionicons name="happy-outline" size={20} color="gray" style={styles.icon} />{'\n\n'}
            <Text style={styles.highlight}>Supers: </Text>{inspectionData.Colony.supers} <Ionicons name="file-tray-stacked-outline" size={20} color="orange" style={styles.icon} />{'\n\n'}
            <Text style={styles.highlight}>Cadres de pollen: </Text>{inspectionData.Colony.pollenFrames} <Ionicons name="file-tray-outline" size={20} color="orange" style={styles.icon} />{'\n\n'}
            <Text style={styles.highlight}>Cadres au total: </Text>{inspectionData.Colony.TotalFrames} <Ionicons name="file-tray-full-outline" size={20} color="orange" style={styles.icon} />{'\n\n'}
            {inspectionData.Colony.note && (
              <>
                <Text style={styles.highlight}>Note: </Text>{inspectionData.Colony.note} <Ionicons name="receipt-outline" size={20} color="pink" style={styles.icon} />{'\n'}
              </>
            )}
          </Text>
        </View>
        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.header}>Couvain et Mâles</Text>
          <Text style={styles.value}>
            <Text style={styles.highlight}>État: </Text>{inspectionData.Brood.state} <Ionicons name="shield-checkmark-outline" size={20} color="gray" style={styles.icon} />{'\n\n'}
            <Text style={styles.highlight}>Nombre total du couvain: </Text>{inspectionData.Brood.totalBrood} <Ionicons name="keypad-outline" size={20} color="blue" style={styles.icon} />{'\n\n'}
            <Text style={styles.highlight}>Couvain mâle: </Text>{inspectionData.Brood.maleBrood === 'Régulièr' ? (
              <><Text>{inspectionData.Brood.maleBrood}</Text> <Ionicons name="thumbs-up-outline" size={20} color="green" style={styles.icon} /></>

            ) : (
              <><Text>{inspectionData.Brood.maleBrood}</Text> <Ionicons name="thumbs-down-outline" size={20} color="red" style={styles.icon} /></>)}{'\n\n'}
            <Text style={styles.highlight}>Mâles observés </Text>
            {inspectionData.DronesSeen ? <Ionicons name="checkmark-outline" size={20} color="green" style={styles.icon} />
              : <Ionicons name="close-outline" size={20} color="red" style={styles.icon} />
            }{'\n\n'}
          </Text>
        </View>
        <View style={styles.divider} />

        {inspectionData.Supplies ? (
          <View style={styles.section}>
            <Text style={styles.header}>Nourritures</Text>
            <Text style={styles.value}>
              <Text style={styles.highlight}>Produit: </Text>{inspectionData.Supplies.product} <Ionicons name="flower-outline" size={20} color="orange" style={styles.icon} />{'\n\n'}
              <Text style={styles.highlight}>Ingrédients: </Text>{inspectionData.Supplies.ingredients.name} <Ionicons name="extension-puzzle-outline" size={20} color="green" style={styles.icon} />{'\n\n'}
              <Text style={styles.highlight}>Quantité: </Text>{inspectionData.Supplies.ingredients.quantity} <Ionicons name="layers-outline" size={20} color="brown" style={styles.icon} />{'\n\n'}
              <Text style={styles.highlight}>Unité: </Text>{inspectionData.Supplies.ingredients.unit} <Ionicons name="eyedrop-outline" size={20} color="aqua" style={styles.icon} />{'\n\n'}
              {inspectionData.Supplies.note && (
                <>
                  <Text style={styles.highlight}>
                    Note:</Text> {inspectionData.Supplies.note} <Ionicons name="receipt-outline" size={20} color="pink" style={styles.icon} />

                  {'\n\n'}
                </>
              )}
            </Text>
          </View>
        ) : (<Text style={styles.value}>-</Text>)}
        <View style={styles.divider} />

        {inspectionData.BeeHealth ? (
          <View style={styles.section}>
            <Text style={styles.header}>Maladie et Traitement </Text>
            <Text style={styles.value}>
              <Text style={styles.highlight}>Maladie: </Text>{inspectionData.BeeHealth.disease} <Ionicons name="color-filter-outline" size={20} color="red" style={styles.icon} />{'\n\n'}
              <Text style={styles.highlight}>Traitement: </Text>{inspectionData.BeeHealth.treatment} <Ionicons name="pulse-outline" size={20} color="green" style={styles.icon} />{'\n\n'}
              <Text style={styles.highlight}>Durée: </Text>
              {inspectionData.BeeHealth.duration.from && new Date(inspectionData.BeeHealth.duration.from).toLocaleDateString('fr-FR')}
              {' '} à {' '}
              {inspectionData.BeeHealth.duration.to && new Date(inspectionData.BeeHealth.duration.to).toLocaleDateString('fr-FR')} <Ionicons name="calendar-number-outline" size={20} color="gray" style={styles.icon} />
              {'\n\n'}
              <Text style={styles.highlight}>Quantité: </Text>{inspectionData.BeeHealth.quantity} <Ionicons name="layers-outline" size={20} color="brown" style={styles.icon} />{'\n\n'}
              <Text style={styles.highlight}>Doses: </Text>{inspectionData.BeeHealth.doses} <Ionicons name="color-fill-outline" size={20} color="aqua" style={styles.icon} />{'\n\n'}
              {inspectionData.BeeHealth.note && (
                <>
                  <Text style={styles.highlight}>
                    Note:</Text> {inspectionData.BeeHealth.note} <Ionicons name="receipt-outline" size={20} color="pink" style={styles.icon} />
                </>
              )}
            </Text>
          </View>
        ) : (<Text style={styles.value}>-</Text>)}
        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.header}>Récoltes</Text>
          <Text style={styles.value}>
            <Text style={styles.highlight}>Réserves de miel: </Text>{inspectionData.HoneyStores} <Ionicons name="flask-outline" size={20} color="orange" style={styles.icon} /> {'\n\n'}
            <Text style={styles.highlight}>Réserves de pollen: </Text>{inspectionData.PollenStores} <Ionicons name="file-tray-outline" size={20} color="orange" style={styles.icon} />
          </Text>
        </View>
        <View style={styles.divider} />

        {inspectionData.Adding ? (
          <View style={styles.section}>
            <Text style={styles.header}>Ajouts  </Text>
            <Text style={styles.value}>
              {inspectionData.Adding.ActivityAdd} <Ionicons name="checkmark-circle-outline" size={20} color="green" style={styles.icon} />{'\n\n'}
              <Text style={styles.highlight}>Quantité ajoutée: </Text>{inspectionData.Adding.QuantityAdded} <Ionicons name="layers-outline" size={20} color="brown" style={styles.icon} />
            </Text>
          </View>
        ) : (<Text style={styles.value}>-</Text>)}
        <View style={styles.divider} />

        {inspectionData.Removing ? (
          <View style={styles.section}>
            <Text style={styles.header}>Enlévements </Text>
            <Text style={styles.value}>
              {inspectionData.Removing.ActivityRemove} <Ionicons name="close-circle-outline" size={20} color="red" style={styles.icon} />{'\n\n'}
              <Text style={styles.highlight}>Quantité retirée: </Text>{inspectionData.Removing.QuantityRemoved} <Ionicons name="layers-outline" size={20} color="brown" style={styles.icon} />
            </Text>
          </View>
        ) : (<Text style={styles.value}>-</Text>)}
        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.header}>Météo</Text>
          <Text style={styles.value}>
            <Text style={styles.highlight}>Condition: </Text>{translatedCondition} {renderWeatherIcon(inspectionData.Weather.condition)}
            {'\n\n'}
            <Text style={styles.highlight}>Température: </Text>{inspectionData.Weather.temperature}°C <Ionicons name="thermometer-outline" size={20} color="red" style={styles.icon} />{'\n\n'}
            <Text style={styles.highlight}>Humidité: </Text>{inspectionData.Weather.humidity}% <Ionicons name="water-outline" size={20} color="aqua" style={styles.icon} />{'\n\n'}
            <Text style={styles.highlight}>Pression: </Text>{inspectionData.Weather.pressure} hPa <Ionicons name="speedometer-outline" size={20} color="gray" style={styles.icon} />{'\n\n'}
            <Text style={styles.highlight}>Vitesse du vent: </Text>{inspectionData.Weather.windSpeed} m/s <Ionicons name="flash-outline" size={20} color="green" style={styles.icon} />{'\n\n'}
            <Text style={styles.highlight}>Direction du vent: </Text>{inspectionData.Weather.windDirection}° <Ionicons name="compass-outline" size={20} color="orange" style={styles.icon} />
          </Text>
        </View>
        <View style={styles.divider} />

        {inspectionData.Note ? (
          <View style={styles.section}>
            <Text style={styles.header}>Note</Text>
            <Text style={styles.value}>
              {inspectionData.Note} <Ionicons name="receipt-outline" size={20} color="pink" style={styles.icon} />
            </Text>
          </View>
        ) : null}

      </View>
      <View style={styles.divider} />

      <EditInspectionModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        formData={formData}
        handleModalInputChange={handleModalInputChange}
        handleSave={handleSave}
      />

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF5E0',
    marginTop: 10,
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 15,
  },
  section: {
    marginBottom: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  highlight: {
    color: '#977700',
  },
  divider: {
    borderBottomColor: '#cccccc',
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 5,
  },

  editButton: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 10,
    marginBottom: 20,
  },
  editButtonText: {
    fontSize: 18,
    color: 'blue',
    marginLeft: 5,
  },

  badge: {
    position: 'absolute',
    top: 10,
    left: 4,
    backgroundColor: "#5188C7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    zIndex: 1,
  },


});

export default InspectionDetails;
