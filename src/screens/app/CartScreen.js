import React, { useState, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  View,
  ActivityIndicator,
} from "react-native";
import { CartContext } from "../../context/CartContext.js";
import { ThemeContext } from "../../context/ThemeContext.js";
import { AuthContext } from "../../context/AuthContext.js";
import { orderService } from "../../services/orderService.js";

export default function CartScreen({ navigation }) {
  const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } =
    useContext(CartContext);
  const { theme } = useContext(ThemeContext);
  const { usuario } = useContext(AuthContext);

  const [isProcessing, setIsProcessing] = useState(false);

  const handleFinalizarCompra = async () => {
    if (!usuario) {
      Alert.alert("Erro", "Você precisa estar logado para comprar.");
      return;
    }

    setIsProcessing(true);
    try {
      await orderService.createOrder(cart);

      clearCart();
      Alert.alert(
        "Sucesso!",
        "Seu pedido foi confirmado. Acompanhe o status na aba de Pedidos.",
        [
          {
            text: "Ver Pedidos",
            onPress: () => navigation.navigate("UserOrders"),
          },
        ],
      );
    } catch (error) {
      console.error("[Cart Finalize Error]: ", error);
      Alert.alert(
        "Falha na Compra",
        error.message || "Não foi possível registrar seu pedido.",
      );
    } finally {
      setIsProcessing(false);
    }
  };
  const styles = createStyles(theme);

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image
        source={{ uri: item.imageURL || "https://via.placeholder.com/100" }}
        style={styles.capa}
      />

      <View style={styles.infoContainer}>
        <Text style={styles.titulo} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.artista} numberOfLines={1}>
          {item.artist}
        </Text>
        <Text style={styles.precoSubtotal}>
          R$ ${(item.convertedPrice * item.quantidade).toFixed(2)}
        </Text>

        <View style={styles.controlesQuantidade}>
          <TouchableOpacity
            style={styles.botaoQuantidade}
            onPress={() => updateQuantity(item.id, item.quantidade - 1)}
            disabled={isProcessing}
          >
            <Text style={styles.textoBotaoQtd}>-</Text>
          </TouchableOpacity>

          <Text style={styles.textoQuantidade}>{item.quantidade}</Text>

          <TouchableOpacity
            style={styles.botaoQuantidade}
            onPress={() => updateQuantity(item.id, item.quantidade + 1)}
            disabled={isProcessing}
          >
            <Text style={styles.textoBotaoQtd}>+</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botaoRemover}
            onPress={() => removeFromCart(item.id)}
            disabled={isProcessing}
          >
            <Text style={styles.textoBotaoRemover}>Remover</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Seu Carrinho</Text>
      </View>

      {cart.length === 0 ? (
        <View style={styles.vazioContainer}>
          <Text style={styles.vazioTexto}>Seu carrinho está vazio.</Text>
          <Text style={styles.vazioSubtexto}>
            Adicione alguns vinis na aba Home!
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValor}>
                R$ {cartTotal.toFixed(2).replace(".", ",")}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.botaoFinalizar, isProcessing && { opacity: 0.7 }]}
              onPress={handleFinalizarCompra}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.textoBotaoFinalizar}>Fechar Pedido</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
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
    header: {
      paddingHorizontal: 16,
      marginBottom: 16,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.text,
    },
    listContainer: {
      paddingHorizontal: 16,
      paddingBottom: 24,
    },
    cartItem: {
      flexDirection: "row",
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: "center",
    },
    capa: {
      width: 80,
      height: 80,
      borderRadius: 8,
      backgroundColor: "#2C2C2E",
    },
    infoContainer: {
      flex: 1,
      marginLeft: 16,
    },
    titulo: {
      color: theme.text,
      fontSize: 16,
      fontWeight: "bold",
    },
    artista: {
      color: theme.textSecondary,
      fontSize: 14,
      marginTop: 2,
    },
    precoSubtotal: {
      color: theme.primary,
      fontSize: 15,
      fontWeight: "600",
      marginTop: 6,
    },
    controlesQuantidade: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 10,
    },
    botaoQuantidade: {
      backgroundColor: theme.background,
      borderWidth: 1,
      borderColor: theme.border,
      width: 32,
      height: 32,
      borderRadius: 6,
      justifyContent: "center",
      alignItems: "center",
    },
    textoBotaoQtd: {
      color: theme.text,
      fontSize: 18,
      fontWeight: "bold",
    },
    textoQuantidade: {
      color: theme.text,
      fontSize: 16,
      paddingHorizontal: 12,
      fontWeight: "600",
    },
    botaoRemover: {
      marginLeft: "auto",
    },
    textoBotaoRemover: {
      color: "#FF3B30",
      fontSize: 14,
      fontWeight: "500",
    },
    vazioContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 32,
    },
    vazioTexto: {
      color: theme.text,
      fontSize: 18,
      fontWeight: "bold",
    },
    vazioSubtexto: {
      color: theme.textSecondary,
      fontSize: 14,
      textAlign: "center",
      marginTop: 8,
    },
    footer: {
      backgroundColor: theme.surface,
      borderTopWidth: 1,
      borderColor: theme.border,
      padding: 20,
      paddingBottom: 20,
    },
    totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    totalLabel: {
      color: theme.textSecondary,
      fontSize: 16,
      fontWeight: "600",
    },
    totalValor: {
      color: theme.text,
      fontSize: 24,
      fontWeight: "bold",
    },
    botaoFinalizar: {
      backgroundColor: theme.primary,
      paddingVertical: 16,
      borderRadius: 8,
      alignItems: "center",
    },
    textoBotaoFinalizar: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "bold",
    },
  });
