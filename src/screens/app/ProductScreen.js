import React, { useState, useContext } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  StyleSheet, 
  Text, 
  Image, 
  TouchableOpacity, 
  View,
  ScrollView
} from 'react-native';
import { ThemeContext } from '../../context/ThemeContext.js';
import { CartContext } from '../../context/CartContext.js';
import { Ionicons } from '@expo/vector-icons';

export default function ProductScreen({ route, navigation }) {
  const { item } = route.params;
  const { theme } = useContext(ThemeContext);
  const { addToCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);
  const insets = useSafeAreaInsets();

  const styles = createStyles(theme);

  function sumQuantity() {
    setQuantity(quantity + 1);
  }

  function subtractQuantity() {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <TouchableOpacity 
        style={styles.closeButtonContainer} 
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="close" size={26} color={theme.text} />
      </TouchableOpacity>

       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <Image source={{ uri: item.imagem || item.image || item.cover }} style={styles.imagem} />
        
        <Text style={styles.categoryItem}>{(item.categoria || item.category).toUpperCase()}</Text>
        <Text style={styles.title}>{item.titulo || item.name || item.title}</Text>
        <Text style={styles.artist}>{(item.artista || item.artist).toUpperCase()}</Text>
        
        <Text style={styles.description}>{item.descricao || item.description}</Text>
        
        <View style={styles.separator} />

        <View style={styles.priceRowContainer}>
          <Text style={styles.price}>
            R${(item.preco || item.price).toFixed(2).replace('.', ',')}
          </Text>
          
          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={subtractQuantity} style={styles.quantityBtn}>
              <Ionicons name="remove" size={20} color={theme.text} />
            </TouchableOpacity>

            <Text style={styles.quantityText}>{quantity}</Text>

            <TouchableOpacity onPress={sumQuantity} style={styles.quantityBtn}>
              <Ionicons name="add" size={20} color={theme.text} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.separator} />
      </ScrollView>

      <View style={styles.footerButtonsContainer}>
        <TouchableOpacity 
          style={styles.favButton} 
          onPress={() => console.log("Adicionar aos favoritos")}
        >
          <Ionicons name="heart-outline" size={22} color={theme.text} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.buttonAddCart} 
          onPress={() => addToCart(item, quantity)}
        >
          <Ionicons name="bag-handle-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.buttonAddCartText}>Adicionar ao Carrinho</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  closeButtonContainer: {
    alignSelf: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  imagem: {
    height: 320,
    width: '100%',
    borderRadius: 12,
    backgroundColor: theme.surface,
  },
  categoryItem: {
    fontSize: 12,
    fontWeight: 'bold',
    color: theme.primary,
    marginTop: 24,
    letterSpacing: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold', 
    color: theme.text,
    marginTop: 6,
  },
  artist: {
    fontSize: 13,
    color: theme.textSecondary,
    fontWeight: '600',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 14,
    color: theme.textSecondary,
    lineHeight: 22,
    marginTop: 18,
  },
  separator: {
    height: 1,
    backgroundColor: theme.border,
    marginVertical: 20,
    opacity: 0.5,
  },
  priceRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 26,
    fontWeight: 'bold',
    color: theme.primary,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.type === 'dark' ? '#1A1613' : '#F5E6DF',
    borderRadius: 20,
    padding: 4,
  },
  quantityBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.text,
    paddingHorizontal: 12,
  },
  footerButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
    alignItems: 'center',
  },
  favButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.type === 'dark' ? '#1A1613' : '#FFFFFF',
    borderWidth: theme.type === 'light' ? 1 : 0,
    borderColor: theme.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  buttonAddCart: {
    flex: 1,
    height: 50,
    backgroundColor: theme.primary,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonAddCartText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});