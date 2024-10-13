import React, { useState } from 'react';
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
        <Text style={[styles.highlight, styles.inlineText]}>موجودة<Ionicons name="checkmark-outline" size={22} color="green" style={styles.icon} />
        </Text>
      );
    } else {
      return (
        <Text style={[styles.highlight, styles.inlineText]}>غير موجودة<Ionicons name="close-outline" size={22} color="red" style={styles.icon} /></Text>
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
        <Text style={styles.highlight}>غير {text} <Ionicons name="close-outline" size={22} color="red" style={styles.icon} /></Text>
      );
    }
  };

  const weatherConditionMapping = {
    Thunderstorm: 'عاصفة رعدية',
    Drizzle: 'رذاذ',
    Rain: 'مطر',
    Snow: 'ثلج',
    Mist: 'ضباب خفيف',
    Smoke: 'دخان',
    Haze: 'غبار خفيف',
    Dust: 'غبار',
    Fog: 'ضباب',
    Sand: 'رمل',
    Ash: 'رماد',
    Squall: 'زوبعة',
    Tornado: 'اعصار',
    Clear: 'صافي',
    Clouds: 'غائم',
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
          <Text style={{ color: 'white', fontSize: 12 }}>أخر متابعة</Text>
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
        showAlertAndNavigate('تم حذف المتابعة الدورية بنجاح');

      } else {
        console.error('Failed to delete inspection:', response.data.message);
        showAlert('Échec de la suppression de l\'inspection');
        showAlert('فشل في حذف المتابعة الدورية');

      }
    } catch (error) {
      console.error('Error deleting inspection:', error.message);
      showAlert('خطأ في حذف المتابعة الدورية');
    }
  };

  const showAlertAndNavigate = (message) => {
    Alert.alert(
      'نجاح',
      message,
      [
        {
          text: 'موافق',
          onPress: () => navigation.navigate('Home'),
        },
      ],
      { cancelable: false }
    );
  };

  const showAlert = (message) => {
    Alert.alert(
      'خطأ',
      message,
      [
        { text: 'موافق', onPress: () => console.log('موافق تم الضغط') }
      ],
      { cancelable: false }
    );
  };

  const confirmDelete = (inspectionId) => {
    Alert.alert(
      'تأكيد',
      'هل أنت متأكد أنك تريد حذف هذه المتابعة الدورية؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'حذف',
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
          <Text style={styles.value}>{inspectionData.Inspector.firstName} {inspectionData.Inspector.lastName}</Text>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>المتفقد</Text>
            <Ionicons name="person-outline" size={14} color="#977700" style={styles.icon} />
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.value}>{inspectionData.Inspector.cin}</Text>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>رقم .ب.ت.و</Text>
            <Ionicons name="id-card-outline" size={14} color="#977700" style={styles.icon} />
          </View>
        </View>
        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.value}>
            {inspectionData.Inspector.phone
              ? `(${inspectionData.Inspector.phone.substring(0, 4)})${inspectionData.Inspector.phone.substring(4)}`
              : ''}
          </Text>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>الهاتف</Text>
            <Ionicons name="call-outline" size={14} color="#977700" style={styles.icon} />
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.value}>{new Date(inspectionData.InspectionDateTime).toLocaleDateString('fr-FR')}</Text>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>التاريخ</Text>
            <Ionicons name="calendar-outline" size={14} color="#977700" style={styles.icon} />
          </View>
        </View>
        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.value}>{new Date(inspectionData.InspectionDateTime).toLocaleTimeString('fr-FR')}</Text>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>الساعة</Text>
            <Ionicons name="time-outline" size={14} color="#977700" style={styles.icon} />
          </View>
        </View>

        {inspectionData.Queen && (
          <>
            <View style={styles.divider} />

            <View style={styles.section}>
              <Text style={styles.header}>الملكة</Text>
              <Text style={styles.value}>
                {renderIconAndTextSeen(inspectionData.Queen.seen)}{'\n\n'}
                {renderIconAndText('معلمة', inspectionData.Queen.isMarked)}


                {inspectionData.Queen.color && (

                  <>{'\n\n'}
                    <Text style={styles.highlight}>اللون: </Text>{inspectionData.Queen.color} <Ionicons name="color-palette-outline" size={22} color="fuchsia" style={styles.icon} />
                  </>
                )}{'\n\n'}

                {renderIconAndText('مقيدة', inspectionData.Queen.clipped)}
                {'\n\n'}
                {renderIconAndText('مُتسربة', inspectionData.Queen.isSwarmed)}
                {'\n\n'}

                {inspectionData.Queen.queenCells && (

                  <View style={styles.labelContainer}>

                    <Text style={styles.value}>{inspectionData.Queen.queenCells}</Text>
                    <Text style={styles.highlight}>الخلايا الملكية: </Text>
                    <Ionicons name="keypad-outline" size={22} color="blue" style={styles.icon} />

                  </View>
                )}
                <Text>{'\n\n'}</Text>

                {inspectionData.Queen.temperament && (

                  <View style={styles.labelContainer}>

                    <Text style={styles.value}>{inspectionData.Queen.temperament}</Text>
                    <Text style={styles.highlight}>سلوك الملكة: </Text>
                    <Ionicons name="happy-outline" size={22} color="gray" style={styles.icon} />

                  </View>
                )}
                <Text>{'\n\n'}</Text>

                {inspectionData.Queen.note && (

                  <View style={styles.labelContainer}>

                    <Text style={styles.value}>{inspectionData.Queen.note} </Text>
                    <Text style={styles.highlight}>ملاحظة: </Text>
                    <Ionicons name="receipt-outline" size={22} color="pink" style={styles.icon} />

                  </View>
                )}
              </Text>
            </View>
          </>
        )}


        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.header}>المستعمرة</Text>

          <View style={styles.labelContainer}>
            <Text style={styles.value}> {inspectionData.Colony.deadBees ? 'وجود نحل ميت' : 'لا يوجد نحل ميت'}</Text>
            <Ionicons name="return-down-back-outline" size={22} color="brown" style={styles.icon} />
            <Text>{'\n\n'}</Text>
          </View>


          <View style={styles.labelContainer}>
            <Text style={styles.value}>{inspectionData.Colony.strength}</Text>
            <Text style={styles.highlight}>قوة المستعمرة: </Text>
            <Ionicons name="fitness-outline" size={22} color="blue" style={styles.icon} />
            <Text>{'\n\n'}</Text>
          </View>



          <View style={styles.labelContainer}>
            <Text style={styles.value}>{inspectionData.Colony.temperament}</Text>
            <Text style={styles.highlight}>سلوك المستعمرة: </Text>
            <Ionicons name="happy-outline" size={22} color="gray" style={styles.icon} />
            <Text>{'\n\n'}</Text>
          </View>



          <View style={styles.labelContainer}>
            <Text style={styles.value}>{inspectionData.Colony.supers}</Text>
            <Text style={styles.highlight}>عسالات: </Text>
            <Ionicons name="file-tray-stacked-outline" size={22} color="orange" style={styles.icon} />
            <Text>{'\n\n'}</Text>
          </View>



          <View style={styles.labelContainer}>
            <Text style={styles.value}>{inspectionData.Colony.pollenFrames}</Text>
            <Text style={styles.highlight}>إطارات حبوب اللقاح: </Text>
            <Ionicons name="file-tray-outline" size={22} color="orange" style={styles.icon} />
            <Text>{'\n\n'}</Text>
          </View>



          <View style={styles.labelContainer}>
            <Text style={styles.value}>{inspectionData.Colony.TotalFrames}</Text>
            <Text style={styles.highlight}>إجمالي الإطارات: </Text>
            <Ionicons name="file-tray-full-outline" size={22} color="orange" style={styles.icon} />
            <Text>{'\n\n'}</Text>
          </View>

          <Text style={styles.value}>
            {inspectionData.Colony.note && (


              <View style={styles.labelContainer}>
                <Text style={styles.value}>{inspectionData.Colony.note}</Text>
                <Text style={styles.highlight}>ملاحظة: </Text>
                <Ionicons name="receipt-outline" size={22} color="pink" style={styles.icon} />
                <Text>{'\n\n'}</Text>
              </View>
            )}

          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.header}>الحضنة والذكور</Text>

          <View style={styles.labelContainer}>
            <Text style={styles.value}>{inspectionData.Brood.state}</Text>
            <Text style={styles.highlight}>الحالة: </Text>
            <Ionicons name="shield-checkmark-outline" size={22} color="gray" style={styles.icon} />
            <Text>{'\n\n'}</Text>
          </View>

          <View style={styles.labelContainer}>
            <Text style={styles.value}>{inspectionData.Brood.totalBrood}</Text>
            <Text style={styles.highlight}>إجمالي الحضنة: </Text>
            <Ionicons name="keypad-outline" size={22} color="blue" style={styles.icon} />
            <Text>{'\n\n'}</Text>
          </View>


          {inspectionData.Brood.maleBrood === 'منتظمة' ? (
            <View style={styles.labelContainer}>
              <Ionicons name="thumbs-up-outline" size={22} color="green" style={styles.icon} />
              <Text style={styles.value}>{inspectionData.Brood.maleBrood}</Text>
              <Text style={styles.highlight}>حضنة الذكور: </Text>
              <Text>{'\n\n'}</Text>
            </View>
          ) : (
            <View style={styles.labelContainer}>
              <Ionicons name="thumbs-down-outline" size={22} color="red" style={styles.icon} />
              <Text style={styles.value}>{inspectionData.Brood.maleBrood}</Text>
              <Text style={styles.highlight}>حضنة الذكور: </Text>
              <Text>{'\n\n'}</Text>
            </View>
          )}


          {inspectionData.DronesSeen ? (
            <View style={styles.labelContainer}>
              <Ionicons name="checkmark-outline" size={22} color="green" style={styles.icon} />
              <Text style={styles.highlight}>وجود الذكور</Text>
            </View>
          ) : (
            <View style={styles.labelContainer}>
              <Ionicons name="close-outline" size={22} color="red" style={styles.icon} />
              <Text style={styles.highlight}>وجود الذكور</Text>
            </View>
          )}

        </View>

        <View style={styles.divider} />
        {inspectionData.Supplies && (

          <View style={styles.section}>
            <Text style={styles.header}>غذاء النحل</Text>

            <View style={styles.labelContainer}>
              <Text style={styles.value}>{inspectionData.Supplies.product}</Text>
              <Text style={styles.highlight}>المنتج: </Text>
              <Ionicons name="flower-outline" size={22} color="orange" style={styles.icon} />
              <Text>{'\n\n'}</Text>
            </View>



            <View style={styles.labelContainer}>
              <Text style={styles.value}>{inspectionData.Supplies.ingredients.name}</Text>
              <Text style={styles.highlight}>المكونات: </Text>
              <Ionicons name="extension-puzzle-outline" size={22} color="green" style={styles.icon} />
              <Text>{'\n\n'}</Text>
            </View>

            <View style={styles.labelContainer}>
              <Text style={styles.value}>{inspectionData.Supplies.ingredients.quantity}</Text>
              <Text style={styles.highlight}>الكمية: </Text>
              <Ionicons name="layers-outline" size={22} color="brown" style={styles.icon} />
              <Text>{'\n\n'}</Text>
            </View>

            <View style={styles.labelContainer}>
              <Text style={styles.value}>{inspectionData.Supplies.ingredients.unit}</Text>
              <Text style={styles.highlight}>الوحدة: </Text>
              <Ionicons name="eyedrop-outline" size={22} color="#5188C7" style={styles.icon} />
              <Text>{'\n\n'}</Text>
            </View>

            <Text style={styles.value}>

              {inspectionData.Supplies.note && (


                <View style={styles.labelContainer}>
                  <Text style={styles.value}>{inspectionData.Supplies.note}</Text>
                  <Text style={styles.highlight}>ملاحظة: </Text>
                  <Ionicons name="receipt-outline" size={22} color="pink" style={styles.icon} />
                  <Text>{'\n\n'}</Text>
                </View>
              )}
            </Text>
          </View>


        )}



        {inspectionData.BeeHealth && (
          <>
            <View style={styles.divider} />
            <View style={styles.section}>
              <Text style={styles.header}>صحة النحل</Text>

              <View style={styles.labelContainer}>
                <Text style={styles.value}>{inspectionData.BeeHealth.disease}</Text>
                <Text style={styles.highlight}>المرض: </Text>
                <Ionicons name="color-filter-outline" size={22} color="red" style={styles.icon} />
                <Text>{'\n\n'}</Text>
              </View>

              <View style={styles.labelContainer}>
                <Text style={styles.value}>{inspectionData.BeeHealth.treatment}</Text>
                <Text style={styles.highlight}>العلاج: </Text>
                <Ionicons name="pulse-outline" size={22} color="green" style={styles.icon} />
                <Text>{'\n\n'}</Text>
              </View>

              <View style={styles.labelContainer}>
                <Text style={styles.value}>{inspectionData.BeeHealth.duration.from && new Date(inspectionData.BeeHealth.duration.from).toLocaleDateString('fr-FR')}
                  {' '} إلى{' '}
                  {inspectionData.BeeHealth.duration.to && new Date(inspectionData.BeeHealth.duration.to).toLocaleDateString('fr-FR')}</Text>
                <Text style={styles.highlight}>المدة: </Text>
                <Ionicons name="calendar-number-outline" size={22} color="gray" style={styles.icon} />
                <Text>{'\n\n'}</Text>
              </View>


              <View style={styles.labelContainer}>
                <Text style={styles.value}>{inspectionData.BeeHealth.quantity}</Text>
                <Text style={styles.highlight}>الكمية: </Text>
                <Ionicons name="layers-outline" size={22} color="brown" style={styles.icon} />
                <Text>{'\n\n'}</Text>
              </View>

              <View style={styles.labelContainer}>
                <Text style={styles.value}>{inspectionData.BeeHealth.doses}</Text>
                <Text style={styles.highlight}>الجرعات: </Text>
                <Ionicons name="color-fill-outline" size={22} color="#5188C7" style={styles.icon} />
                <Text>{'\n\n'}</Text>
              </View>

              {inspectionData.BeeHealth.note && (

                <View style={styles.labelContainer}>
                  <Text style={styles.value}>{inspectionData.BeeHealth.note}</Text>
                  <Text style={styles.highlight}>ملاحظة: </Text>
                  <Ionicons name="receipt-outline" size={22} color="pink" style={styles.icon} />
                  <Text>{'\n\n'}</Text>
                </View>
              )}
            </View>
            <View style={styles.divider} />
          </>
        )}



        <View style={styles.section}>
          <Text style={styles.header}>الحصاد</Text>

          <View style={styles.labelContainer}>
            <Text style={styles.value}>{inspectionData.HoneyStores}</Text>
            <Text style={styles.highlight}>حصاد العسل: </Text>
            <Ionicons name="flask-outline" size={22} color="orange" style={styles.icon} />
            <Text>{'\n\n'}</Text>
          </View>

          <View style={styles.labelContainer}>
            <Text style={styles.value}>{inspectionData.PollenStores}</Text>
            <Text style={styles.highlight}>حصاد حبوب اللقاح: </Text>
            <Ionicons name="file-tray-outline" size={22} color="orange" style={styles.icon} />
            <Text>{'\n\n'}</Text>
          </View>

        </View>


        {inspectionData.Adding && (
          <>
            <View style={styles.divider} />
            <View style={styles.section}>
              <Text style={styles.header}>الاضافات</Text>

              <View style={styles.labelContainer}>
                <Text style={styles.value}>{inspectionData.Adding.ActivityAdd}</Text>
                <Ionicons name="checkmark-circle-outline" size={22} color="green" style={styles.icon} />
              </View>

              <View style={styles.labelContainer}>
                <Text style={styles.value}>{inspectionData.Adding.QuantityAdded}</Text>
                <Text style={styles.highlight}>الكمية المضافة: </Text>
                <Ionicons name="layers-outline" size={22} color="brown" style={styles.icon} />
                <Text>{'\n\n'}</Text>
              </View>

            </View>
          </>
        )}


        {inspectionData.Removing && (
          <>
            <View style={styles.divider} />
            <View style={styles.section}>
              <Text style={styles.header}>الإزالات</Text>


              <View style={styles.labelContainer}>
                <Text style={styles.value}> {inspectionData.Removing.ActivityRemove}</Text>
                <Ionicons name="close-circle-outline" size={22} color="red" style={styles.icon} />
              </View>

              <View style={styles.labelContainer}>
                <Text style={styles.value}>{inspectionData.Removing.QuantityRemoved}</Text>
                <Text style={styles.highlight}>الكميةالمزيلة: </Text>
                <Ionicons name="layers-outline" size={22} color="brown" style={styles.icon} />
                <Text>{'\n\n'}</Text>
              </View>
            </View>
          </>

        )}

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.header}>الطقس</Text>


          <View style={styles.labelContainer}>
            {renderWeatherIcon(inspectionData.Weather.condition)}
            <Text style={styles.value}>{translatedCondition} </Text>
            <Text style={styles.highlight}>الحالة: </Text>
            <Text>{'\n\n'}</Text>
          </View>

          <View style={styles.labelContainer}>
            <Ionicons name="thermometer-outline" size={22} color="red" style={styles.icon} />
            <Text style={styles.value}>{inspectionData.Weather.temperature} °C</Text>
            <Text style={styles.highlight}>درجة الحرارة: </Text>
            <Text>{'\n\n'}</Text>
          </View>


          <View style={styles.labelContainer}>
            <Ionicons name="water-outline" size={22} color="#5188C7" style={styles.icon} />
            <Text style={styles.value}>{inspectionData.Weather.humidity} %</Text>
            <Text style={styles.highlight}>الرطوبة: </Text>
            <Text>{'\n\n'}</Text>
          </View>

          <View style={styles.labelContainer}>
            <Ionicons name="speedometer-outline" size={22} color="gray" style={styles.icon} />
            <Text style={styles.value}>{inspectionData.Weather.pressure} hPa</Text>
            <Text style={styles.highlight}>الضغط: </Text>
            <Text>{'\n\n'}</Text>
          </View>

          <View style={styles.labelContainer}>
            <Ionicons name="flash-outline" size={22} color="green" style={styles.icon} />
            <Text style={styles.value}>{inspectionData.Weather.windSpeed} (كم/ساعة)</Text>
            <Text style={styles.highlight}>سرعة الرياح: </Text>
            <Text>{'\n\n'}</Text>
          </View>

          <View style={styles.labelContainer}>
            <Ionicons name="compass-outline" size={22} color="orange" style={styles.icon} />
            <Text style={styles.value}>{inspectionData.Weather.windDirection} °</Text>
            <Text style={styles.highlight}>اتجاه الرياح: </Text>
            <Text>{'\n\n'}</Text>
          </View>

        </View>
        <View style={styles.divider} />

        {inspectionData.Note ? (
          <View style={styles.section}>
            <Text style={styles.header}>ملاحظة</Text>

            <View style={styles.labelContainer}>
              <Text style={styles.value}>{inspectionData.Note}</Text>
              <Ionicons name="receipt-outline" size={22} color="pink" style={styles.icon} />

            </View>
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
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
  },
  value: {
    fontSize: 15,
    maxWidth: '100%',
    textAlign: 'right',
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
