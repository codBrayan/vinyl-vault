import React, { useState, useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform 
} from 'react-native';
import { ThemeContext } from '../../context/ThemeContext.js';
import { productService } from '../../services/productService.js';
import { Ionicons } from '@expo/vector-icons';

export default function CreateProductScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  const [form, setForm] = useState({
    titulo: '',
    artista: '',
    preco: '',
    categoria: 'Vinil',
    descricao: ''
  });
  const [salvando, setSalvando] = useState(false);

  const handleSalvar = async () => {
    if (!form.titulo || !form.artista || !form.preco) {
      Alert.alert('Atenção', 'Por favor, preencha os campos obrigatórios.');
      return;
    }

    setSalvando(true);
    try {
      await productService.create(form);
      Alert.alert('Sucesso', 'Novo produto cadastrado com sucesso!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível cadastrar o produto.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} disabled={salvando}>
            <Ionicons name="chevron-back" size={28} color={theme.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Novo Produto</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionLabel}>Identidade do Disco</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>TÍTULO DO ÁLBUM *</Text>
            <TextInput 
              style={styles.input} 
              value={form.titulo} 
              onChangeText={(t) => setForm({...form, titulo: t})} 
              placeholder="Ex: Abbey Road"
              placeholderTextColor={theme.textSecondary}
              editable={!salvando}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>ARTISTA / BANDA *</Text>
            <TextInput 
              style={styles.input} 
              value={form.artista} 
              onChangeText={(t) => setForm({...form, artista: t})} 
              placeholder="Ex: The Beatles"
              placeholderTextColor={theme.textSecondary}
              editable={!salvando}
            />
          </View>

          <Text style={styles.sectionLabel}>Especificações</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>PREÇO (R$) *</Text>
            <TextInput 
              style={styles.input} 
              value={form.preco} 
              onChangeText={(t) => setForm({...form, preco: t})} 
              keyboardType="numeric" 
              placeholder="Ex: 189.90"
              placeholderTextColor={theme.textSecondary}
              editable={!salvando}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>CATEGORIA</Text>
            <TextInput 
              style={styles.input} 
              value={form.categoria} 
              onChangeText={(t) => setForm({...form, categoria: t})} 
              placeholder="Ex: Vinil, CD, K7"
              placeholderTextColor={theme.textSecondary}
              editable={!salvando}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>DESCRIÇÃO DO PRODUTO</Text>
            <TextInput 
              style={[styles.input, styles.textArea]} 
              value={form.descricao} 
              onChangeText={(t) => setForm({...form, descricao: t})} 
              placeholder="Detalhes sobre a edição, encarte, estado de conservação..."
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={4}
              editable={!salvando}
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSalvar} disabled={salvando}>
            {salvando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>CADASTRAR NO ACERVO</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.background 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    paddingVertical: 12 
  },
  backButton: { 
    padding: 4 
  },
  headerTitle: { 
    color: theme.text, 
    fontSize: 20, 
    fontWeight: 'bold', 
    letterSpacing: 0.5 
  },
  form: { 
    padding: 24, 
    paddingBottom: 48 
  },
  sectionLabel: { 
    color: theme.primary, 
    fontSize: 12, 
    fontWeight: 'bold', 
    letterSpacing: 1.5, 
    marginBottom: 16, 
    marginTop: 8, 
    textTransform: 'uppercase' 
  },
  inputGroup: { 
    marginBottom: 20 
  },
  fieldLabel: { 
    color: theme.textSecondary, 
    fontSize: 10, 
    fontWeight: 'bold', 
    marginBottom: 8, 
    letterSpacing: 1 
  },
  input: { 
    backgroundColor: theme.surface, 
    color: theme.text, 
    padding: 16, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: theme.border, 
    fontSize: 16 
  },
  textArea: { 
    height: 100, 
    textAlignVertical: 'top' 
  },
  saveButton: { 
    backgroundColor: theme.primary, 
    padding: 18, 
    borderRadius: 14, 
    alignItems: 'center', 
    marginTop: 16, 
    height: 56, 
    justifyContent: 'center', 
    shadowColor: theme.primary, 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 6, 
    elevation: 4 
  },
  saveButtonText: { 
    color: '#FFFFFF', 
    fontSize: 14, 
    fontWeight: 'bold', 
    letterSpacing: 1 
  }
});