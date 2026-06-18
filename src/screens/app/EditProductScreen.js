import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform 
} from 'react-native';
import { ThemeContext } from '../../context/ThemeContext.js';
import { productService } from '../../services/productService.js';
import { Ionicons } from '@expo/vector-icons';

export default function EditProductScreen({ route, navigation }) {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);
  
  const produtoParaEditar = route.params?.produtoParaEditar || null;

  const [form, setForm] = useState({
    titulo: '',
    artista: '',
    preco: '',
    categoria: '',
    descricao: '',
    imagem: ''
  });
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (produtoParaEditar) {
      setForm({
        titulo: produtoParaEditar.titulo || produtoParaEditar.nome || '',
        artista: produtoParaEditar.artista || '',
        preco: produtoParaEditar.preco?.toString() || '',
        categoria: produtoParaEditar.categoria || 'Vinil',
        descricao: produtoParaEditar.descricao || '',
        imagem: produtoParaEditar.imagem || ''
      });
    }
  }, [produtoParaEditar]);

  const handleSalvarAlteracoes = async () => {
    if (!form.titulo || !form.artista || !form.preco) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setSalvando(true);
    try {
      await productService.update(produtoParaEditar.id, form);
      Alert.alert('Sucesso', 'Produto atualizado com sucesso no catálogo!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o produto.');
    } finally {
      setSalvando(false);
    }
  };

const handleDeletar = () => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja deletar permanentemente o álbum ${form.titulo}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive', 
          onPress: async () => {
            setSalvando(true);
            try {
              await productService.delete(produtoParaEditar.id);
              Alert.alert('Deletado', 'Produto removido do catálogo.');
              // Resolvendo o problema de voltar para ediçãop do produto depois de deletar (não é a melhor opção mas é gambiarra)
              navigation.reset({
                index: 0,
                routes: [{ name: 'MainTabs' }], 
              });
              
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível deletar o produto.');
            } finally {
              setSalvando(false);
            }
          }
        }
      ]
    );
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
          <Text style={styles.headerTitle}>Editar Produto</Text>
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
              editable={!salvando}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>ARTISTA / BANDA *</Text>
            <TextInput 
              style={styles.input} 
              value={form.artista} 
              onChangeText={(t) => setForm({...form, artista: t})} 
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
              editable={!salvando}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>CATEGORIA</Text>
            <TextInput 
              style={styles.input} 
              value={form.categoria} 
              onChangeText={(t) => setForm({...form, categoria: t})} 
              editable={!salvando}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>DESCRIÇÃO DO PRODUTO</Text>
            <TextInput 
              style={[styles.input, styles.textArea]} 
              value={form.descricao} 
              onChangeText={(t) => setForm({...form, descricao: t})} 
              multiline
              numberOfLines={4}
              editable={!salvando}
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSalvarAlteracoes} disabled={salvando}>
            {salvando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>SALVAR ALTERAÇÕES</Text>
            )}
          </TouchableOpacity>

          {!salvando && (
            <TouchableOpacity style={styles.deleteButton} onPress={handleDeletar}>
              <Ionicons name="trash-outline" size={18} color="#FF3B30" style={{ marginRight: 8 }} />
              <Text style={styles.deleteButtonText}>Remover do Catálogo</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: { 
    flex: 1, backgroundColor: theme.background },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    addingHorizontal: 16, 
    paddingVertical: 12 },
  backButton: { 
    padding: 4 },
  headerTitle: { 
    color: theme.text, 
    fontSize: 20, 
    fontWeight: 'bold', 
    letterSpacing: 0.5 },
  form: { 
    padding: 24, 
    paddingBottom: 48 },
  sectionLabel: { 
    color: theme.primary, 
    fontSize: 12, fontWeight: 'bold', 
    letterSpacing: 1.5, marginBottom: 16, 
    marginTop: 8, 
    textTransform: 'uppercase' },
  inputGroup: { 
    marginBottom: 20 },
  fieldLabel: { 
    color: theme.textSecondary, 
    fontSize: 10, 
    fontWeight: 'bold', 
    marginBottom: 8, 
    letterSpacing: 1 },
  input: { backgroundColor: theme.surface, 
    color: theme.text, 
    padding: 16, borderRadius: 12, 
    borderWidth: 1, 
    borderColor: theme.border, 
    fontSize: 16 },
  textArea: { 
    height: 100, 
    textAlignVertical: 'top' },
  saveButton: { 
    backgroundColor: theme.primary,
    padding: 18, 
    borderRadius: 14, 
    alignItems: 'center', 
    marginTop: 16, 
    height: 56, 
    justifyContent: 'center' },
  saveButtonText: { 
    color: '#FFFFFF', 
    fontSize: 14, 
    fontWeight: 'bold', 
    letterSpacing: 1 },
  deleteButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 20, 
    paddingVertical: 12 },
  deleteButtonText: { 
    color: '#FF3B30', 
    fontSize: 14, 
    fontWeight: '600' }
});