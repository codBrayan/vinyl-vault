import { AuthContext } from '../../context/AuthContext.js';
import { ThemeContext } from '../../context/ThemeContext.js';
import {
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  ActivityIndicator, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from 'react-native';
import { useState, useContext } from 'react';

export default function RegisterScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [nome, setNome] = useState('');

    const { register, loading, erro} = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);  

    const handleRegister = async () => {
        if (!email || !senha || !nome) {
            Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
            return;
        } 
        const sucesso = await register(nome, email, senha);
        
        if (!sucesso && erro) {
            Alert.alert('Erro de Cadastro', erro);
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
                      <Image 
                        source={require('../../../assets/vinilLogo.png')}
                        style={styles.logoIcon}>
                      </Image>
                    </View>
                    <Text style={styles.logoText}>Vinyl Vault</Text>
                  </View>
                    <View style={styles.formContainer}>
                        <Text style={styles.label}>Nome</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Digite seu nome"
                            placeholderTextColor={theme.textSecondary}
                            value={nome}
                            onChangeText={setNome}
                        />

                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Digite seu email"
                            placeholderTextColor={theme.textSecondary}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                        />

                        <Text style={styles.label}>Senha</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Digite sua senha"
                            placeholderTextColor={theme.textSecondary}
                            value={senha}
                            onChangeText={setSenha}
                            secureTextEntry
                        />

                        <TouchableOpacity 
                            style={styles.button} 
                            onPress={handleRegister}  
                        >
                            <Text style={styles.buttonText}>Cadastrar</Text>
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
    backgroundColor: theme.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  vinilPlaceholder: {
    width: 150,
    height: 150,
    borderRadius:100,
    backgroundColor: theme.primary, 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoIcon:{
    height: '150%',
    width: '150%',
  },
  logoText: {
    fontSize: 34,
    fontWeight: 'bold',
    color: theme.primary, 
    letterSpacing: 1,
  },
  formContainer: {
    width: '100%',
    backgroundColor: theme.type === 'dark' ? '#1A1613' : '#FFFFFF',
    padding: 24,
    borderRadius: 12,
    // Efeito de elevação do container de inputs
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: theme.type === 'light' ? 0.05 : 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 8,
    marginTop: 14,
  },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: theme.type === 'dark' ? '#231D19' : '#F9EFEA',
    borderRadius: 8,
    paddingHorizontal: 16,
    color: theme.text,
    fontSize: 15,
    borderWidth: 1,
    borderColor: theme.type === 'dark' ? '#2C2521' : '#EBE0DA',
  },
  button: {
    width: '100%',
    height: 48,
    backgroundColor: theme.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Opcional: Estilo para um botão/link de "Voltar para o Login"
  linkButton: {
    alignItems: 'center',
    marginTop: 20,
  },
  linkButtonText: {
    color: theme.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  }
});