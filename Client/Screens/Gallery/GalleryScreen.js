import React, { useState, useEffect } from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  LogBox,
  ScrollView,
  Image,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';
import HomeHeader from '../../Components/HomeHeader';
import { FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../../firebase';
import { ref, uploadBytesResumable, getDownloadURL, listAll, deleteObject } from 'firebase/storage';
import { Video } from 'expo-av';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function GalleryScreen({ navigation }) {
  const [selectedBottomTab, setSelectedBottomTab] = useState('pictures');
  const [media, setMedia] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
  const [isVideoLoading, setVideoLoading] = useState(false);
  const [isImageZoomVisible, setImageZoomVisible] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [isUploadModalVisible, setUploadModalVisible] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    LogBox.ignoreLogs(['Firestore (10.12.4): WebChannelConnection RPC \'Write\' stream', 'transport errored']);
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    setIsLoading(true);
    try {
      const currentUserId = await AsyncStorage.getItem('currentUser');
      const listRef = ref(storage, `files/${currentUserId}/`);
      const response = await listAll(listRef);

      const fetchedMedia = await Promise.all(
        response.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          const type = itemRef.name.split('.').pop() === 'jpg' || itemRef.name.split('.').pop() === 'jpeg' || itemRef.name.split('.').pop() === 'png' ? 'image' : 'video';
          return { url, type, ref: itemRef };
        })
      );

      setMedia(fetchedMedia);
    } catch (error) {
      console.error('Error fetching media:', error);
      Alert.alert('خطأ', 'فشل في جلب الملف.');

    } finally {
      setIsLoading(false);
    }
  };

  const uploadFile = async (file, type) => {
    const currentUserId = await AsyncStorage.getItem('currentUser');
    const fileRef = ref(storage, `files/${currentUserId}/${Date.now()}_${file.fileName || file.uri.split('/').pop()}`);


    try {
      const response = await fetch(file.uri);
      const blob = await response.blob();

      const uploadTask = uploadBytesResumable(fileRef, blob);

      setUploadModalVisible(true);
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          console.error('Upload error:', error);
          Alert.alert('خطأ', 'فشل في تحميل الملف.');
          setUploadModalVisible(false);
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          console.log('Download URL obtained:', url);

          Alert.alert('نجاح', 'تم تحميل الملف بنجاح.');
          fetchMedia();
          setUploadModalVisible(false);
        }
      );
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('خطأ', 'فشل في تحميل الملف.');
      setUploadModalVisible(false);
    }
  };

  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("تحتاج إلى إذن للوصول إلى المعرض!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });
    if (!result.canceled && result.assets) {
      if (selectedBottomTab !== 'pictures') {
        Alert.alert('خطأ', 'يمكنك إضافة الفيديوهات فقط في هذا القسم.');

        return;
      }
      uploadFile(result.assets[0], 'image');
    }
  };

  const handleVideoPicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('تحتاج إلى إذن للوصول إلى مكتبة الفيديوهات!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      if (selectedBottomTab !== 'videos') {
        Alert.alert('خطأ', 'يمكنك إضافة الصور فقط في هذا القسم.');
        return;
      }
      uploadFile(result.assets[0], 'video');
    }
  };

  const deleteMedia = async (mediaRef) => {
    try {
      await deleteObject(mediaRef);
      Alert.alert('نجاح', 'تم حذف الملف بنجاح.');
      fetchMedia();
    } catch (error) {
      console.error('Delete error:', error);
      Alert.alert('خطأ', 'فشل في حذف الملف.');
    }
  };

  const confirmDelete = (mediaRef) => {
    Alert.alert(
      'تأكيد الحذف',
      'هل أنت متأكد أنك تريد حذف هذا الملف؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'حذف', onPress: () => deleteMedia(mediaRef) },
      ],
      { cancelable: true }
    );
  };


  const renderTopTabs = () => {
    return (
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setSelectedBottomTab('pictures')}
        >
          <FontAwesome5 name="images" size={24} color={selectedBottomTab === 'pictures' ? '#FEE502' : 'black'} />
          <Text style={{ color: selectedBottomTab === 'pictures' ? '#FEE502' : 'black' }}>الصور</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setSelectedBottomTab('videos')}
        >
          <FontAwesome5 name="film" size={24} color={selectedBottomTab === 'videos' ? '#FEE502' : 'black'} />
          <Text style={{ color: selectedBottomTab === 'videos' ? '#FEE502' : 'black' }}>الفيديوهات</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderMedia = () => {
    const filteredMedia = media.filter(item =>
      (selectedBottomTab === 'pictures' && item.type === 'image') ||
      (selectedBottomTab === 'videos' && item.type === 'video')
    );

    return (
      <ScrollView
        contentContainerStyle={styles.mediaContainer}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.loader}>
            <LottieView
              source={require('../../assets/lottie/loading.json')}
              autoPlay
              loop
              style={{ width: 100, height: 100 }}
            />
          </View>
        ) :
          filteredMedia.length > 0 ? (
            filteredMedia.map((item, index) => (
              <View key={index} style={styles.mediaItem}>
                {item.type === 'image' ? (
                  <TouchableOpacity onPress={() => {
                    setSelectedImageUrl(item.url);
                    setImageZoomVisible(true);
                  }}>
                    <Image source={{ uri: item.url }} style={styles.image} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => {
                    setSelectedVideoUrl(item.url);

                  }}>
                    <Video
                      source={{ uri: item.url }}
                      style={styles.video}
                      useNativeControls
                      resizeMode="contain"
                      isLooping
                      onLoadStart={() => setVideoLoading(true)}
                      onLoad={() => setVideoLoading(false)}
                      onError={() => {
                        setVideoLoading(false);
                        Alert.alert('خطأ', 'فشل في تشغيل الفيديو.');
                      }}
                    />
                    {isVideoLoading && (
                      <View style={styles.loadingOverlay}>
                        <LottieView
                          source={require('../../assets/lottie/loading.json')}
                          autoPlay
                          loop
                          style={{ width: 100, height: 100 }}
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.deleteIcon}
                  onPress={() => confirmDelete(item.ref)}
                >
                  <FontAwesome5 name="trash" size={20} color="red" />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text>لا توجد ملفات في هذا القسم.</Text>
          )}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HomeHeader navigation={navigation} title={'معرض الصور'} />
      {renderTopTabs()}
      {selectedBottomTab === 'pictures' || selectedBottomTab === 'videos' ? renderMedia() : null}

      <View style={styles.bottomTabContainer}>
        <TouchableOpacity style={styles.bottomTab} onPress={() => handleImagePicker()}>
          <FontAwesome5 name="camera" size={24} color="black" />
          <Text>تحميل صورة</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomTab} onPress={() => handleVideoPicker()}>
          <FontAwesome5 name="video" size={24} color="black" />
          <Text>تحميل فيديو</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for Video */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setSelectedVideoUrl(null);
        }}
      >
        <View style={styles.modalContainer}>

          <View style={styles.modalContent}>

            <Video
              source={{ uri: selectedVideoUrl }}
              useNativeControls
              resizeMode="contain"
              isLooping
              onLoadStart={() => setVideoLoading(true)}
              onLoad={() => setVideoLoading(false)}
              onError={() => {
                setVideoLoading(false);
                Alert.alert('خطأ', 'فشل في تشغيل الفيديو.');
              }}
            />
            {isVideoLoading && (
              <View style={styles.loadingOverlay}>
                <LottieView
                  source={require('../../assets/lottie/loading.json')}
                  autoPlay
                  loop
                  style={{ width: 100, height: 100 }}
                />
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Image Zoom Modal */}
      <Modal
        animationType="slide"
        statusBarTranslucent={true}
        transparent={true}
        visible={isImageZoomVisible}
        onRequestClose={() => {
          setImageZoomVisible(false);
          setSelectedImageUrl(null);
        }}
      >
        <TouchableWithoutFeedback onPress={() => {
          setImageZoomVisible(false);
          setSelectedImageUrl(null);
        }}>
          <View style={styles.modalBackground}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: selectedImageUrl }}
                style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>


      <Modal
        animationType="slide"
        statusBarTranslucent={true}
        transparent={true}
        visible={isUploadModalVisible}
        onRequestClose={() => setUploadModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.uploadModal}>
            <LottieView
              source={require('../../assets/lottie/loading.json')}
              autoPlay
              loop
              style={{ width: 100, height: 100 }}
            />
            <Text style={styles.uploadProgressText}>{`تحميل: ${Math.round(uploadProgress)}%`}</Text>
          </View>
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
    margin: 10,
    borderRadius: 16,
    backgroundColor: 'white',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tab: {
    alignItems: 'center',
  },
  mediaContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  mediaItem: {
    marginBottom: 20,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  video: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  deleteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 50,
    padding: 5,
  },
  bottomTabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  bottomTab: {
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  uploadModal: {
    width: 200,
    height: 200,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  fullscreenVideo: {
    width: '100%',
    height: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 10,
  },

  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeButtonText: {
    color: 'black',
    fontSize: 16,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
