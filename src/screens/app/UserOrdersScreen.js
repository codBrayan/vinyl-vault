import React, { useState, useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { ThemeContext } from "../../context/ThemeContext.js";
import { AuthContext } from "../../context/AuthContext.js";
import { orderService } from "../../services/orderService.js";
import { Ionicons } from "@expo/vector-icons";

export default function UserOrdersScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const { usuario } = useContext(AuthContext);
  const styles = createStyles(theme);

  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (usuario?.id) {
        fetchOrders();
      }
    });
    return unsubscribe;
  }, [navigation, usuario]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getUserOrders();
      setPedidos(data?.content || []);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderPedido = ({ item }) => (
    <View style={styles.cardPedido}>
      <View style={styles.headerPedido}>
        <Text style={styles.textoData}>
          Pedido #{item.id} • {item.data}
        </Text>
        <View
          style={[
            styles.badge,
            item.finalized ? styles.badgeEntregue : styles.badgePendente,
          ]}
        >
          <Text style={styles.statusTexto}>
            {item.finalized ? "Entregue" : "Pendente"}
          </Text>
        </View>
      </View>

      <View style={styles.clienteContainer}>
        <Ionicons name="person-outline" size={14} color={theme.textSecondary} />
        <Text style={styles.textoCliente}>
          {usuario.nome} ({usuario.email})
        </Text>
      </View>

      {item.items.map((p) => (
        <Text key={p.id} style={styles.textoItens} numberOfLines={2}>
          📦 {p.quantity || 0}x {p.product.title}
        </Text>
      ))}

      <View style={styles.footerPedido}>
        <Text style={styles.textoTotal}>
          Total: R$ {item.totalConvertedPrice.toFixed(2).replace(".", ",")}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meus Pedidos</Text>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <FlatList
          data={pedidos}
          keyExtractor={(item) => item.id}
          renderItem={renderPedido}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Ionicons name="receipt-outline" size={64} color={theme.border} />
              <Text style={styles.vazioTexto}>
                Você ainda não realizou nenhum pedido.
              </Text>
            </View>
          }
        />
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
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 10,
      marginBottom: 10,
    },
    backButton: {
      marginRight: 16,
    },
    headerTitle: {
      color: theme.text,
      fontSize: 22,
      fontWeight: "bold",
    },
    listContent: {
      padding: 20,
      paddingBottom: 40,
    },
    centerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 100,
    },
    vazioTexto: {
      color: theme.textSecondary,
      fontSize: 15,
      marginTop: 16,
      fontWeight: "500",
      textAlign: "center",
      paddingHorizontal: 40,
    },
    cardPedido: {
      backgroundColor: theme.surface,
      padding: 16,
      borderRadius: 12,
      marginBottom: 16,
      borderWidth: theme.type === "light" ? 1 : 0,
      borderColor: theme.border,
    },
    headerPedido: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    textoData: {
      color: theme.text,
      fontSize: 14,
      fontWeight: "bold",
    },
    badge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    badgePendente: {
      backgroundColor: "#C6734B",
    },
    badgeEntregue: {
      backgroundColor: "#2ecc71",
    },
    statusTexto: {
      color: "#FFFFFF",
      fontSize: 11,
      fontWeight: "bold",
    },
    clienteContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    textoCliente: {
      color: theme.textSecondary,
      fontSize: 12,
      marginLeft: 6,
      fontWeight: "500",
    },
    textoItens: {
      color: theme.text,
      fontSize: 13,
      lineHeight: 18,
    },
    footerPedido: {
      borderTopWidth: 1,
      borderTopColor: theme.border,
      paddingTop: 12,
      alignItems: "flex-end",
      marginTop: 12,
    },
    textoTotal: {
      color: theme.primary,
      fontSize: 15,
      fontWeight: "bold",
    },
  });
