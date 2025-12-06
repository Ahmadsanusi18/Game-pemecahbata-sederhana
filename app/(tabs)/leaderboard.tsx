/**
 * ============================================
 * WATERMARK DEVELOPER
 * ============================================
 * Nama        : Ahmad Sanusi
 * GitHub      : github/Ahmadsanusi18
 * Email       : ahmadsanusiii18@gmail.com
 * ============================================
 * * FILE: app/(tabs)/leaderboard.tsx
 * DESKRIPSI: Halaman leaderboard/papan peringkat
 * UPDATE: Desain Modern Gaming Leaderboard & Fix Type Error Ikon
 */

import PlayerForm from '@/components/PlayerForm';
import { GameSession, getAllPlayers, getPlayerSessions, initDatabase, Player, updatePlayerName } from '@/utils/database';
import { useFocusEffect, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons'; // Pastikan MaterialIcons sudah diimpor

const PRIMARY_COLOR = '#ff4d4d'; // Merah Oranye Neon untuk Skor
const ACCENT_COLOR = '#4ecdc4'; // Cyan untuk highlight
const BG_DARK = '#12121e';      // Background paling gelap
const CARD_DARK = '#1e1e30';    // Background kartu

// ============================================
// FUNGSI PEMBANTU UNTUK ICON PERINGKAT
// Fix Type Error: Menggunakan nama ikon yang kompatibel dengan MaterialIcons
// ============================================
const getRankIcon = (index: number) => {
    switch (index) {
        case 0: return 'emoji-events'; // Piala (Gold)
        case 1: return 'star-border';  // Bintang Outline (Silver)
        case 2: return 'check-circle'; // Check/Verified (Bronze)
        default: return 'person';
    }
};

export default function LeaderboardScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [players, setPlayers] = useState<Player[]>([]);
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
    const [sessions, setSessions] = useState<GameSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [showChangeNameForm, setShowChangeNameForm] = useState(false);
    const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

    useEffect(() => {
        const initDb = async () => {
            try {
                await initDatabase();
                loadPlayers();
            } catch (error) {
                console.error('Error initializing database:', error);
            }
        };
        initDb();
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadPlayers();
        }, [])
    );

    const loadPlayers = async () => {
        try {
            setLoading(true);
            await initDatabase();
            const allPlayers = await getAllPlayers();
            // Sort players by highScore descending
            allPlayers.sort((a, b) => b.highScore - a.highScore);
            setPlayers(allPlayers);
        } catch (error) {
            console.error('Error loading players:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadPlayerSessions = async (player: Player) => {
        try {
            const playerSessions = await getPlayerSessions(player.id, 10);
            setSessions(playerSessions);
            setSelectedPlayer(player);
        } catch (error) {
            console.error('Error loading sessions:', error);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleChangeName = async (newName: string) => {
        if (!editingPlayer) return;

        try {
            const updatedPlayer = await updatePlayerName(editingPlayer.id, newName);

            // Update in players list
            setPlayers(prev => prev.map(p => p.id === updatedPlayer.id ? updatedPlayer : p));

            // Update selected player if it's the same
            if (selectedPlayer?.id === updatedPlayer.id) {
                setSelectedPlayer(updatedPlayer);
            }

            setShowChangeNameForm(false);
            setEditingPlayer(null);
            Alert.alert('Sukses', 'Nama berhasil diubah!');
        } catch (error: any) {
            console.error('Error changing name:', error);
            Alert.alert('Gagal', error.message || 'Gagal mengubah nama. Silakan coba lagi.');
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* HEADER DESIGN */}
            <View style={[styles.header, { paddingTop: insets.top + 15 }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <MaterialIcons name="arrow-back" size={24} color={ACCENT_COLOR} />
                </TouchableOpacity>
                <Text style={styles.title}>Papan Peringkat</Text>
            </View>

            {/* MODAL GANTI NAMA */}
            {showChangeNameForm && editingPlayer && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Ganti Nama Pemain</Text>
                        <PlayerForm
                            onSubmit={handleChangeName}
                            onCancel={() => {
                                setShowChangeNameForm(false);
                                setEditingPlayer(null);
                            }}
                            initialName={editingPlayer.name}
                        />
                    </View>
                </View>
            )}

            {/* KONTEN UTAMA */}
            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={ACCENT_COLOR} />
                    <Text style={styles.loadingText}>Memuat data...</Text>
                </View>
            ) : players.length === 0 ? (
                <View style={styles.centerContainer}>
                    <MaterialIcons name="sentiment-dissatisfied" size={50} color="#999" style={{ marginBottom: 10 }} />
                    <Text style={styles.emptyText}>Belum ada data pemain</Text>
                    <Text style={styles.emptySubtext}>Mulai bermain untuk melihat skor!</Text>
                </View>
            ) : (
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                    {/* TOP PLAYERS SECTION */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>🥇 Top 10 Pemain</Text>
                        {players.slice(0, 10).map((player, index) => (
                            <TouchableOpacity
                                key={player.id}
                                style={[
                                    styles.playerCard,
                                    // Style khusus untuk Top 3
                                    index === 0 && styles.top1Card, 
                                    index === 1 && styles.top2Card,
                                    index === 2 && styles.top3Card,
                                    // Highlight kartu yang dipilih
                                    selectedPlayer?.id === player.id && styles.selectedCard,
                                ]}
                                onPress={() => loadPlayerSessions(player)}
                            >
                                <View style={styles.rankContainer}>
                                    {/* Menggunakan fungsi getRankIcon yang sudah diperbaiki */}
                                    <MaterialIcons 
                                        name={getRankIcon(index)} 
                                        size={24} 
                                        color={index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : '#999'} 
                                    />
                                    <Text style={[styles.rankText, { color: index < 3 ? '#fff' : '#999' }]}>
                                        {index + 1}
                                    </Text>
                                </View>
                                
                                <View style={styles.playerInfo}>
                                    <Text style={styles.playerName}>{player.name}</Text>
                                    <Text style={styles.playerStats}>
                                        Lvl Terbaik: {player.bestLevel} | Total: {player.totalGames} Game
                                    </Text>
                                </View>
                                
                                <View style={styles.scoreContainer}>
                                    <Text style={styles.scoreLabel}>SKOR</Text>
                                    <Text style={styles.scoreText}>{player.highScore}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* PLAYER DETAILS SECTION */}
                    {selectedPlayer && (
                        <View style={styles.section}>
                            <View style={styles.playerHeader}>
                                <Text style={styles.sectionTitle}>
                                    📊 Riwayat {selectedPlayer.name}
                                </Text>
                                <TouchableOpacity
                                    style={styles.editButton}
                                    onPress={() => {
                                        setEditingPlayer(selectedPlayer);
                                        setShowChangeNameForm(true);
                                    }}
                                >
                                    <Text style={styles.editButtonText}>✏️ Ganti Nama</Text>
                                </TouchableOpacity>
                            </View>
                            
                            {/* STATS CARD */}
                            <View style={styles.statsCard}>
                                {renderStatRow('Skor Tertinggi', selectedPlayer.highScore, PRIMARY_COLOR)}
                                {renderStatRow('Level Terbaik', selectedPlayer.bestLevel, ACCENT_COLOR)}
                                {renderStatRow('Total Permainan', selectedPlayer.totalGames)}
                                {renderStatRow('Rata-rata Skor', selectedPlayer.totalGames > 0
                                     ? Math.round(selectedPlayer.totalScore / selectedPlayer.totalGames)
                                     : 0
                                )}
                            </View>

                            {/* SESSION HISTORY */}
                            {sessions.length > 0 && (
                                <>
                                    <Text style={styles.sectionSubtitle}>10 Permainan Terakhir</Text>
                                    {sessions.map((session) => (
                                        <View key={session.id} style={styles.sessionCard}>
                                            <View style={styles.sessionInfo}>
                                                <Text style={styles.sessionScore}>Skor: **{session.score}**</Text>
                                                <Text style={styles.sessionLevel}>Level: {session.level}</Text>
                                            </View>
                                            <Text style={styles.sessionDate}>{formatDate(session.playedAt)}</Text>
                                        </View>
                                    ))}
                                </>
                            )}
                        </View>
                    )}
                </ScrollView>
            )}
        </View>
    );
}

// Komponen Pembantu untuk Baris Statistik
const renderStatRow = (label: string, value: string | number, color: string = '#fff') => (
    <View style={styles.statRow}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BG_DARK,
    },
    // HEADER
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        backgroundColor: BG_DARK,
    },
    backButton: {
        marginRight: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 0.5,
    },
    // LOADING & EMPTY STATE
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
    emptyText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    emptySubtext: {
        color: '#999',
        fontSize: 14,
    },
    // SCROLL CONTENT
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 15,
        borderLeftWidth: 4,
        borderLeftColor: PRIMARY_COLOR,
        paddingLeft: 10,
    },
    sectionSubtitle: {
        fontSize: 16,
        fontWeight: '600',
        color: ACCENT_COLOR,
        marginTop: 20,
        marginBottom: 10,
        marginLeft: 5,
    },
    // PLAYER CARD
    playerCard: {
        flexDirection: 'row',
        backgroundColor: CARD_DARK,
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: CARD_DARK,
    },
    selectedCard: {
        backgroundColor: '#2a2a40',
        borderColor: ACCENT_COLOR, // Border highlight untuk yang dipilih
    },
    // TOP 3 SPECIAL STYLES
    top1Card: {
        backgroundColor: '#301a1a', // Darker Red for Rank 1
        borderColor: '#FFD700', // Gold border
        borderWidth: 2,
    },
    top2Card: {
        borderColor: '#C0C0C0', // Silver border
        borderWidth: 1.5,
    },
    top3Card: {
        borderColor: '#CD7F32', // Bronze border
        borderWidth: 1.5,
    },
    // RANK
    rankContainer: {
        width: 30,
        alignItems: 'center',
        marginRight: 10,
    },
    rankText: {
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 2,
    },
    // INFO
    playerInfo: {
        flex: 1,
        marginLeft: 5,
    },
    playerName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 3,
    },
    playerStats: {
        fontSize: 11,
        color: '#999',
    },
    // SCORE
    scoreContainer: {
        alignItems: 'flex-end',
        marginLeft: 10,
    },
    scoreLabel: {
        fontSize: 10,
        color: PRIMARY_COLOR,
        fontWeight: '600',
        opacity: 0.7,
    },
    scoreText: {
        fontSize: 20,
        fontWeight: '900',
        color: PRIMARY_COLOR, // Aksen warna utama untuk skor
    },
    // PLAYER DETAILS HEADER & BUTTON
    playerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    editButton: {
        backgroundColor: ACCENT_COLOR,
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20, // Lebih bulat, terlihat seperti pill
        shadowColor: ACCENT_COLOR,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.4,
        shadowRadius: 3,
        elevation: 3,
    },
    editButtonText: {
        color: BG_DARK,
        fontSize: 12,
        fontWeight: 'bold',
    },
    // STATS CARD
    statsCard: {
        backgroundColor: CARD_DARK,
        borderRadius: 12,
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#333',
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#2a2a40',
    },
    statLabel: {
        fontSize: 14,
        color: '#aaa',
    },
    statValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
    },
    // SESSION HISTORY
    sessionCard: {
        backgroundColor: '#1a1a2e', // Sedikit lebih gelap dari CARD_DARK
        borderRadius: 10,
        padding: 12,
        marginBottom: 8,
        borderLeftWidth: 4,
        borderLeftColor: ACCENT_COLOR,
    },
    sessionInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    sessionScore: {
        fontSize: 15,
        fontWeight: '700',
        color: PRIMARY_COLOR, // Score tetap highlight
    },
    sessionLevel: {
        fontSize: 13,
        color: '#ccc',
    },
    sessionDate: {
        fontSize: 11,
        color: '#666',
        textAlign: 'right',
    },
    // MODAL
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)', // Lebih gelap
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    modalContent: {
        backgroundColor: CARD_DARK,
        borderRadius: 15,
        padding: 25,
        minWidth: 300,
        maxWidth: '90%',
        borderWidth: 2,
        borderColor: ACCENT_COLOR, // Border neon
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 15,
        textAlign: 'center',
    }
});