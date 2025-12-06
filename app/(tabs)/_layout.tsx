/**
 * ============================================
 * WATERMARK DEVELOPER
 * ============================================
 * Nama        : Ahmad Sanusi
 * GitHub      : github/Ahmadsanusi18
 * Email       : ahmadsanusiii18@gmail.com
 * ============================================
 * * FILE: app/(tabs)/_layout.tsx
 * DESKRIPSI: Layout untuk tab navigation aplikasi
 * UPDATE: Desain Glassmorphism (Blur Transparan) dan Ikon MaterialIcons Baru
 */

import { Tabs } from 'expo-router';
import React from 'react';

// Import komponen-komponen yang diperlukan
// Catatan: Jika Anda tidak menggunakan IconSymbol, Anda bisa mengganti ini dengan MaterialIcons dari expo
// Untuk tujuan ini, kita akan mengimpor MaterialIcons dari expo/vector-icons
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur'; // Import BlurView untuk efek Glassmorphism
import { Platform, View, StyleSheet } from 'react-native'; // Import View dan Platform

// Import komponen HapticTab dan hook yang mungkin Anda butuhkan
import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

// Warna yang digunakan dalam skema dark mode
const DARK_MODE_BG = 'rgba(18, 18, 30, 0.8)'; // Warna gelap dengan sedikit transparansi

/**
 * Komponen IconWrapper - Menggantikan IconSymbol untuk konsistensi
 * Menggunakan MaterialIcons untuk mempermudah implementasi
 */
const IconWrapper = ({ name, color }: { name: keyof typeof MaterialIcons.glyphMap, color: string }) => (
    <MaterialIcons size={28} name={name} color={color} />
);

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const activeColor = Colors[colorScheme ?? 'light'].tint;

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: activeColor,
                headerShown: false,
                tabBarButton: HapticTab,

                // ============================================
                // GLASSMORHPISM / BLUR TRANSPARAN STYLES
                // ============================================
                tabBarStyle: {
                    position: 'absolute', // Penting untuk efek transparan
                    backgroundColor: 'transparent', // Atur warna latar belakang tab bar menjadi transparan
                    borderTopWidth: 0, // Hilangkan garis atas default
                    elevation: 0, // Hilangkan shadow/elevasi pada Android
                    paddingBottom: Platform.OS === 'ios' ? 0 : 5, // Sesuaikan padding bawah
                    paddingTop: 5,
                    height: Platform.OS === 'ios' ? 85 : 60, // Sesuaikan tinggi tab bar
                },
                
                // Tambahkan latar belakang BlurView di belakang tab bar
                tabBarBackground: () => (
                    <BlurView 
                        intensity={40} // Atur intensitas blur, semakin tinggi semakin blur
                        tint={colorScheme === 'dark' ? 'dark' : 'light'} // Sesuaikan tint blur
                        style={StyleSheet.absoluteFill}
                    >
                        {/* Overlay semi-transparan gelap di atas blur untuk tema gelap */}
                        {colorScheme === 'dark' && (
                             <View style={styles.darkOverlay} />
                        )}
                    </BlurView>
                ),
            }}>
            
            {/* ============================================
                TAB 1: GAME (HALAMAN UTAMA) - IKON BARU
                ============================================ */}
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Game',
                    // Ikon Baru: sports-esports (Joystick)
                    tabBarIcon: ({ color }) => <IconWrapper name="sports-esports" color={color} />,
                }}
            />
            
            {/* ============================================
                TAB 2: PENGATURAN (SETTINGS) - IKON BARU
                ============================================ */}
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Pengaturan',
                    // Ikon Baru: tune (Tuner/Pengaturan)
                    tabBarIcon: ({ color }) => <IconWrapper name="tune" color={color} />,
                }}
            />
            
            {/* ============================================
                TAB 3: LEADERBOARD (PAPAN PERINGKAT) - IKON BARU
                ============================================ */}
            <Tabs.Screen
                name="leaderboard"
                options={{
                    title: 'Leaderboard',
                    // Ikon Baru: emoji-events (Piala/Trofi)
                    tabBarIcon: ({ color }) => <IconWrapper name="emoji-events" color={color} />,
                }}
            />
            
            {/* ============================================
                TAB 4: INFO (INFORMASI DEVELOPER) - IKON BARU
                ============================================ */}
            <Tabs.Screen
                name="info"
                options={{
                    title: 'Info',
                    // Ikon Baru: help-center (Pusat Bantuan)
                    tabBarIcon: ({ color }) => <IconWrapper name="info" color={color} />,
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    // Style untuk overlay gelap di atas BlurView (khusus dark mode)
    darkOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: DARK_MODE_BG, // Warna latar belakang gelap semi-transparan
    },
});
