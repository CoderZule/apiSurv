import React from 'react';
import {
  Text, SafeAreaView, StyleSheet, ScrollView, View
} from 'react-native';
import HomeHeader from '../Components/HomeHeader';

export default function AboutAppScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
       <HomeHeader navigation={navigation} title={'حول التطبيق'} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>مرحباً بكم في تطبيقنا لمربي النحل، apiSUrv</Text>
          <Text style={styles.sectionText}>
            اكتشف تطبيقاً شاملاً مخصصاً لتربية النحل 🐝، مصمماً لتبسيط وتحسين إدارة نشاطك. قم بزيادة محصول العسل الخاص بك باستخدام أدوات متقدمة لإدارة الخلايا والمزارع، بينما تراقب صحة النحل لديك.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionSubtitle}>الميزات الرئيسية:</Text>
          <View style={styles.feature}>
            <Text style={styles.featureText}>📷 فحص الخلايا من خلال مسح رموز QR لإدارة فعالة.</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureText}>🏠 تفاصيل حول المناحل والخلايا لرؤية شاملة.</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureText}>📝 متابعة المهام اليومية لتنظيم دون عوائق.</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureText}>📊 سجل الحصاد لإدارة دقيقة للبيانات.</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureText}>📦 إدارة المخزون لمتابعة فعالة للموارد.</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureText}>💰 إدارة الشؤون المالية لتحقيق الشفافية الكاملة.</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureText}>📈 إحصاءات مفصلة لاتخاذ قرارات مدروسة.</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureText}>🔍 مراقبة استباقية لصحة النحل.</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureText}>📸 معرض لتخزين وتنظيم الصور ومقاطع الفيديو للفحوصات والحصاد.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FBF5E0'
  },
  container: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#A17F1B',
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 26,
    color: '#444',
    textAlign: 'justify',
  },
  sectionSubtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#555',
  },
  feature: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEE',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});
