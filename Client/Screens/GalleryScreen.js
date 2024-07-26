import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, StyleSheet, View, TouchableOpacity, Alert, LogBox, ScrollView, Image, Modal } from 'react-native';
import HomeHeader from '../Components/HomeHeader';
import { FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { Video } from 'expo-av';

export default function GalleryScreen({ navigation }) {
  const [selectedTab, setSelectedTab] = useState('pictures');
  const [media, setMedia] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);

  useEffect(() => {
    LogBox.ignoreLogs(['Firestore (10.12.4): WebChannelConnection RPC \'Write\' stream', 'transport errored']);
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const listRef = ref(storage, 'files/');
      const response = await listAll(listRef);

      const fetchedMedia = await Promise.all(
        response.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          const type = itemRef.name.split('.').pop() === 'jpg' || itemRef.name.split('.').pop() === 'jpeg' || itemRef.name.split('.').pop() === 'png' ? 'image' : 'video';
          return { url, type };
        })
      );

      setMedia(fetchedMedia);
    } catch (error) {
      console.error('Error fetching media:', error);
      Alert.alert('Error', 'Failed to fetch media.');
    }
  };

  const uploadFile = async (file, type) => {
    const fileRef = ref(storage, `files/${Date.now()}_${file.uri.split('/').pop()}`);

    try {
      const response = await fetch(file.uri);
      const blob = await response.blob();

      await uploadBytes(fileRef, blob);
      console.log('File uploaded successfully.');

      const url = await getDownloadURL(fileRef);
      console.log('Download URL obtained:', url);

      Alert.alert('Success', 'File uploaded successfully.');
      fetchMedia();
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Failed to upload file.');
    }
  };

  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled && result.assets) {
      console.log('Selected image:', result.assets[0]);
      uploadFile(result.assets[0], 'image');
    }
  };

  const handleVideoPicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Videos });
    if (!result.canceled && result.assets) {
      console.log('Selected video:', result.assets[0]);
      uploadFile(result.assets[0], 'video');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HomeHeader navigation={navigation} title={'Galerie'} />
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'pictures' && styles.selectedTab]}
          onPress={() => {
            setSelectedTab('pictures');
            handleImagePicker();
          }}
        >
          <FontAwesome5 name="image" size={24} color="black" />
          <Text>Photos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'videos' && styles.selectedTab]}
          onPress={() => {
            setSelectedTab('videos');
            handleVideoPicker();
          }}
        >
          <FontAwesome5 name="video" size={24} color="black" />
          <Text>Vidéos</Text>
        </TouchableOpacity>
      </View>
       <ScrollView
        contentContainerStyle={styles.mediaContainer} // Use contentContainerStyle here
        showsVerticalScrollIndicator={false} // Optional: Hide vertical scroll indicator
      >
        {media.length > 0 ? (
          media.map((item, index) => (
            <View key={index} style={styles.mediaItem}>
              {item.type === 'image' ? (
                <Image source={{ uri: item.url }} style={styles.image} />
              ) : (
                <TouchableOpacity onPress={() => {
                  setSelectedVideoUrl(item.url);
                  setModalVisible(true);
                }}>
                  <Video
                    source={{ uri: item.url }}
                    style={styles.video}
                    useNativeControls
                    resizeMode="contain"
                    isLooping
                  />
                </TouchableOpacity>
              )}
            </View>
          ))
        ) : (
          <Text>No media available.</Text>
        )}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={false}
        visible={isModalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setSelectedVideoUrl(null);
        }}
      >
        <View style={styles.modalContainer}>
          <Video
            source={{ uri: selectedVideoUrl }}
            style={styles.fullscreenVideo}
            useNativeControls
            resizeMode="contain"
            isLooping
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FBF5E0',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  tab: {
    alignItems: 'center',
    padding: 10,
  },
  selectedTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FEE502',
 
  },
 
  mediaContainer: {
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  mediaItem: {
    width: '48%', // Adjust this to control the number of items per row
    margin: '1%', // Margin between items
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  video: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenVideo: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
  },
});
