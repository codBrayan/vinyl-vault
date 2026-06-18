import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { ThemeContext } from '../../context/ThemeContext.js';
import { productService } from '../../services/productService.js';
import { Ionicons } from '@expo/vector-icons';
import mockproduct from '../../services/mocks/products.json'

export default function ManageProductScreen({ route, navigation }) {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);
  
  const produtoParaEditar = route.params?.produtoParaEditar || null;
  const modoEdicao = !!produtoParaEditar;

  const [nome, setNome] = useState('');
  const [artista, setArtista] = useState('');
  const [preco, setPreco] = useState('');
  const [imagem, setImagem] = useState('');
  const [categoria, setcategoria] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (modoEdicao) {
      setNome(produtoParaEditar.titulo || produtoParaEditar.nome || '');
      setArtista(produtoParaEditar.artista || '');
      setPreco(produtoParaEditar.preco?.toString() || '');
      setcategoria(produtoParaEditar.categoria?.toString() || '');
      setImagem(produtoParaEditar.imagem || '');
    }
  }, [produtoParaEditar]);

  const handleSalvar = async () => {
    if (!nome || !artista || !preco || !imagem) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos!');
      return;
    }

    setSalvando(true);
    try {
      const payload = { nome, artista, preco, imagem };

      if (modoEdicao) {
        await productService.update(produtoParaEditar.id, payload);
        console.log(mockproduct)
        Alert.alert('Sucesso', 'Produto atualizado com sucesso no catálogo!');
      } else {
        await productService.create(payload);
        console.log(mockproduct)
        Alert.alert('Sucesso', 'Novo produto cadastrado com sucesso!');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o produto.');
    } finally {
      setSalvando(false);
    }
  };

  const handleDeletar = () => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja deletar permanentemente o álbum ${nome}?`,
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
              navigation.goBack();
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} disabled={salvando}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {modoEdicao ? 'Editar Produto' : 'Novo Produto'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.label}>Nome do Álbum / Produto</Text>
        <TextInput 
          style={styles.input} 
          value={nome} 
          onChangeText={setNome} 
          placeholder="Ex: Abbey Road"
          placeholderTextColor={theme.textSecondary}
          editable={!salvando}
        />

        <Text style={styles.label}>Artista / Banda</Text>
        <TextInput 
          style={styles.input} 
          value={artista} 
          onChangeText={setArtista} 
          placeholder="Ex: The Beatles"
          placeholderTextColor={theme.textSecondary}
          editable={!salvando}
        />

        <Text style={styles.label}>Preço (R$)</Text>
        <TextInput 
          style={styles.input} 
          value={preco} 
          onChangeText={setPreco} 
          keyboardType="numeric" 
          placeholder="Ex: 189.90"
          placeholderTextColor={theme.textSecondary}
          editable={!salvando}
        />

        <Text style={styles.label}>URL da Imagem de Capa</Text>
        <TextInput 
          style={styles.input} 
          value={imagem} 
          onChangeText={setImagem} 
          placeholder="https://linkdaimagem.com/capa.jpg"
          placeholderTextColor={theme.textSecondary}
          autoCapitalize="none"
          editable={!salvando}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSalvar} disabled={salvando}>
          {salvando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>
              {modoEdicao ? 'Salvar Alterações' : 'Cadastrar Álbum'}
            </Text>
          )}
        </TouchableOpacity>

        {modoEdicao && !salvando && (
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeletar}>
            <Ionicons name="trash-outline" size={20} color="#FF3B30" style={{ marginRight: 8 }} />
            <Text style={styles.deleteButtonText}>Excluir Produto</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.background 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    paddingVertical: 12 
  },
  backButton: { 
    marginRight: 16 
  },
  headerTitle: { 
    color: theme.text, 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
  form: { 
    padding: 24 
  },
  label: { 
    color: theme.text, 
    fontSize: 14, 
    fontWeight: '600', 
    marginBottom: 8, 
    marginTop: 16 
  },
  input: { 
    backgroundColor: theme.surface, 
    color: theme.text, 
    padding: 14, 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: theme.border, 
    fontSize: 16 
  },
  saveButton: { 
    backgroundColor: theme.primary, 
    padding: 16, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginTop: 32, 
    height: 54, 
    justifyContent: 'center' 
  },
  saveButtonText: { 
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  deleteButton: { 
    flexDirection: 'row', 
    borderColor: '#FF3B30', 
    borderWidth: 1, 
    padding: 16, 
    borderRadius: 8, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 16, 
    height: 54 
  },
  deleteButtonText: { 
    color: '#FF3B30', 
    fontSize: 16, 
    fontWeight: 'bold' 
  }
});