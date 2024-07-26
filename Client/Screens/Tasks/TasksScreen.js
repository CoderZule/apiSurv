import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Modal, TextInput, StyleSheet, LogBox, SafeAreaView, Alert, ScrollView, Switch } from 'react-native';
import { Calendar } from 'react-native-big-calendar';
import { FontAwesome5 } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import HomeHeader from '../../Components/HomeHeader';
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import axios from '../../axiosConfig';
import { Picker } from '@react-native-picker/picker';
import { taskpriority } from '../Data';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TaskScreen = ({ navigation }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const [events, setEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('');
  const [description, setDescription] = useState('');
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [completed, setCompleted] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isStartPicker, setIsStartPicker] = useState(true);
 

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const currentUserString = await AsyncStorage.getItem('currentUser');
        if (currentUserString) {
          const user = JSON.parse(currentUserString);
          setCurrentUser(user);
        }
      } catch (error) {
        console.error('Error retrieving current user:', error);
      }
    };


    fetchCurrentUser();

  }, []);

  const getPriorityColor = (itemValue) => {
    switch (itemValue) {
      case 'Faible':
        return '#007bff'; // Blue color for 'Faible'
      case 'Élevée':
        return '#dc3545'; // Red color for 'Élevée'
      case 'Normale':
        return '#28a745'; // Green color for 'Normale'
      case 'Critique':
        return '#ffc107';
      default:
        return '#000000'; // Default color
    }
  };

  useEffect(() => {
    LogBox.ignoreLogs([
      'Warning: Unknown: Support for defaultProps will be removed from memo components in a future major release. Use JavaScript default parameters instead.',

    ]);
  }, []);


  const isPastDateTime = (date) => {
    const now = new Date();
    return date < now;
  };

  const openModal = (event = null) => {
    if (event) {
      setSelectedEvent(event);
      setTitle(event.title);
      setPriority(event.priority);
      setDescription(event.description);
      setStart(new Date(event.start));
      setEnd(new Date(event.end));
      setCompleted(event.completed || false); // Add this line

    } else {
      setSelectedEvent(null);
      setTitle('');
      setPriority('');
      setDescription('');
      setStart(new Date());
      setEnd(new Date());
      setCompleted(false); // Add this line


    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedEvent(null);
  };




  const showDatePicker = (isStart) => {
    setIsStartPicker(isStart);
    setDatePickerVisibility(true);
  };

  const handleConfirm = (date) => {
    if (!isPastDateTime(date)) {
      if (isStartPicker) {
        setStart(date);
      } else {
        setEnd(date);
      }
    }
    setDatePickerVisibility(false);
  };

  const fetchTasks = async () => {

    if (!currentUser) {
      // Handle case where currentUser is null
      console.error('Current user is null');
      return;
    }

    try {
      const response = await axios.get(`/task/getAllTasks`, {
        params: {
          userId: currentUser._id
        }
      });
      const fetchedEvents = response.data.data.map(event => ({
        ...event,
        start: event.start ? new Date(event.start) : new Date(), // Default to current date if start is undefined
        end: event.end ? new Date(event.end) : new Date(),     // Default to current date if end is undefined
      }));
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      // Handle error
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchTasks();
    }
  }, [currentUser]);



  const createTask = async () => {
    try {
      if (!title || !priority || !description || !start || !end) {
        return Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      } else {
        // Ensure start and end are Date objects
        const startDate = new Date(start);
        const endDate = new Date(end);


        const response = await axios.post(`/task/create`, {
          title,
          priority,
          description,
          start: startDate.toISOString(), // Convert to ISO string
          end: endDate.toISOString(), // Convert to ISO string
          user: currentUser._id
        });


        const newTask = {
          _id: response.data.data._id,
          title: response.data.data.title,
          priority: response.data.data.priority,
          description: response.data.data.description,
          start: new Date(response.data.data.start),
          end: new Date(response.data.data.end),
          user: currentUser._id

        };

        setEvents([...events, newTask]);
        closeModal();
        Alert.alert('Succès', 'Tâche créée avec succès');
      }

    } catch (error) {
      console.error('Erreur lors de la création de la tâche :', error);
      // Handle error
    }
  };

  const editTask = async () => {
    try {
      if (!title || !priority || !description || !start || !end) {
        return Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      } else {
        const editedTaskData = {
          _id: selectedEvent._id,
          title,
          priority,
          description,
          start,
          end,
          completed
        };

        const response = await axios.post(`/task/editTask`, editedTaskData);
        if (response.status === 200) {
          const updatedTask = {
            ...selectedEvent,
            title,
            priority,
            description,
            start,
            end,
            completed
          };

          setEvents(events.map(event =>
            event._id === selectedEvent._id ? updatedTask : event
          ));
          closeModal();
          Alert.alert('Succès', 'Tâche a été mise à jour avec succès');
        } else {
          console.error('Failed to update task. Server responded with:', response.status);
          // Handle error condition (show alert, log, etc.)
        }

      }


    } catch (error) {
      console.error('Error updating task:', error);
      // Handle error
    }
  };


  const deleteTask = async () => {
    try {
      if (!selectedEvent || !selectedEvent._id) {
        console.error('Selected event or its ID is undefined',);
        return;
      }
      const confirmDelete = await new Promise((resolve, reject) => {
        Alert.alert(
          'Confirmation',
          'Êtes-vous sûr de vouloir supprimer cette tâche?',
          [
            { text: 'Annuler', onPress: () => resolve(false), style: 'cancel' },
            { text: 'Supprimer', onPress: () => resolve(true) },
          ],
          { cancelable: true }
        );
      });

      if (confirmDelete) {
        const response = await axios.post(`/task/deleteTask`, { taskId: selectedEvent._id });
        if (response.status === 200) {
          setEvents(events.filter(event => event._id !== selectedEvent._id));
          closeModal();
        } else {
          console.error('Failed to delete task. Server responded with:', response.status);
          // Handle error condition (show alert, log, etc.)
        }
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      // Handle error (display message to user, log, etc.)
    }
  };



  return (
    <SafeAreaView style={styles.safeArea}>

      <HomeHeader navigation={navigation} title={'Tâches'} />

      <Card style={styles.card}>
        <Card.Content>
          <Calendar
            events={events}
            height={600}
            onPressEvent={(event) => openModal(event)}
            onPressCell={(date) => {
              if (!isPastDateTime(date)) {
                openModal();
              }
            }}

          />
        </Card.Content>
      </Card>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => openModal()}
      >
        <FontAwesome5 name="plus" size={20} color="white" />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide" statusBarTranslucent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>

              <Text style={styles.modalTitle}>
                {selectedEvent ? 'Modifier/Supprimer la tâche' : 'Nouvelle tâche'}
              </Text>


              {selectedEvent && (
                <View style={styles.inline}>
                  <Text style={styles.label}>Terminée</Text>
                  <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={completed ? "#f4f3f4" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={(itemValue) => setCompleted(itemValue)}
                    value={completed}
                  />
                </View>
              )}

              <Text style={styles.label}>Priorité</Text>
              <View style={styles.inputContainer}>
                <Picker
                  selectedValue={priority}
                  onValueChange={(itemValue) => setPriority(itemValue)}
                  style={styles.input}
                >
                  <Picker.Item label="Sélectionner..." value="" enabled={false} />
                  {taskpriority.map((item) => (
                    <Picker.Item
                      key={item}
                      label={item}
                      value={item}
                      style={{ color: getPriorityColor(item) }}
                    />
                  ))}
                </Picker>
              </View>

              <Text style={styles.label}>Titre</Text>
              <TextInput
                placeholder="Titre"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
              />

              <Text style={styles.label}>Description</Text>
              <TextInput
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                style={styles.input}
              />

              <Text style={styles.label}>Date début</Text>
              <TouchableOpacity onPress={() => showDatePicker(true)}>
                <Text style={styles.input}>{`Date et heure de début: ${start.toLocaleString()}`}</Text>
              </TouchableOpacity>

              <Text style={styles.label}>Date fin</Text>
              <TouchableOpacity onPress={() => showDatePicker(false)}>
                <Text style={styles.input}>{`Date et heure de fin: ${end.toLocaleString()}`}</Text>
              </TouchableOpacity>


              <TouchableOpacity
                style={[styles.buttonContainer, { backgroundColor: '#FEE502' }]}
                onPress={selectedEvent ? editTask : createTask}
              >
                <Ionicons name="save-outline" size={20} color="#977700" />
                <Text style={[styles.buttonContainerText]}>Enregistrer</Text>
              </TouchableOpacity>

              {selectedEvent && (
                <TouchableOpacity
                  style={[styles.buttonContainer, { backgroundColor: '#f01e2c' }]}
                  onPress={deleteTask}
                >
                  <Ionicons name="trash-outline" size={20} color="#fff" />
                  <Text style={[styles.buttonContainerText, { color: '#fff' }]}>Supprimer</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>Annuler</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={() => setDatePickerVisibility(false)}
        minimumDate={new Date()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FBF5E0'
  },
  card: {
    margin: 16,
    
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 50,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FEE502',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '80%',  
  },
  scrollViewContent: {
    paddingVertical: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: '#977700',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#342D21',
    justifyContent: 'center',
    textAlign: 'center',
    alignSelf: 'center'

  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: 'white',
    marginLeft: 5,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
    marginVertical: 4,
    borderRadius: 8,
  },
  buttonContainerText: {
    textAlign: 'center',

    fontSize: 16,
    marginLeft: 10,
  },
  closeButton: {
    backgroundColor: '#E0E0E0',
    width: '100%',
    paddingVertical: 10,
    marginVertical: 4,
    borderRadius: 8,
  },
  closeButtonText: {
    textAlign: 'center',
    color: '#373737',
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 15,
    borderBottomWidth: 1,
    backgroundColor: '#FBF5E0',
    borderBottomColor: '#CCCCCC',
    width: '100%', // Ensure full width
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#333333',
  },
  inline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
export default TaskScreen;

