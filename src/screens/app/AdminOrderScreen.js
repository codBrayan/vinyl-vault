import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  StyleSheet, Text, View, FlatList, 
  TouchableOpacity, ActivityIndicator, Alert, ScrollView 
} from 'react-native';
import { ThemeContext } from '../../context/ThemeContext.js';
import { orderService } from '../../services/orderService.js';
import { Ionicons } from '@expo/vector-icons';

export default function AdminOrderScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const [selectedStatus, setSelectedStatus] = useState('Todos');
  const statusOptions = ['Todos', 'Pendente', 'Entregue', 'Cancelado'];

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchOrders();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getAllOrders();
      setPedidos(data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível buscar os pedidos.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = (pedido) => {
    if (pedido.status !== 'Pendente') return;

    Alert.alert(
      'Atualizar Status',
      `Marcar o pedido #${pedido.id} como Entregue?`,
      [
        { text: 'Voltar', style: 'cancel' },
        { 
          text: 'Confirmar Entrega', 
          onPress: async () => {
            setUpdatingId(pedido.id);
            try {
              await orderService.updateOrderStatus(pedido.id, 'Entregue');
              setPedidos(prev => prev.map(p => p.id === pedido.id ? { ...p, status: 'Entregue' } : p));
            } catch (error) {
              Alert.alert('Erro', 'Falha ao atualizar status no servidor.');
            } finally {
              setUpdatingId(null);
            }
          }
        }
      ]
    );
  };

  const filteredOrders = pedidos.filter(pedido => 
    selectedStatus === 'Todos' || pedido.status === selectedStatus
  );

  const renderPedido = ({ item }) => (
    <View style={styles.cardPedido}>
      <View style={styles.headerPedido}>
        <Text style={styles.textoData}>Pedido #{item.id} • {item.data}</Text>
        
        <View style={[
          styles.badge, 
          item.status === 'Pendente' ? styles.badgePendente : 
          item.status === 'Cancelado' ? styles.badgeCancelado : 
          styles.badgeEntregue
        ]}>
          <Text style={styles.statusTexto}>{item.status}</Text>
        </View>
      </View>
      
      <View style={styles.clienteContainer}>
        <Ionicons name="person-circle-outline" size={18} color={theme.textSecondary} />
        <View style={styles.clienteDados}>
          <Text style={styles.textoCliente}>{item.cliente}</Text>
          <Text style={styles.textoEmail}>{item.emailCliente}</Text>
        </View>
      </View>

      <Text style={styles.textoItens} numberOfLines={3}>{item.itens}</Text>
      
      <View style={styles.footerPedido}>
        <Text style={styles.textoTotal}>Total: R$ {item.total.toFixed(2).replace('.', ',')}</Text>
        
        {item.status === 'Pendente' && (
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
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
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
                style={[styles.statusBadge, isSelected && styles.statusBadgeSelected]}
                onPress={() => setSelectedStatus(status)}
              >
                <Text style={[styles.statusText, isSelected && styles.statusTextSelected]}>
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
          keyExtractor={item => item.id}
          renderItem={renderPedido}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Ionicons name="documents-outline" size={64} color={theme.border} />
              <Text style={styles.vazioTexto}>Nenhum pedido encontrado para este status.</Text>
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
    backgroundColor: theme.background },

  fixedHeaderContainer: { 
    paddingHorizontal: 20, 
    paddingTop: 10, 
    backgroundColor: theme.background, 
    zIndex: 10 },
  topBar: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 16 },
  backButton: { 
    padding: 4 },
  headerTitle: { color: theme.text, 
    fontSize: 20, 
    fontWeight: 'bold' },

  statusScroll: { 
    paddingBottom: 16, gap: 12 },
  statusBadge: { 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 20, 
    backgroundColor: theme.surface, 
    borderWidth: 1, 
    borderColor: theme.border },
  statusBadgeSelected: { 
    backgroundColor: theme.primary, 
    borderColor: theme.primary },
  statusText: { color: theme.textSecondary, 
    fontSize: 13, fontWeight: '600' },
  statusTextSelected: { color: '#FFFFFF' },

  listContent: { 
    padding: 20, 
    paddingBottom: 40 },
  centerContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 80 },
  vazioTexto: { color: theme.textSecondary, 
    fontSize: 15, 
    marginTop: 16, 
    fontWeight: '500', 
    textAlign: 'center', 
    paddingHorizontal: 40 },

  cardPedido: { 
    backgroundColor: theme.surface, 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 16, 
    borderWidth: 1, 
    borderColor: theme.border },
  headerPedido: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 12 },
  textoData: { 
    color: theme.text, 
    fontSize: 14, 
    fontWeight: 'bold' },

  badge: { 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 12 },
  badgePendente: { 
    backgroundColor: '#C6734B' },
  badgeEntregue: { 
    backgroundColor: '#2ecc71' },
  badgeCancelado: { 
    backgroundColor: '#FF3B30' },
  statusTexto: { 
    color: '#FFFFFF', 
    fontSize: 11, 
    fontWeight: 'bold' },

  clienteContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 12, 
    backgroundColor: theme.type === 'dark' ? '#1E1A17' : '#F9EFEA', 
    padding: 8, 
    borderRadius: 8 },
  clienteDados: { 
    marginLeft: 8 },
  textoCliente: { 
    color: theme.text, 
    fontSize: 13, 
    fontWeight: '600' },
  textoEmail: { 
    color: theme.textSecondary, 
    fontSize: 11, 
    marginTop: 2 },
  

  textoItens: { 
    color: theme.textSecondary, 
    fontSize: 13, lineHeight: 20, 
    marginBottom: 12 },
  footerPedido: { 
    borderTopWidth: 1, 
    borderTopColor: theme.border, 
    paddingTop: 14, flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' },
  textoTotal: { 
    color: theme.primary, 
    fontSize: 16, fontWeight: 'bold' },
  

  actionButton: { 
    backgroundColor: '#3498db', 
    paddingHorizontal: 14, paddingVertical: 8, 
    borderRadius: 8, alignItems: 'center', 
    justifyContent: 'center', 
    minWidth: 120 },
  actionButtonText: { 
    color: '#FFFFFF', 
    fontSize: 12, 
    fontWeight: 'bold' }
});