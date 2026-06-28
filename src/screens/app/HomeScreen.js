import React, { useState, useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  View,
  Alert,
  TextInput,
  ScrollView,
  RefreshControl,
} from "react-native";
import { productService } from "../../services/productService.js";
import { ThemeContext } from "../../context/ThemeContext.js";
import { CartContext } from "../../context/CartContext.js";
import { AuthContext } from "../../context/AuthContext.js";
import { Ionicons } from "@expo/vector-icons";
import { CATEGORIES_LABELS } from "../../consts/CategoriesLabels.js";

export default function HomeScreen({ navigation }) {
  const { isAdmin } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const categorias = [
    { label: "Todos", value: "all" },
    { label: CATEGORIES_LABELS["vinyl"], value: "vinyl" },
    { label: CATEGORIES_LABELS["cassete"], value: "cassete" },
    { label: CATEGORIES_LABELS["cd"], value: "cd" },
  ];

  const { theme } = useContext(ThemeContext);
  const { addToCart } = useContext(CartContext);

  const loadProducts = async () => {
    try {
      const data = await productService.getAll();
      setProducts(data?.content || []);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setLoading(true);
      loadProducts().finally(() => setLoading(false));
    });
    return unsubscribe;
  }, [navigation]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  const handleProductButton = (item) => {
    if (isAdmin) {
      navigation.navigate("EditProduct", { produtoParaEditar: item });
    } else {
      addToCart(item);
      Alert.alert("Sucesso", "Produto adicionado ao carrinho!");
    }
  };

  const filteredProducts = products.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.artist.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      item.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const styles = createStyles(theme);

  const renderProductCard = ({ item }) => {
    const preco = item.convertedPrice > 0 ? item.convertedPrice : item.price;
    const moeda = item.convertedPrice > 0 ? "R$" : "US$";

    return (
      <TouchableOpacity
        style={[styles.card, !item.isActive && styles.cardInactive]}
        onPress={() => navigation.navigate("ProductScreen", { item })}
      >
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: item.imageURL || "https://via.placeholder.com/320" }}
            style={styles.cover}
          />
          {!item.isActive && (
            <View style={styles.inactiveBadge}>
              <Text style={styles.inactiveBadgeText}>Indisponível</Text>
            </View>
          )}
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.artist}>{item.artist}</Text>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              {moeda} {preco.toFixed(2).replace(".", ",")}
            </Text>
            <TouchableOpacity
              style={[styles.actionButton, isAdmin && styles.adminActionButton]}
              onPress={() => handleProductButton(item)}
              disabled={!item.isActive && !isAdmin}
            >
              <Ionicons
                name={isAdmin ? "pencil" : "add"}
                size={16}
                color={isAdmin ? "#FFFFFF" : theme.text}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const userHeaderContent = (
    <View style={styles.scrollableHeader}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar artistas, álbuns..."
          placeholderTextColor={theme.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Ionicons
          name="search"
          size={20}
          color={theme.textSecondary}
          style={styles.searchIcon}
        />
      </View>

      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>
          <Text style={{ color: theme.primary }}>Descubra</Text> sons{"\n"}em
          formato físico
        </Text>
        <Text style={styles.heroSubtitle}>
          Vinis, fitas K7 e CDs para colecionadores
        </Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Todos os Produtos</Text>
        <Text style={styles.itemCount}>{filteredProducts.length} itens</Text>
      </View>
    </View>
  );
  const adminHeaderContent = (
    <View style={styles.scrollableHeader}>
      <View style={[styles.searchContainer, { borderColor: "#3498db" }]}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar no acervo..."
          placeholderTextColor={theme.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Ionicons
          name="search"
          size={20}
          color={theme.textSecondary}
          style={styles.searchIcon}
        />
      </View>

      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>
          Visão <Text style={{ color: "#3498db" }}>Geral</Text>
        </Text>
        <Text style={styles.heroSubtitle}>
          Gerencie o catálogo de produtos e o inventário da loja
        </Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Acervo Atual</Text>
        <Text style={styles.itemCount}>
          {filteredProducts.length} itens cadastrados
        </Text>
      </View>
    </View>
  );

  if (loading && products.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.fixedHeaderContainer}>
        <View style={styles.topBar}>
          <View style={styles.logoContainer}>
            <Ionicons
              name="disc"
              size={24}
              color={isAdmin ? "#3498db" : theme.primary}
            />
            <Text style={[styles.logoText, isAdmin && { color: "#3498db" }]}>
              {isAdmin ? "Vinyl Vault | Admin" : "Vinyl Vault"}
            </Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {categorias.map((cat) => {
            const isSelected = selectedCategory === cat.value;
            return (
              <TouchableOpacity
                key={cat.value}
                style={[
                  styles.categoryBadge,
                  isSelected &&
                    (isAdmin
                      ? styles.adminCategoryBadgeSelected
                      : styles.categoryBadgeSelected),
                ]}
                onPress={() => setSelectedCategory(cat.value)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    isSelected && styles.categoryTextSelected,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProductCard}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={isAdmin ? adminHeaderContent : userHeaderContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={isAdmin ? "#3498db" : theme.primary}
            colors={[isAdmin ? "#3498db" : theme.primary]}
          />
        }
      />

      {isAdmin && (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => navigation.navigate("CreateProduct")}
        >
          <Ionicons name="add" size={32} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    listContainer: {
      paddingBottom: 100,
    },
    fixedHeaderContainer: {
      paddingHorizontal: 20,
      paddingTop: 10,
      backgroundColor: theme.background,
    },
    scrollableHeader: {
      paddingHorizontal: 20,
      paddingTop: 16,
    },
    topBar: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },
    logoContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    logoText: {
      color: theme.primary,
      fontSize: 18,
      fontWeight: "bold",
      marginLeft: 8,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.surface,
      borderRadius: 24,
      paddingHorizontal: 16,
      height: 48,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: theme.border,
    },
    searchInput: {
      flex: 1,
      color: theme.text,
      fontSize: 15,
    },
    searchIcon: {
      marginLeft: 8,
    },
    heroSection: {
      marginBottom: 24,
    },
    heroTitle: {
      color: theme.text,
      fontSize: 32,
      fontWeight: "bold",
      lineHeight: 40,
    },
    heroSubtitle: {
      color: theme.textSecondary,
      fontSize: 14,
      marginTop: 10,
    },
    categoryScroll: {
      paddingBottom: 12,
      gap: 12,
    },
    categoryBadge: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
    },
    categoryBadgeSelected: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    adminCategoryBadgeSelected: {
      backgroundColor: "#3498db",
      borderColor: "#3498db",
    },
    categoryText: {
      color: theme.textSecondary,
      fontSize: 14,
      fontWeight: "600",
    },
    categoryTextSelected: {
      color: "#FFFFFF",
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      marginBottom: 16,
      marginTop: 8,
    },
    sectionTitle: {
      color: theme.text,
      fontSize: 18,
      fontWeight: "bold",
    },
    itemCount: {
      color: theme.textSecondary,
      fontSize: 12,
    },
    row: {
      justifyContent: "space-between",
      paddingHorizontal: 20,
    },
    card: {
      width: "47%",
      marginBottom: 20,
      backgroundColor: theme.surface,
      borderRadius: 12,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: theme.border,
    },
    imageWrapper: {
      backgroundColor: "#000",
    },
    cover: {
      width: "100%",
      height: 160,
      resizeMode: "cover",
      opacity: 0.9,
    },
    infoContainer: {
      padding: 12,
      backgroundColor: theme.type === "dark" ? "#1E1A17" : theme.surface,
    },
    artist: {
      color: theme.textSecondary,
      fontSize: 10,
      textTransform: "uppercase",
      fontWeight: "bold",
      letterSpacing: 0.5,
    },
    title: {
      color: theme.text,
      fontSize: 13,
      fontWeight: "bold",
      marginTop: 4,
      marginBottom: 8,
    },
    priceContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    price: {
      color: theme.primary,
      fontSize: 14,
      fontWeight: "bold",
    },
    actionButton: {
      backgroundColor: theme.background,
      width: 26,
      height: 26,
      borderRadius: 13,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.border,
    },
    adminActionButton: {
      backgroundColor: "#3498db",
      borderColor: "#3498db",
    },
    floatingButton: {
      position: "absolute",
      right: 20,
      bottom: 20,
      backgroundColor: "#3498db",
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
    },
  });
