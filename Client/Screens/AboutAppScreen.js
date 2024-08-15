import React from 'react';
import {
  Text, SafeAreaView, StyleSheet, ScrollView, View
} from 'react-native';
import HomeHeader from '../Components/HomeHeader';

export default function AboutAppScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <HomeHeader navigation={navigation} title={'À propos'} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bienvenue dans notre application pour apiculteurs, apiSUrv</Text>
          <Text style={styles.sectionText}>
            Découvrez une application complète dédiée à l'apiculture 🐝, conçue pour simplifier et optimiser la gestion de votre activité. Maximisez votre récolte de miel avec des outils avancés pour la gestion des ruches et des ruchers, tout en surveillant la santé de vos abeilles.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionSubtitle}>Fonctionnalités principales :</Text>
          <View style={styles.feature}>
            <Text style={styles.featureText}>📷 Inspections des ruches par scan de QR codes pour une gestion efficace.</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureText}>🏠 Détails sur les ruchers et ruches pour une vue complète.</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureText}>📝 Suivi des tâches quotidiennes pour une organisation sans faille.</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureText}>📊 Historique des récoltes pour une gestion précise des données.</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureText}>📦 Gestion des stocks pour un suivi efficace des ressources.</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureText}>💰 Gestion des finances pour une transparence totale.</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureText}>📈 Statistiques détaillées pour des décisions informées.</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureText}>🔍 Surveillance proactive de la santé des abeilles.</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureText}>📸 Galerie pour stocker et organiser des photos et vidéos de vos inspections et récoltes.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF9F0',
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
