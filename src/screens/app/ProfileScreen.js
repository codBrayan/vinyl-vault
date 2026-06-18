import React, { useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  Alert,
  View
} from 'react-native';
import { AuthContext } from '../../context/AuthContext.js';
import { ThemeContext } from '../../context/ThemeContext.js';

export default function ProfileScreen({ navigation }) {
  const { usuario, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isAdmin = usuario?.role === 'admin';

  const handleLogout = () => {
    Alert.alert(
      'Sair do App',
      'Tem certeza que deseja encerrar sua sessão no Vinyl Vault?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: () => logout() }
      ]
    );
  };

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minha Conta</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>
            {usuario?.nome ? usuario.nome.charAt(0).toUpperCase() : 'V'}
          </Text>
        </View>
        <Text style={styles.userName}>{usuario?.nome || 'Usuário Collector'}</Text>
        <Text style={styles.userEmail}>{usuario?.email || 'dev@vinyl.com'}</Text>
        {isAdmin && (
          <View style={styles.adminBadge}>
            <Text style={styles.adminBadgeText}>ADMINISTRADOR</Text>
          </View>
        )}
      </View>

      <View style={styles.menuContainer}>
        {isAdmin ? (
          <>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('DeletedProducts')}>
              <Text style={styles.menuItemText}>Produtos deletados</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Favorites')}>
              <Text style={styles.menuItemText}>Meus Favoritos</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('UserOrders')}>
              <Text style={styles.menuItemText}>Meus Pedidos</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity style={styles.menuItem} onPress={toggleTheme}>
          <Text style={styles.menuItemText}>Alternar Tema (Light/Dark)</Text>
          <Text style={styles.menuItemBadge}>{theme.type === 'dark' ? 'Escuro' : 'Claro'}</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair do Vinyl Vault</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.text,
  },
  profileCard: {
    backgroundColor: theme.surface,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
    marginBottom: 24,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  userName: {
    color: theme.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  userEmail: {
    color: theme.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
  adminBadge: {
    backgroundColor: '#3498db',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 10
  },
  adminBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5
  },
  menuContainer: {
    backgroundColor: theme.surface,
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  menuItemText: {
    color: theme.text,
    fontSize: 16,
    fontWeight: '500',
  },
  menuItemBadge: {
    color: theme.textSecondary,
    fontSize: 14,
    backgroundColor: theme.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  divider: {
    height: 1,
    backgroundColor: theme.border,
    marginHorizontal: 16,
  },
  logoutItem: {
    justifyContent: 'center',
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: 'bold',
  },
});