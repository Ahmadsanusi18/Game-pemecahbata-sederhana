/**
 * ============================================
 * WATERMARK DEVELOPER
 * ============================================
 * Nama        : Ahmad Sanusi
 * GitHub      : github/Ahmadsanusi18
 * Email       : ahmadsanusiii18@gmail.com
 * ============================================
 * * FILE: app/(tabs)/info.tsx
 * UPDATE: Desain Modern & Gaming Look
 */

import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// Import LinearGradient untuk latar belakang yang keren
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function InfoScreen() {
  const insets = useSafeAreaInsets();

  // Handlers
  const handleEmailPress = () => Linking.openURL('mailto:ahmadsanusiii18@gmail.com');
  const handleGithubPress = () => Linking.openURL('https://github.com/Ahmadsanusi18');
 // Contoh link tambahan

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Background Utama Gelap */}
      <View style={styles.backgroundContainer} />

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top }]}
        showsVerticalScrollIndicator={false}
      >
        
        {/* ============================================
            HERO SECTION (GAMING HEADER)
            ============================================ */}
        <View style={styles.heroContainer}>
            <LinearGradient
                colors={['#9738c6ff', '#3f1960ff', '#2f0035ff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroGradient}
            >
                <View style={styles.heroIconCircle}>
                    <MaterialIcons name="sports-esports" size={60} color="#fff" />
                </View>
                <Text style={styles.heroTitle}>Pemecah Bata</Text>
                <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>v1.0.0</Text>
                </View>
            </LinearGradient>
        </View>

        {/* ============================================
            DEVELOPER PROFILE CARD
            ============================================ */}
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>👨‍💻 Creator</Text>
            </View>
            
            <View style={styles.profileSection}>
                <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarText}>AS</Text>
                </View>
                <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>Ahmad Sanusi</Text>
                    <Text style={styles.profileRole}>Fullstack Developer</Text>
                </View>
            </View>

            {/* Social Buttons Row */}
            <View style={styles.actionButtonsContainer}>
                <TouchableOpacity style={[styles.actionButton, styles.githubButton]} onPress={handleGithubPress}>
                    <FontAwesome5 name="github" size={20} color="#fff" />
                    <Text style={styles.actionButtonText}>GitHub</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionButton, styles.emailButton]} onPress={handleEmailPress}>
                    <MaterialIcons name="email" size={20} color="#fff" />
                    <Text style={styles.actionButtonText}>Email</Text>
                </TouchableOpacity>
            </View>
        </View>

        {/* ============================================
            APP INFO & FEATURES
            ============================================ */}
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>🚀 Tentang Aplikasi</Text>
            </View>
            
            <Text style={styles.descriptionText}>
                Game breakout klasik yang didesain ulang dengan sentuhan modern menggunakan React Native. Tantang refleks Anda dan raih skor tertinggi!
            </Text>

            <View style={styles.divider} />

            {/* Feature Grid */}
            <View style={styles.featuresGrid}>
                <FeatureItem icon="leaderboard" label="Leaderboard" color="#FFD700" />
                <FeatureItem icon="speed" label="Level Kesulitan" color="#FF6B6B" />
                <FeatureItem icon="save" label="Auto Save" color="#4ECDC4" />
                <FeatureItem icon="edit" label="Kustomisasi" color="#A8E6CF" />
            </View>
        </View>

        {/* ============================================
            FOOTER
            ============================================ */}
        <View style={styles.footer}>
            <Text style={styles.footerText}>Designed & Built by</Text>
            <Text style={styles.footerHighlight}>Ahmad Sanusi © 2025</Text>
            <Text style={styles.versionText}>Build 1.0.25 (Stable)</Text>
        </View>
        
        {/* Spacing bottom untuk navigasi bottom tab */}
        <View style={{ height: 100 }} />

      </ScrollView>
    </View>
  );
}

// Komponen Kecil untuk Item Fitur agar kode lebih rapi
const FeatureItem = ({ icon, label, color }: { icon: any, label: string, color: string }) => (
    <View style={styles.featureItemContainer}>
        <View style={[styles.featureIconBox, { backgroundColor: `${color}20` }]}> 
            {/* Hex color + 20 opacity */}
            <MaterialIcons name={icon} size={24} color={color} />
        </View>
        <Text style={styles.featureLabel}>{label}</Text>
    </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // Slate 900 (Darker, more modern)
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0f172a',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  
  // HERO SECTION
  heroContainer: {
    marginBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  heroGradient: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
  },
  badgeContainer: {
    marginTop: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    color: '#a5b4fc',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // CARDS SHARED STYLE
  card: {
    backgroundColor: '#1e293b', // Slate 800
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  cardHeader: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#e2e8f0',
  },

  // PROFILE SECTION
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3b82f6', // Blue 500
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileRole: {
    fontSize: 14,
    color: '#94a3b8', // Slate 400
    marginTop: 2,
  },

  // ACTION BUTTONS
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  githubButton: {
    backgroundColor: '#24292e', // GitHub dark
  },
  emailButton: {
    backgroundColor: '#ea4335', // Google Red
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },

  // APP INFO TEXT
  descriptionText: {
    color: '#cbd5e1',
    lineHeight: 22,
    fontSize: 14,
    marginBottom: 15,
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 15,
  },
  
  // FEATURES GRID
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureItemContainer: {
    width: '48%', // 2 kolom
    backgroundColor: '#0f172a',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#334155',
  },
  featureIconBox: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureLabel: {
    color: '#e2e8f0',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },

  // FOOTER
  footer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  footerText: {
    color: '#64748b',
    fontSize: 12,
  },
  footerHighlight: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  versionText: {
    color: '#475569',
    fontSize: 10,
    marginTop: 8,
    fontStyle: 'italic',
  },
});
