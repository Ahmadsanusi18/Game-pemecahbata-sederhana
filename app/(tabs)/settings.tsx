/**
 * ============================================
 * WATERMARK DEVELOPER
 * ============================================
 * Nama        : Ahmad Sanusi
 * GitHub      : github/Ahmadsanusi18
 * Email       : ahmadsanusiii18@gmail.com
 * ============================================
 * * FILE: app/(tabs)/settings.tsx
 * DESKRIPSI: Halaman pengaturan game
 * UPDATE: Desain Modern, Fix Import Alert, dan Ganti Ikon Visual
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    Alert, // <-- PERBAIKAN: Alert diimpor
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons'; 

// ============================================
// KONSTANTA & TIPE DATA
// ============================================
const SETTINGS_KEY = '@pemecah_bata:settings';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

interface GameSettings {
    difficulty: DifficultyLevel;
    ballSpeed: number;
}

// Konfigurasi Warna
const BG_DARK = '#1a1a2e';
const CARD_BASE = '#2a2a3e';
const ACCENT_COLOR = '#4ecdc4'; // Cyan
const DANGER_COLOR = '#ff4d4d'; // Merah/Neon

// ============================================
// KONFIGURASI TINGKAT KESULITAN DENGAN IKON MATERIAL
// ============================================
const DIFFICULTY_CONFIGS: Record<DifficultyLevel, { label: string; speed: number; description: string; icon: keyof typeof MaterialIcons.glyphMap; color: string }> = {
    // Tingkat kesulitan mudah
    easy: {
        label: 'Mudah',
        speed: 4,
        description: 'Bola bergerak lebih lambat, cocok untuk pemula dan bersantai. Sulit dikalahkan.',
        icon: 'sentiment-satisfied-alt', // Wajah Senang
        color: ACCENT_COLOR, // Cyan
    },
    // Tingkat kesulitan sedang
    medium: {
        label: 'Sedang',
        speed: 6,
        description: 'Kecepatan bola standar, seimbang antara tantangan dan relaksasi. Permainan reguler.',
        icon: 'balance', // Timbangan/Keseimbangan
        color: '#ffc107', // Kuning/Gold
    },
    // Tingkat kesulitan sulit
    hard: {
        label: 'Sulit',
        speed: 8,
        description: 'Bola bergerak cepat, membutuhkan refleks tinggi. Cocok untuk pemain berpengalaman.',
        icon: 'flash-on', // Petir/Cepat
        color: DANGER_COLOR, // Merah/Neon
    },
};

export default function SettingsScreen() {
    const insets = useSafeAreaInsets();
    const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('medium');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const settingsData = await AsyncStorage.getItem(SETTINGS_KEY);
            if (settingsData) {
                const settings: GameSettings = JSON.parse(settingsData);
                setSelectedDifficulty(settings.difficulty);
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveSettings = async (difficulty: DifficultyLevel) => {
        try {
            const settings: GameSettings = {
                difficulty,
                ballSpeed: DIFFICULTY_CONFIGS[difficulty].speed,
            };
            await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
            setSelectedDifficulty(difficulty);
            
            // Tampilkan notifikasi kecil menggunakan Alert yang sudah diimpor
            Alert.alert('Pengaturan Tersimpan', `Tingkat kesulitan diatur ke ${DIFFICULTY_CONFIGS[difficulty].label}.`);

        } catch (error: any) {
            console.error('Error saving settings:', error);
            // Alert juga diperbaiki di sini
            Alert.alert('Gagal', error.message || 'Gagal menyimpan pengaturan. Silakan coba lagi.');
        }
    };

    const handleDifficultyChange = (difficulty: DifficultyLevel) => {
        saveSettings(difficulty);
    };

    if (loading) {
        return (
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <StatusBar style="light" />
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={ACCENT_COLOR} />
                    <Text style={styles.loadingText}>Memuat pengaturan...</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar style="light" />
            
            {/* HEADER SECTION */}
            <View style={styles.header}>
                <MaterialIcons name="settings" size={28} color={ACCENT_COLOR} />
                <Text style={styles.title}>Pengaturan Game</Text>
            </View>

            {/* SCROLLABLE CONTENT */}
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                
                {/* SECTION: TINGKAT KESULITAN */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Pilih Kecepatan Bola</Text>
                    <Text style={styles.sectionDescription}>
                        Pengaturan ini menentukan kecepatan bola di awal setiap permainan.
                    </Text>

                    {/* RENDER OPSI TINGKAT KESULITAN */}
                    {Object.entries(DIFFICULTY_CONFIGS).map(([key, config]) => {
                        const difficulty = key as DifficultyLevel;
                        const isSelected = selectedDifficulty === difficulty;

                        return (
                            <TouchableOpacity
                                key={key}
                                style={[
                                    styles.difficultyCard,
                                    isSelected && styles.difficultyCardSelected,
                                    // Warna shadow/border sesuai kesulitan
                                    isSelected && { borderColor: config.color, shadowColor: config.color } 
                                ]}
                                onPress={() => handleDifficultyChange(difficulty)}
                            >
                                <View style={styles.difficultyHeader}>
                                    
                                    {/* ICON MATERIAL */}
                                    <MaterialIcons 
                                        name={config.icon} 
                                        size={30} 
                                        color={isSelected ? config.color : '#ccc'} 
                                        style={styles.icon}
                                    />
                                    
                                    <View style={styles.difficultyInfo}>
                                        <Text style={[styles.difficultyLabel, { color: isSelected ? config.color : '#fff' }]}>
                                            {config.label}
                                        </Text>
                                        <Text style={styles.difficultyDescriptionCard}>
                                            {config.description}
                                        </Text>
                                    </View>
                                    
                                    {/* SPEED BADGE */}
                                    <View style={[styles.speedBadge, { backgroundColor: config.color }]}>
                                        <Text style={styles.speedText}>
                                            Speed {config.speed}
                                        </Text>
                                    </View>

                                    {/* Checkmark */}
                                    {isSelected && (
                                        <MaterialIcons name="check-circle" size={24} color={config.color} style={styles.checkmarkIcon} />
                                    )}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* SECTION: INFORMASI */}
                <View style={[styles.section, styles.infoContainer]}>
                    <Text style={styles.infoTitle}>💡 Penting!</Text>
                    <View style={styles.infoRow}>
                        <MaterialIcons name="done-all" size={16} color={ACCENT_COLOR} style={styles.infoBullet} />
                        <Text style={styles.infoText}>Pengaturan akan diterapkan pada permainan berikutnya.</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <MaterialIcons name="history" size={16} color={ACCENT_COLOR} style={styles.infoBullet} />
                        <Text style={styles.infoText}>Anda dapat mengubah pengaturan ini kapan saja di menu ini.</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    // ============================================
    // STYLE UMUM
    // ============================================
    container: {
        flex: 1,
        backgroundColor: BG_DARK,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    section: {
        marginBottom: 30,
    },
    // LOADING STATE
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#fff',
        fontSize: 16,
        marginTop: 10,
    },

    // ============================================
    // HEADER
    // ============================================
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 10,
    },

    // ============================================
    // SECTION TITLE & DESCRIPTION
    // ============================================
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 5,
    },
    sectionDescription: {
        fontSize: 14,
        color: '#999',
        marginBottom: 20,
    },

    // ============================================
    // DIFFICULTY CARD
    // ============================================
    difficultyCard: {
        backgroundColor: CARD_BASE,
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        borderWidth: 2,
        borderColor: 'transparent',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    difficultyCardSelected: {
        backgroundColor: '#3a3a4e', // Lebih terang untuk yang dipilih
        borderWidth: 2,
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 8,
    },
    difficultyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    icon: {
        marginRight: 15,
        width: 30, // Tetapkan lebar agar sejajar
        textAlign: 'center',
    },
    difficultyInfo: {
        flex: 1,
        marginRight: 10,
    },
    difficultyLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 3,
    },
    difficultyDescriptionCard: {
        fontSize: 12,
        color: '#ccc',
        marginTop: 5,
    },
    
    // SPEED BADGE
    speedBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 80,
    },
    speedText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: BG_DARK, // Teks gelap pada badge warna terang
    },
    checkmarkIcon: {
        marginLeft: 10,
    },

    // ============================================
    // INFORMASI SECTION
    // ============================================
    infoContainer: {
        backgroundColor: CARD_BASE,
        borderRadius: 12,
        padding: 20,
        borderLeftWidth: 5,
        borderLeftColor: ACCENT_COLOR,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: ACCENT_COLOR,
        marginBottom: 10,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 5,
    },
    infoBullet: {
        marginRight: 10,
        marginTop: 2,
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        color: '#ccc',
        lineHeight: 20,
    },
});