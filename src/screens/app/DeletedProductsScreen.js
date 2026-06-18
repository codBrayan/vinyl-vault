import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  StyleSheet, Text, View, FlatList, Image, 
  TouchableOpacity, ActivityIndicator, Alert 
} from 'react-native';
import { ThemeContext } from '../../context/ThemeContext.js';
import { productService } from '../../services/productService.js';
import { Ionicons } from '@expo/vector-icons';

export default function DeletedProductsScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  const [produtosDeletados, setProdutosDeletados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restaurandoId, setRestaurandoId] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchDeletedProducts();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchDeletedProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getDeleted();
      setProdutosDeletados(data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar a lixeira.");
    } finally {
      setLoading(false);
    }
  };

  const handleRestaurar = (produto) => {
    Alert.alert(
      'Restaurar Produto',
      `O álbum ${produto.titulo || produto.nome} voltará para o catálogo principal. Confirmar?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Restaurar', 
          onPress: async () => {
            setRestaurandoId(produto.id);
            try {
              await productService.restore(produto.id);
              setProdutosDeletados(prev => prev.filter(p => p.id !== produto.id));
              Alert.alert('Restaurado', 'Produto de volta ao acervo com sucesso!');
            } catch (error) {
              Alert.alert('Erro', 'Falha ao restaurar o produto.');
            } finally {
              setRestaurandoId(null);
            }
          }
        }
      ]
    );
  };

  const renderDeletado = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imagem || 'https://via.placeholder.com/320' }} style={styles.capa} />
      
      <View style={styles.infoContainer}>
        <Text style={styles.titulo} numberOfLines={1}>{item.titulo || item.nome}</Text>
        <Text style={styles.artista}>{item.artista ? item.artista.toUpperCase() : 'DESCONHECIDO'}</Text>
        <Text style={styles.preco}>R$ {(item.preco || 0).toFixed(2).replace('.', ',')}</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.restoreButton}
        onPress={() => handleRestaurar(item)}
        disabled={restaurandoId === item.id}
      >
        {restaurandoId === item.id ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Ionicons name="refresh-outline" size={24} color="#FFFFFF" />
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Produtos Deletados</Text>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <FlatList
          data={produtosDeletados}
          keyExtractor={item => item.id.toString()}
          renderItem={renderDeletado}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Ionicons name="trash-bin-outline" size={64} color={theme.border} />
              <Text style={styles.vazioTexto}>A lixeira está vazia.</Text>
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
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingTop: 10, 
    paddingBottom: 20 
  },
  headerTitle: { 
    color: theme.text, 
    fontSize: 22, 
    fontWeight: 'bold' 
  },
  backButton: { 
    marginRight: 16 
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
  vazioTexto: { 
    color: theme.textSecondary, 
    fontSize: 16, 
    marginTop: 16, 
    fontWeight: '500' 
  },
  
  card: { 
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
    width: 70, 
    height: 70, 
    borderRadius: 8, 
    backgroundColor: '#000', 
    opacity: 0.6 
  },
  infoContainer: { 
    flex: 1, 
    marginLeft: 16, 
    justifyContent: 'center' 
  },
  
  titulo: { 
    color: theme.text, 
    fontSize: 15, 
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
    color: theme.textSecondary, 
    fontSize: 14, 
    fontWeight: 'bold', 
    marginTop: 8 
  },
  
  restoreButton: { 
    padding: 12, 
    backgroundColor: theme.primary, 
    borderRadius: 8, 
    marginLeft: 10 
  }
});