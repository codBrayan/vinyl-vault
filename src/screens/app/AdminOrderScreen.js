import React, { useState, useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { ThemeContext } from "../../context/ThemeContext.js";
import { orderService } from "../../services/orderService.js";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../context/AuthContext.js";

export default function AdminOrderScreen({ navigation }) {
  const { usuario, isAdmin } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const [selectedStatus, setSelectedStatus] = useState("Todos");
  const statusOptions = ["Todos", "Pendente", "Entregue"];

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchOrders();
    });
    return unsubscribe;
  }, [navigation]);

  const getHeaders = () => ({
    userId: usuario?.id,
    userEmail: usuario?.email,
    userType: isAdmin ? 0 : 1,
  });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getAllOrders("BRL", 0, 100, getHeaders());
      setPedidos(data?.content || []);
    } catch (error) {
      console.error("Error loading orders: ", error);
      Alert.alert("Erro", "Não foi possível buscar os pedidos.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = (pedido) => {
    if (pedido.finalized) return;

    Alert.alert(
      "Atualizar Status",
      `Marcar o pedido #${pedido.id} como Entregue?`,
      [
        { text: "Voltar", style: "cancel" },
        {
          text: "Confirmar Entrega",
          onPress: async () => {
            setUpdatingId(pedido.id);
            try {
              await orderService.finalizeOrder(pedido.id, getHeaders());
              setPedidos((prev) =>
                prev.map((p) =>
                  p.id === pedido.id ? { ...p, finalized: true } : p,
                ),
              );
            } catch (error) {
              Alert.alert("Erro", "Falha ao finalizar o pedido.");
            } finally {
              setUpdatingId(null);
            }
          },
        },
      ],
    );
  };

  const filteredOrders = pedidos.filter((pedido) => {
    if (selectedStatus === "Todos") return true;
    if (selectedStatus === "Entregue") return pedido.finalized === true;
    if (selectedStatus === "Pendente") return pedido.finalized === false;
    return true;
  });

  const renderPedido = ({ item }) => (
    <View style={styles.cardPedido}>
      <View style={styles.headerPedido}>
        <Text style={styles.textoData}>
          Pedido #{item.id} • {item.orderDate}
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

      {item.items?.map((p) => (
        <Text key={p.id} style={styles.textoItens} numberOfLines={2}>
          📦 {p.quantity}x {p.product?.title}
        </Text>
      ))}

      <View style={styles.footerPedido}>
        <Text style={styles.textoTotal}>
          Total: R$ {item.totalConvertedPrice?.toFixed(2).replace(".", ",")}
        </Text>

        {!item.finalized && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleUpdateStatus(item)}
            disabled={updatingId === item.id}
          >
            {updatingId === item.id ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.actionButtonText}>Marcar Entregue</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.fixedHeaderContainer}>
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Gestão de Pedidos</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statusScroll}
        >
          {statusOptions.map((status) => {
            const isSelected = selectedStatus === status;
            return (
              <TouchableOpacity
                key={status}
                style={[
                  styles.statusBadge,
                  isSelected && styles.statusBadgeSelected,
                ]}
                onPress={() => setSelectedStatus(status)}
              >
                <Text
                  style={[
                    styles.statusText,
                    isSelected && styles.statusTextSelected,
                  ]}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          renderItem={renderPedido}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Ionicons
                name="documents-outline"
                size={64}
                color={theme.border}
              />
              <Text style={styles.vazioTexto}>
                Nenhum pedido encontrado para este status.
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

    fixedHeaderContainer: {
      paddingHorizontal: 20,
      paddingTop: 10,
      backgroundColor: theme.background,
      zIndex: 10,
    },
    topBar: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    backButton: {
      padding: 4,
    },
    headerTitle: { color: theme.text, fontSize: 20, fontWeight: "bold" },

    statusScroll: {
      paddingBottom: 16,
      gap: 12,
    },
    statusBadge: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
    },
    statusBadgeSelected: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    statusText: { color: theme.textSecondary, fontSize: 13, fontWeight: "600" },
    statusTextSelected: { color: "#FFFFFF" },

    listContent: {
      padding: 20,
      paddingBottom: 40,
    },
    centerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 80,
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
      borderWidth: 1,
      borderColor: theme.border,
    },
    headerPedido: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
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
    badgeCancelado: {
      backgroundColor: "#FF3B30",
    },
    statusTexto: {
      color: "#FFFFFF",
      fontSize: 11,
      fontWeight: "bold",
    },

    clienteContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
      backgroundColor: theme.type === "dark" ? "#1E1A17" : "#F9EFEA",
      padding: 8,
      borderRadius: 8,
    },
    clienteDados: {
      marginLeft: 8,
    },
    textoCliente: {
      color: theme.text,
      fontSize: 13,
      fontWeight: "600",
    },
    textoEmail: {
      color: theme.textSecondary,
      fontSize: 11,
      marginTop: 2,
    },

    textoItens: {
      color: theme.textSecondary,
      fontSize: 13,
      lineHeight: 20,
      marginBottom: 12,
    },
    footerPedido: {
      borderTopWidth: 1,
      borderTopColor: theme.border,
      paddingTop: 14,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    textoTotal: {
      color: theme.primary,
      fontSize: 16,
      fontWeight: "bold",
    },

    actionButton: {
      backgroundColor: "#3498db",
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      minWidth: 120,
    },
    actionButtonText: {
      color: "#FFFFFF",
      fontSize: 12,
      fontWeight: "bold",
    },
  });
