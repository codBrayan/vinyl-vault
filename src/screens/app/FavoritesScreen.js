import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  StyleSheet, Text, View, FlatList, Image, 
  TouchableOpacity, ActivityIndicator 
} from 'react-native';
import { ThemeContext } from '../../context/ThemeContext.js';
import { AuthContext } from '../../context/AuthContext.js';
import { favoritesService } from '../../services/favoritesServices.js';
import { Ionicons } from '@expo/vector-icons';

export default function FavoritesScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const { usuario } = useContext(AuthContext);
  const styles = createStyles(theme);

  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (usuario?.id) {
        fetchFavorites();
      }
    });
    return unsubscribe;
  }, [navigation, usuario]);

  const fetchFavorites = async () => {
    setLoading(true);
    const data = await favoritesService.getFavorites(usuario.id);
    setFavoritos(data);
    setLoading(false);
  };

  const handleRemoveFavorite = async (productId) => {
    setFavoritos(prev => prev.filter(item => item.id !== productId));
    await favoritesService.removeFavorite(usuario.id, productId);
  };

  const renderFavorito = ({ item }) => (
    <TouchableOpacity 
      style={styles.cardFavorito}
      onPress={() => navigation.navigate('ProductScreen', { item })}
    >
      <Image source={{ uri: item.imagem || 'https://via.placeholder.com/320' }} style={styles.capa} />
      
      <View style={styles.infoContainer}>
        <Text style={styles.titulo} numberOfLines={1}>{item.titulo || item.nome}</Text>
        <Text style={styles.artista}>{item.artista ? item.artista.toUpperCase() : 'DESCONHECIDO'}</Text>
        <Text style={styles.preco}>R$ {(item.preco || 0).toFixed(2).replace('.', ',')}</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => handleRemoveFavorite(item.id)}
      >
        <Ionicons name="trash-outline" size={22} color="#FF3B30" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favoritos</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Ionicons name="close" size={28} color={theme.text} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <FlatList
          data={favoritos}
          keyExtractor={item => item.id.toString()}
          renderItem={renderFavorito}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Ionicons name="heart-dislike-outline" size={64} color={theme.border} />
              <Text style={styles.vazioTexto}>Sua coleção está vazia.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.background 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingTop: 16, 
    paddingBottom: 20 
  },
  headerTitle: { 
    color: theme.text, 
    fontSize: 22, 
    fontWeight: 'bold' 
  },
  closeButton: { 
    padding: 4 
  },
  listContent: { 
    paddingHorizontal: 20, 
    paddingBottom: 40 
  },
  centerContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 100 
  },
  cardFavorito: { 
    flexDirection: 'row', 
    backgroundColor: theme.surface, 
    borderRadius: 12, 
    padding: 12, 
    alignItems: 'center', 
    marginBottom: 16, 
    borderWidth: 1, 
    borderColor: theme.border 
  },
  capa: { 
    width: 80, 
    height: 80, 
    borderRadius: 8, 
    backgroundColor: '#000' 
  },
  infoContainer: { 
    flex: 1, 
    marginLeft: 16, 
    justifyContent: 'center' 
  },
  titulo: { 
    color: theme.text, 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  artista: { 
    color: theme.textSecondary, 
    fontSize: 11, 
    fontWeight: 'bold', 
    marginTop: 4, 
    letterSpacing: 0.5 
  },
  preco: { 
    color: theme.primary, 
    fontSize: 14, 
    fontWeight: 'bold', 
    marginTop: 8 
  },
  removeButton: { 
    padding: 12 
  },
  vazioTexto: { 
    color: theme.textSecondary, 
    fontSize: 16, 
    marginTop: 16, 
    fontWeight: '500' 
  }
});