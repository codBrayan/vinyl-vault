import React, { useState, useContext } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableWithoutFeedback, 
  Keyboard, 
  ScrollView, 
  Alert 
} from 'react-native';
import { AuthContext } from '../../context/AuthContext.js';
import { ThemeContext } from '../../context/ThemeContext.js';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  
  const { login, loading, erro } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }

    const sucesso = await login(email, senha);
    
    if (!sucesso && erro) {
      Alert.alert('Erro de Autenticação', erro);
    }
  };

  const styles = createStyles(theme);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <View style={styles.vinilPlaceholder}>
              <Text style={{ fontSize: 40 }}>💿</Text>
            </View>
            <Text style={styles.logoText}>Vinyl Vault</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o seu email"
              placeholderTextColor={theme.type === 'dark' ? '#8E8680' : '#A59992'}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite a sua senha"
              placeholderTextColor={theme.type === 'dark' ? '#8E8680' : '#A59992'}
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
              autoCapitalize="none"
            />

            <TouchableOpacity 
              style={styles.button} 
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Fazer Login</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.linkButton} 
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.linkButtonText}>Não tem uma conta? Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: theme.type === 'dark' ? theme.background : (theme.loginBg || '#F9EFEA'), 
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  vinilPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.primary, 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoText: {
    fontSize: 34,
    fontWeight: 'bold',
    color: theme.primary, 
    letterSpacing: 1,
  },
  formContainer: {
    backgroundColor: 'transparent',
  },
  label: {
  
    color: theme.type === 'dark' ? theme.text : (theme.loginText || '#4A3B32'),
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {

    backgroundColor: theme.type === 'dark' ? '#1A1613' : (theme.loginInput || 'transparent'), 
    color: theme.type === 'dark' ? theme.text : (theme.loginText || '#4A3B32'),
    padding: 14,
    borderRadius: 4, 
    borderWidth: 1,
    borderColor: theme.type === 'dark' ? theme.border : '#C5B5AD', 
    fontSize: 16,
  },
  button: {
    backgroundColor: theme.primary, 
    padding: 16,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 16, 
    alignSelf: 'center',
  },
  linkButtonText: {
    color: theme.primary,
    fontWeight: '500',
  }
});