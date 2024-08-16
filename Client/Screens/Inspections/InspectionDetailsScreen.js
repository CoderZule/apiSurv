import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EditInspectionModal from './EditInspectionModal';
  import axios from '../../axiosConfig';

const InspectionDetailsScreen = ({ route, navigation }) => {
  const { inspectionData, badge } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  
  const [formData, setFormData] = useState({ ...inspectionData });
  
 

  const handleModalInputChange = (section, fieldOrValue, value) => {
    
    const updatedFormData = { ...formData };

     
    if (section === 'Note' || section === 'HoneyStores' || section === 'PollenStores' || section === 'DronesSeen') {
      updatedFormData[section] = fieldOrValue;;
    } else if (section === 'Supplies' && fieldOrValue === 'ingredients') {
    
      updatedFormData.Supplies = {
        ...updatedFormData.Supplies,
        ingredients: {
          ...updatedFormData.Supplies.ingredients,
          ...value  
        }
      };
    } else {
 
      updatedFormData[section] = {
        ...updatedFormData[section],
        [fieldOrValue]: value
      };
    }

     
    setFormData(updatedFormData);
  };



  const renderIconAndTextSeen = (condition) => {
    if (condition) {
      return (
        <Text style={[styles.highlight, styles.inlineText]}>Observée <Ionicons name="checkmark-outline" size={22} color="green" style={styles.icon} />
        </Text>
      );
    } else {
      return (
        <Text style={[styles.highlight, styles.inlineText]}>Non Observée <Ionicons name="close-outline" size={22} color="red" style={styles.icon} /></Text>
      );
    }
  }

  const renderIconAndText = (text, condition) => {
    if (condition) {
      return (
        <Text style={styles.highlight}>{text} <Ionicons name="checkmark-outline" size={22} color="green" style={styles.icon} /></Text>
      );
    } else {
      return (
        <Text style={styles.highlight}>Non {text} <Ionicons name="close-outline" size={22} color="red" style={styles.icon} /></Text>
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
      return <Ionicons name="thunderstorm-outline" size={22} color="black" style={styles.icon} />;
    } else if (condition.includes('Drizzle')) {
      return <Ionicons name="rainy-outline" size={22} color="blue" style={styles.icon} />;
    } else if (condition.includes('Rain')) {
      return <Ionicons name="rainy-outline" size={22} color="blue" style={styles.icon} />;
    } else if (condition.includes('Snow')) {
      return <Ionicons name="snow-outline" size={22} color="white" style={styles.icon} />;
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
      return <Ionicons name="cloud-outline" size={22} color="gray" style={styles.icon} />;
    } else if (condition.includes('Clear')) {
      return <Ionicons name="sunny-outline" size={22} color="orange" style={styles.icon} />;
    } else if (condition.includes('Clouds')) {
      return <Ionicons name="cloudy-outline" size={22} color="gray" style={styles.icon} />;
    } else {
      return <Ionicons name="help-outline" size={22} color="red" style={styles.icon} />;
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

  const handleDelete = async (inspectionId) => {
    try {
      const response = await axios.post('/inspection/deleteInspection', { inspectionId });

      if (response.status === 200) {
        console.log('Inspection supprimée avec succès');
         showAlertAndNavigate('Inspection supprimée avec succès');
      } else {
        console.error('Failed to delete inspection:', response.data.message);
        showAlert('Échec de la suppression de l\'inspection');
      }
    } catch (error) {
      console.error('Error deleting inspection:', error.message);
      showAlert('Erreur lors de la suppression de l\'inspection');
    }
  };

  const showAlertAndNavigate = (message) => {
    Alert.alert(
      'Success',
      message,
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Home'),  
        },
      ],
      { cancelable: false }
    );
  };

  const showAlert = (message) => {
    Alert.alert(
      'Error',
      message,
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') }
      ],
      { cancelable: false }
    );
  };

  const confirmDelete = (inspectionId) => {
    Alert.alert(
      'Confirmation',
      'Êtes-vous sûr de vouloir supprimer cette inspection?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          onPress: () => handleDelete(inspectionId),
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };


  return (
    <ScrollView style={styles.container}>


      <View style={styles.card}>

        <View style={styles.badgeContainer}>
          {renderBadge()}
        </View>

        <View style={styles.iconsContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => confirmDelete(inspectionData._id)}>
            <Ionicons name="trash-outline" size={30} color="#FF0000" style={styles.icon} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setModalVisible(true)}>
            <Ionicons name="create-outline" size={30} color="orange" style={styles.icon} />
          </TouchableOpacity>
        </View>





        <View style={styles.row}>
          <Text style={styles.label}><Ionicons name="person-outline" size={14} color="#977700"  style={styles.icon} /> Inspecteur</Text>
          <Text style={styles.value}>{inspectionData.Inspector.firstName} {inspectionData.Inspector.lastName}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.label}><Ionicons name="id-card-outline" size={14} color="#977700"  style={styles.icon} /> CIN</Text>
          <Text style={styles.value}>{inspectionData.Inspector.cin}</Text>
        </View>
        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}><Ionicons name="call-outline" size={14} color="#977700"  style={styles.icon} /> Tel</Text>
          <Text style={styles.value}>
            {inspectionData.Inspector.phone
              ? `(${inspectionData.Inspector.phone.substring(0, 4)})${inspectionData.Inspector.phone.substring(4)}`
              : ''}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}><Ionicons name="calendar-outline" size={14} color="#977700"  style={styles.icon} /> Date</Text>
          <Text style={styles.value}>{new Date(inspectionData.InspectionDateTime).toLocaleDateString('fr-FR')}</Text>
        </View>
        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}><Ionicons name="time-outline" size={14} color="#977700"  style={styles.icon} /> Heure</Text>
          <Text style={styles.value}>{new Date(inspectionData.InspectionDateTime).toLocaleTimeString('fr-FR')}</Text>
        </View>

        {inspectionData.Queen && (
          <>
            <View style={styles.divider} />

            <View style={styles.section}>
              <Text style={styles.header}>Reine</Text>
              <Text style={styles.value}>
                {renderIconAndTextSeen(inspectionData.Queen.seen)}{'\n\n'}
                {renderIconAndText('Marquée', inspectionData.Queen.isMarked)}


                {inspectionData.Queen.color && (

                  <>{'\n\n'}
                    <Text style={styles.highlight}>Couleur: </Text>{inspectionData.Queen.color} <Ionicons name="color-palette-outline" size={22} color="fuchsia" style={styles.icon} />
                  </>
                )}{'\n\n'}

                {renderIconAndText('Clippée', inspectionData.Queen.clipped)}
                {'\n\n'}
                {renderIconAndText('Essaimée', inspectionData.Queen.isSwarmed)}
                {'\n\n'}

                {inspectionData.Queen.queenCells && (
                  <>
                    <Text style={styles.highlight}>Cellules royales: </Text>{inspectionData.Queen.queenCells} <Ionicons name="keypad-outline" size={22} color="blue" style={styles.icon} />{'\n\n'}
                  </>
                )}

                {inspectionData.Queen.temperament && (
                  <>
                    <Text style={styles.highlight}>Tempérament: </Text>{inspectionData.Queen.temperament} <Ionicons name="happy-outline" size={22} color="gray" style={styles.icon} /> {'\n\n'}
                  </>
                )}
                {inspectionData.Queen.note && (
                  <>
                    <Text style={styles.highlight}>Note: </Text>{inspectionData.Queen.note} <Ionicons name="receipt-outline" size={22} color="pink" style={styles.icon} />
                  </>
                )}
              </Text>
            </View>
          </>
        )}


        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.header}>Colonie</Text>
          <Text style={styles.value}>
            <Ionicons name="return-down-forward-outline" size={22} color="brown" style={styles.icon} /> {inspectionData.Colony.deadBees ? 'Des abeilles mortes sont présentes' : 'Aucune abeille morte'}{'\n\n'}
            <Text style={styles.highlight}>Force: </Text>{inspectionData.Colony.strength} <Ionicons name="fitness-outline" size={22} color="blue" style={styles.icon} />{'\n\n'}
            <Text style={styles.highlight}>Tempérament: </Text>{inspectionData.Colony.temperament} <Ionicons name="happy-outline" size={22} color="gray" style={styles.icon} />{'\n\n'}
            <Text style={styles.highlight}>Supers: </Text>{inspectionData.Colony.supers} <Ionicons name="file-tray-stacked-outline" size={22} color="orange" style={styles.icon} />{'\n\n'}
            <Text style={styles.highlight}>Cadres de pollen: </Text>{inspectionData.Colony.pollenFrames} <Ionicons name="file-tray-outline" size={22} color="orange" style={styles.icon} />{'\n\n'}
            <Text style={styles.highlight}>Cadres au total: </Text>{inspectionData.Colony.TotalFrames} <Ionicons name="file-tray-full-outline" size={22} color="orange" style={styles.icon} />{'\n\n'}
            {inspectionData.Colony.note && (
              <>
                <Text style={styles.highlight}>Note: </Text>{inspectionData.Colony.note} <Ionicons name="receipt-outline" size={22} color="pink" style={styles.icon} />{'\n'}
              </>
            )}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.header}>Couvain et Mâles</Text>
          <Text style={styles.value}>
            <Text style={styles.highlight}>État: </Text>{inspectionData.Brood.state} <Ionicons name="shield-checkmark-outline" size={22} color="gray" style={styles.icon} />{'\n\n'}
            <Text style={styles.highlight}>Nombre total du couvain: </Text>{inspectionData.Brood.totalBrood} <Ionicons name="keypad-outline" size={22} color="blue" style={styles.icon} />{'\n\n'}
            <Text style={styles.highlight}>Couvain mâle: </Text>{inspectionData.Brood.maleBrood === 'Régulièr' ? (
              <><Text>{inspectionData.Brood.maleBrood}</Text> <Ionicons name="thumbs-up-outline" size={22} color="green" style={styles.icon} /></>

            ) : (
              <><Text>{inspectionData.Brood.maleBrood}</Text> <Ionicons name="thumbs-down-outline" size={22} color="red" style={styles.icon} /></>)}{'\n\n'}
            <Text style={styles.highlight}>Mâles observés </Text>
            {inspectionData.DronesSeen ? <Ionicons name="checkmark-outline" size={22} color="green" style={styles.icon} />
              : <Ionicons name="close-outline" size={22} color="red" style={styles.icon} />
            }{'\n\n'}
          </Text>
        </View>

        <View style={styles.divider} />
        {inspectionData.Supplies && (

          <View style={styles.section}>
            <Text style={styles.header}>Nourritures</Text>
            <Text style={styles.value}>
              <Text style={styles.highlight}>Produit: </Text>{inspectionData.Supplies.product} <Ionicons name="flower-outline" size={22} color="orange" style={styles.icon} />{'\n\n'}
              <Text style={styles.highlight}>Ingrédients: </Text>{inspectionData.Supplies.ingredients.name} <Ionicons name="extension-puzzle-outline" size={22} color="green" style={styles.icon} />{'\n\n'}
              <Text style={styles.highlight}>Quantité: </Text>{inspectionData.Supplies.ingredients.quantity} <Ionicons name="layers-outline" size={22} color="brown" style={styles.icon} />{'\n\n'}
              <Text style={styles.highlight}>Unité: </Text>{inspectionData.Supplies.ingredients.unit} <Ionicons name="eyedrop-outline" size={22} color="#5188C7" style={styles.icon} />{'\n\n'}
              {inspectionData.Supplies.note && (
                <>
                  <Text style={styles.highlight}>
                    Note:</Text> {inspectionData.Supplies.note} <Ionicons name="receipt-outline" size={22} color="pink" style={styles.icon} />

                  {'\n\n'}
                </>
              )}
            </Text>
          </View>


        )}



        {inspectionData.BeeHealth && (
          <>
            <View style={styles.divider} />
            <View style={styles.section}>
              <Text style={styles.header}>Maladie et Traitement </Text>
              <Text style={styles.value}>
                <Text style={styles.highlight}>Maladie: </Text>{inspectionData.BeeHealth.disease} <Ionicons name="color-filter-outline" size={22} color="red" style={styles.icon} />{'\n\n'}
                <Text style={styles.highlight}>Traitement: </Text>{inspectionData.BeeHealth.treatment} <Ionicons name="pulse-outline" size={22} color="green" style={styles.icon} />{'\n\n'}
                <Text style={styles.highlight}>Durée: </Text>
                {inspectionData.BeeHealth.duration.from && new Date(inspectionData.BeeHealth.duration.from).toLocaleDateString('fr-FR')}
                {' '} à {' '}
                {inspectionData.BeeHealth.duration.to && new Date(inspectionData.BeeHealth.duration.to).toLocaleDateString('fr-FR')} <Ionicons name="calendar-number-outline" size={22} color="gray" style={styles.icon} />
                {'\n\n'}
                <Text style={styles.highlight}>Quantité: </Text>{inspectionData.BeeHealth.quantity} <Ionicons name="layers-outline" size={22} color="brown" style={styles.icon} />{'\n\n'}
                <Text style={styles.highlight}>Doses: </Text>{inspectionData.BeeHealth.doses} <Ionicons name="color-fill-outline" size={22} color="#5188C7" style={styles.icon} />{'\n\n'}
                {inspectionData.BeeHealth.note && (
                  <>
                    <Text style={styles.highlight}>
                      Note:</Text> {inspectionData.BeeHealth.note} <Ionicons name="receipt-outline" size={22} color="pink" style={styles.icon} />
                  </>
                )}
              </Text>
            </View>
            <View style={styles.divider} />
          </>
        )}



        <View style={styles.section}>
          <Text style={styles.header}>Récoltes</Text>
          <Text style={styles.value}>
            <Text style={styles.highlight}>Réserves de miel: </Text>{inspectionData.HoneyStores} <Ionicons name="flask-outline" size={22} color="orange" style={styles.icon} /> {'\n\n'}
            <Text style={styles.highlight}>Réserves de pollen: </Text>{inspectionData.PollenStores} <Ionicons name="file-tray-outline" size={22} color="orange" style={styles.icon} />
          </Text>
        </View>


        {inspectionData.Adding && (
          <>
            <View style={styles.divider} />
            <View style={styles.section}>
              <Text style={styles.header}>Ajouts  </Text>
              <Text style={styles.value}>
                {inspectionData.Adding.ActivityAdd} <Ionicons name="checkmark-circle-outline" size={22} color="green" style={styles.icon} />{'\n\n'}
                <Text style={styles.highlight}>Quantité ajoutée: </Text>{inspectionData.Adding.QuantityAdded} <Ionicons name="layers-outline" size={22} color="brown" style={styles.icon} />
              </Text>
            </View>
          </>
        )}


        {inspectionData.Removing && (
          <>
            <View style={styles.divider} />
            <View style={styles.section}>
              <Text style={styles.header}>Enlévements </Text>
              <Text style={styles.value}>
                {inspectionData.Removing.ActivityRemove} <Ionicons name="close-circle-outline" size={22} color="red" style={styles.icon} />{'\n\n'}
                <Text style={styles.highlight}>Quantité retirée: </Text>{inspectionData.Removing.QuantityRemoved} <Ionicons name="layers-outline" size={22} color="brown" style={styles.icon} />
              </Text>
            </View>
          </>

        )}

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.header}>Météo</Text>
          <Text style={styles.value}>
            <Text style={styles.highlight}>Condition: </Text>{translatedCondition} {renderWeatherIcon(inspectionData.Weather.condition)}
            {'\n\n'}
            <Text style={styles.highlight}>Température: </Text>{inspectionData.Weather.temperature}°C <Ionicons name="thermometer-outline" size={22} color="red" style={styles.icon} />{'\n\n'}
            <Text style={styles.highlight}>Humidité: </Text>{inspectionData.Weather.humidity}% <Ionicons name="water-outline" size={22} color="#5188C7" style={styles.icon} />{'\n\n'}
            <Text style={styles.highlight}>Pression: </Text>{inspectionData.Weather.pressure} hPa <Ionicons name="speedometer-outline" size={22} color="gray" style={styles.icon} />{'\n\n'}
            <Text style={styles.highlight}>Vitesse du vent: </Text>{inspectionData.Weather.windSpeed} m/s <Ionicons name="flash-outline" size={22} color="green" style={styles.icon} />{'\n\n'}
            <Text style={styles.highlight}>Direction du vent: </Text>{inspectionData.Weather.windDirection}° <Ionicons name="compass-outline" size={22} color="orange" style={styles.icon} />
          </Text>
        </View>
        <View style={styles.divider} />

        {inspectionData.Note ? (
          <View style={styles.section}>
            <Text style={styles.header}>Note</Text>
            <Text style={styles.value}>
              {inspectionData.Note} <Ionicons name="receipt-outline" size={22} color="pink" style={styles.icon} />
            </Text>
          </View>
        ) : null}

      </View>


      <EditInspectionModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        formData={formData}
        handleModalInputChange={handleModalInputChange}
        navigation={navigation}
      />

    </ScrollView>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FBF5E0',
    marginTop: 10,
    padding: 4,
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


  icon: {
    marginRight: 5,
  },

  editButton: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 20,
    marginBottom: 20,
  },
  editButtonText: {
    fontSize: 18,
    color: 'blue',
    marginLeft: 5,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    marginBottom: 20,  
  },

  badgeContainer: {
    position: 'relative',  
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',  
    marginLeft: 'auto',  
  },

  badge: {
    position: 'absolute',
    top: 10,
    backgroundColor: "#2EB922",
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 10,
    zIndex: 1,
  },

});

export default InspectionDetailsScreen;
