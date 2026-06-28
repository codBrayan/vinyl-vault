import React, { useState, useEffect, useContext } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { ThemeContext } from "../../context/ThemeContext.js";
import { CartContext } from "../../context/CartContext.js";
import { AuthContext } from "../../context/AuthContext.js";
import { favoritesService } from "../../services/favoritesServices.js";
import { Ionicons } from "@expo/vector-icons";
import { CATEGORIES_LABELS } from "../../consts/CategoriesLabels.js";

export default function ProductScreen({ route, navigation }) {
  const item = route?.params?.item || null;

  console.log("item", item);

  const { theme } = useContext(ThemeContext);
  const { addToCart } = useContext(CartContext);
  const { usuario, isAdmin } = useContext(AuthContext);

  const userId = usuario?.id;

  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFav, setLoadingFav] = useState(true);

  const insets = useSafeAreaInsets();
  const styles = createStyles(theme);

  useEffect(() => {
    if (item && userId && !isAdmin) {
      checkFavoriteStatus();
    } else {
      setLoadingFav(false);
    }
  }, [item, userId]);

  const checkFavoriteStatus = async () => {
    setLoadingFav(true);
    const status = await favoritesService.checkIsFavorite(userId, item.id);
    setIsFavorite(status);
    setLoadingFav(false);
  };

  const toggleFavorite = async () => {
    if (!userId) return;

    const novoStatus = !isFavorite;
    setIsFavorite(novoStatus);

    try {
      if (novoStatus) {
        await favoritesService.addFavorite(userId, item);
      } else {
        await favoritesService.removeFavorite(userId, item.id);
      }
    } catch (error) {
      setIsFavorite(!novoStatus);
      Alert.alert("Erro", "Não foi possível atualizar os favoritos.");
    }
  };

  function sumQuantity() {
    setQuantity(quantity + 1);
  }
  function subtractQuantity() {
    if (quantity > 1) setQuantity(quantity - 1);
  }

  if (!item) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={{ color: theme.text }}>Produto não encontrado.</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginTop: 20 }}
        >
          <Text style={{ color: theme.primary }}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <TouchableOpacity
        style={styles.closeButtonContainer}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="close" size={28} color={theme.text} />
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: item.imageURL || "https://via.placeholder.com/320" }}
            style={styles.imagem}
          />
        </View>

        <Text style={styles.categoryItem}>
          {(CATEGORIES_LABELS[item.category] || "Sem categoria").toUpperCase()}
        </Text>

        <Text style={styles.title}>{item.titulo || item.nome}</Text>
        <Text style={styles.artist}>
          {item.artist ? item.artist.toUpperCase() : "ARTISTA DESCONHECIDO"}
        </Text>

        {item.description && (
          <Text style={styles.description}>
            {item.description || "Sem descrição disponível para este álbum."}
          </Text>
        )}

        <View style={styles.separator} />

        <View style={styles.priceRowContainer}>
          <Text style={styles.price}>
            R$ {(item.convertedPrice || 0).toFixed(2).replace(".", ",")}
          </Text>

          {!isAdmin && (
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                onPress={subtractQuantity}
                style={styles.quantityBtn}
              >
                <Ionicons name="remove" size={20} color={theme.text} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                onPress={sumQuantity}
                style={styles.quantityBtn}
              >
                <Ionicons name="add" size={20} color={theme.text} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {!isAdmin && (
        <View style={styles.footerButtonsContainer}>
          <TouchableOpacity
            style={styles.favButton}
            onPress={toggleFavorite}
            disabled={loadingFav}
          >
            {loadingFav ? (
              <ActivityIndicator size="small" color={theme.text} />
            ) : (
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={24}
                color={isFavorite ? theme.primary : theme.text}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonAddCart}
            onPress={() => addToCart(item, quantity)}
          >
            <Ionicons
              name="bag-handle-outline"
              size={20}
              color="#FFFFFF"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.buttonAddCartText}>Adicionar ao Carrinho</Text>
          </TouchableOpacity>
        </View>
      )}

      {isAdmin && (
        <TouchableOpacity
          style={styles.adminFloatingButton}
          onPress={() =>
            navigation.navigate("EditProduct", { produtoParaEditar: item })
          }
        >
          <Ionicons name="pencil" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    closeButtonContainer: {
      alignSelf: "flex-end",
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    scrollContent: {
      paddingHorizontal: 24,
      paddingBottom: 40,
    },
    imageWrapper: {
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#3498db",
      overflow: "hidden",
      backgroundColor: "#000",
      marginBottom: 24,
    },
    imagem: {
      height: 320,
      width: "100%",
      resizeMode: "cover",
      opacity: 0.9,
    },
    categoryItem: {
      fontSize: 12,
      fontWeight: "bold",
      color: theme.primary,
      letterSpacing: 1.5,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.text,
      marginTop: 6,
      marginBottom: 2,
    },
    artist: {
      fontSize: 12,
      color: theme.textSecondary,
      fontWeight: "bold",
      letterSpacing: 1,
    },
    description: {
      fontSize: 15,
      color: theme.textSecondary,
      lineHeight: 24,
      marginTop: 20,
    },
    separator: {
      height: 1,
      backgroundColor: theme.border,
      marginVertical: 24,
      opacity: 0.3,
    },
    priceRowContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    price: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.primary,
    },
    quantityContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    quantityBtn: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    quantityText: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.text,
      paddingHorizontal: 8,
    },
    footerButtonsContainer: {
      flexDirection: "row",
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 24,
      borderTopWidth: 1,
      borderTopColor: theme.surface,
      backgroundColor: theme.background,
    },
    favButton: {
      width: 56,
      height: 56,
      borderRadius: 12,
      backgroundColor: theme.surface,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    buttonAddCart: {
      flex: 1,
      height: 56,
      backgroundColor: theme.primary,
      borderRadius: 12,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    buttonAddCartText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "bold",
    },
    adminFloatingButton: {
      position: "absolute",
      bottom: 40,
      right: 24,
      backgroundColor: "#3498db",
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 6,
    },
  });
