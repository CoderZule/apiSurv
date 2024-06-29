import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Modal, TextInput, Button, StyleSheet, LogBox, SafeAreaView, Alert } from 'react-native';
import { Calendar } from 'react-native-big-calendar';
import { FontAwesome5 } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import HomeHeader from '../../Components/HomeHeader';
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const TasksScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isStartPicker, setIsStartPicker] = useState(true);
  const baseURL = 'http://192.168.1.17:3000/api/task';
  const [errorTitle, setErrorTitle] = useState('');
  const [errorDescription, setErrorDescription] = useState('');
  const [errorDates, setErrorDates] = useState('');

  useEffect(() => {
    LogBox.ignoreLogs([
      'Warning: Unknown: Support for defaultProps will be removed from memo components in a future major release. Use JavaScript default parameters instead.',

    ]);
  }, []);


  const validateInputs = () => {
    let isValid = true;

    if (!title) {
      setErrorTitle('Le titre est requis');
      isValid = false;
    } else {
      setErrorTitle('');
    }

    if (!description) {
      setErrorDescription('La description est requise');
      isValid = false;
    } else {
      setErrorDescription('');
    }
    return isValid;
  };

  const isPastDateTime = (date) => {
    const now = new Date();
    return date < now;
  };

  const openModal = (event = null) => {
    if (event) {
      setSelectedEvent(event);
      setTitle(event.title);
      setDescription(event.description);
      setStart(new Date(event.start));
      setEnd(new Date(event.end));
    } else {
      setSelectedEvent(null);
      setTitle('');
      setDescription('');
      setStart(new Date());
      setEnd(new Date());

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
    try {
      const response = await axios.get(`${baseURL}/getAllTasks`);
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


  // Call fetchTasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const createTask = async () => {
    try {

      if (!validateInputs()) {
        return;
      } else {
        // Ensure start and end are Date objects
        const startDate = new Date(start);
        const endDate = new Date(end);


        const response = await axios.post(`${baseURL}/create`, {
          title,
          description,
          start: startDate.toISOString(), // Convert to ISO string
          end: endDate.toISOString(), // Convert to ISO string
        });


        const newTask = {
          _id: response.data.data._id,
          title: response.data.data.title,
          description: response.data.data.description,
          start: new Date(response.data.data.start), // Ensure start is a Date object
          end: new Date(response.data.data.end),     // Ensure end is a Date object
        };

        setEvents([...events, newTask]); // Update events state with new task
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

      if (!validateInputs()) {
        return;
      } else {
        const editedTaskData = {
          _id: selectedEvent._id,
          title,
          description,
          start,
          end,
        };

        const response = await axios.post(`${baseURL}/editTask`, editedTaskData);
        if (response.status === 200) {
          const updatedTask = {
            ...selectedEvent,
            title,
            description,
            start,
            end,
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
        const response = await axios.post(`${baseURL}/deleteTask`, { taskId: selectedEvent._id });
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
            <Text style={styles.modalTitle}>
              {selectedEvent ? 'Modifier/Supprimer la tâche' : 'Nouvelle tâche'}
            </Text>
            <TextInput
              placeholder="Titre"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
            />
            {errorTitle ? <Text style={styles.errorText}>{errorTitle}</Text> : null}
            <TextInput
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              style={styles.input}
            />
            {errorDescription ? <Text style={styles.errorText}>{errorDescription}</Text> : null}
            <TouchableOpacity onPress={() => showDatePicker(true)}>
              <Text style={styles.input}>{`Date et heure de début: ${start.toLocaleString()}`}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => showDatePicker(false)}>
              <Text style={styles.input}>{`Date et heure de fin: ${end.toLocaleString()}`}</Text>
            </TouchableOpacity>
            {errorDates ? <Text style={styles.errorText}>{errorDates}</Text> : null}
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
    backgroundColor: '#FBF5E0',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#5188C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    margin: 20,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    borderRadius: 5,
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
  errorText: {
    color: 'red',
    marginBottom: 10,
  }

});

export default TasksScreen;

