import React, { useState, useEffect, useContext } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  StyleSheet, 
  Text, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  View 
} from 'react-native';
import { productService } from '../../services/productService.js'; 
import { ThemeContext } from '../../context/ThemeContext.js';
import { CartContext } from '../../context/CartContext.js';
import { AuthContext } from '../../context/AuthContext.js';

export default function HomeScreen() {
  const { usuario } = useContext(AuthContext);
  const nameUser = usuario ? usuario.nome : 'Usuário';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Vinil', 'K7', 'CD'];

  const { theme } = useContext(ThemeContext);
  const { addToCart } = useContext(CartContext);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await productService.getAll();
        setProducts(data);
      } catch (error) {
        console.error("Error loading vinyls:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const styles = createStyles(theme);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }


  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(item => (item.category || item.categoria) === selectedCategory);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => addToCart(item)} activeOpacity={0.8}>
      <Image source={{ uri: item.image || item.imagem || item.cover }} style={styles.cover} />
      <View style={styles.infoContainer}>
        <Text style={styles.artist} numberOfLines={1}>{item.artist || item.artista}</Text>
        <Text style={styles.title} numberOfLines={1}>{item.name || item.nome || item.title}</Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.price}>R${(item.price || item.preco).toFixed(2).replace('.', ',')}</Text>
          <View style={styles.miniButton}>
            <Text style={styles.miniButtonText}>+</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <View style={styles.header}>
        <Text style={styles.brandTitle}>🔸 Vinyl Vault</Text>
        <Text style={styles.headerName}>Olá, {nameUser}!</Text>
        <Text style={styles.headerSubtitle}>Descubra sons em formato físico</Text>
        <Text style={styles.headerTagline}>Vinis, fitas K7 e CDs para colecionadores</Text>
      </View>

      <View style={styles.categoriesContainer}>
        {categories.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <TouchableOpacity 
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={[styles.pill, isActive && styles.pillActive]}
              activeOpacity={0.7}
            >
              <Text style={isActive ? styles.pillTextActive : styles.pillText}>
                {category === 'All' ? 'Todos' : category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.sectionTitleContainer}>
        <Text style={styles.sectionTitle}>
          {selectedCategory === 'All' ? 'Todos os Produtos' : `Categoria: ${selectedCategory}`}
        </Text>
        <Text style={styles.sectionCount}>{filteredProducts.length} itens</Text>
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  brandTitle: {
    color: theme.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.text,
    marginTop: 4,
  },
  headerSubtitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: theme.text,
  },
  headerTagline: {
    fontSize: 13,
    color: theme.textSecondary,
    marginTop: 6,
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 24,
  },
  pill: {
    backgroundColor: theme.type === 'dark' ? '#231D19' : '#EBE0DA',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  pillActive: {
    backgroundColor: theme.primary, // 👈 Mudou de '#C6734B'
  },
  pillTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  pillText: {
    color: theme.textSecondary,
    fontSize: 13,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    color: theme.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionCount: {
    color: theme.textSecondary,
    fontSize: 13,
  },
  listContainer: {
    paddingHorizontal: 12,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  card: {
    width: '48%',
    marginBottom: 20,
    backgroundColor: theme.surface, // 👈 Mudou de '#1A1613'
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: theme.type === 'light' ? 1 : 0,
    borderColor: theme.border,
  },
  cover: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: 10,
  },
  artist: {
    color: theme.textSecondary,
    fontSize: 10,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  title: {
    color: theme.text,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  price: {
    color: theme.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  miniButton: {
    backgroundColor: theme.type === 'dark' ? '#2C2521' : '#EBE0DA',
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniButtonText: {
    color: theme.type === 'dark' ? '#FFFFFF' : theme.text,
    fontSize: 12,
    fontWeight: 'bold',
  },
});