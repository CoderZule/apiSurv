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
          <Text style={styles.sectionTitle}>Bienvenue dans notre application pour apiculteurs apiSUrv</Text>
          <Text style={styles.sectionText}>
            Découvrez une application complète dédiée à l'apiculture 👩‍🌾, conçue pour simplifier et optimiser la gestion de votre activité. Maximisez votre récolte de miel grâce à des outils avancés de gestion des ruches et des ruchers, tout en suivant de près la santé de vos abeilles.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionSubtitle}>Fonctionnalités clés :</Text>
          <View style={styles.feature}>
            <Text style={styles.featureText}>🐝 Gestion optimale des inspections de ruches par scan de codes QR.</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureText}>🐝 Détails sur les ruchers et les ruches pour une gestion efficace par scan de codes QR.</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureText}>🐝 Suivi des tâches quotidiennes pour une organisation optimale.</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureText}>🐝 Historique des récoltes pour une gestion complète des données.</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureText}>🐝 Gestion des produits en stock pour une gestion efficace des ressources.</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureText}>🐝 Gestion des finances pour une transparence totale.</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureText}>🐝 Consultation de statistiques détaillées pour des décisions éclairées.</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureText}>🐝 Surveillance proactive de la santé des abeilles.</Text>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FBF5E0',
  },
  container: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#977700',
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  sectionSubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#666',
  },
  feature: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
  },
  featureText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});
