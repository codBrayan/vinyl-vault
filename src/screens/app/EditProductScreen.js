import React, { useState, useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ThemeContext } from "../../context/ThemeContext.js";
import { productService } from "../../services/productService.js";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../context/AuthContext.js";
import { Picker } from "@react-native-picker/picker";

export default function EditProductScreen({ route, navigation }) {
  const { theme } = useContext(ThemeContext);
  const { usuario } = useContext(AuthContext);
  const styles = createStyles(theme);

  const produtoParaEditar = route.params?.produtoParaEditar || null;
  console.log("produtoParaEditar", produtoParaEditar);

  const [form, setForm] = useState({
    title: "",
    artist: "",
    price: "",
    genre: "",
    category: "",
    releaseDate: "",
    imageURL: "",
    currency: "BRL",
    description: "",
  });
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (produtoParaEditar) {
      setForm({
        title: produtoParaEditar.title || "",
        artist: produtoParaEditar.artist || "",
        price: produtoParaEditar.convertedPrice?.toFixed(2) || "",
        genre: produtoParaEditar.genre || "",
        category: produtoParaEditar.category || "",
        releaseDate: produtoParaEditar.releaseDate || "",
        imageURL: produtoParaEditar.imageURL || "",
        currency: produtoParaEditar.currency || "BRL",
        description: produtoParaEditar.description || "",
      });
    }
  }, [produtoParaEditar]);

  const getHeaders = () => ({
    userId: usuario?.id,
    userEmail: usuario?.email,
    userType: usuario?.role === "Admin" ? 0 : 1,
  });

  const handleSalvarAlteracoes = async () => {
    if (!form.title || !form.artist || !form.price) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios.");
      return;
    }

    setSalvando(true);
    try {
      await productService.update(produtoParaEditar.id, form, getHeaders());
      Alert.alert("Sucesso", "Produto atualizado com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating product:", error);
      Alert.alert("Erro", "Não foi possível atualizar o produto.");
    } finally {
      setSalvando(false);
    }
  };

  const handleDeletar = () => {
    Alert.alert(
      "Confirmar Exclusão",
      `Tem certeza que deseja deletar permanentemente o álbum ${form.title}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            setSalvando(true);
            try {
              await productService.delete(produtoParaEditar.id, getHeaders());
              Alert.alert("Deletado", "Produto removido do catálogo.");
              navigation.reset({
                index: 0,
                routes: [{ name: "MainTabs" }],
              });
            } catch (error) {
              Alert.alert("Erro", "Não foi possível deletar o produto.");
            } finally {
              setSalvando(false);
            }
          },
        },
      ],
    );
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            disabled={salvando}
          >
            <Ionicons name="chevron-back" size={28} color={theme.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Editar Produto</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.form}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionLabel}>Identidade do Disco</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>TÍTULO DO ÁLBUM *</Text>
            <TextInput
              style={styles.input}
              value={form.title}
              onChangeText={(t) => setForm({ ...form, title: t })}
              editable={!salvando}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>ARTISTA / BANDA *</Text>
            <TextInput
              style={styles.input}
              value={form.artist}
              onChangeText={(t) => setForm({ ...form, artist: t })}
              editable={!salvando}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>DESCRIÇÃO DO PRODUTO</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={form.description}
              onChangeText={(t) => setForm({ ...form, description: t })}
              placeholder="Detalhes sobre a edição, encarte..."
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={4}
              editable={!salvando}
            />
          </View>

          <Text style={styles.sectionLabel}>Especificações</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>PREÇO (R$) *</Text>
            <TextInput
              style={styles.input}
              value={form.price}
              onChangeText={(t) => setForm({ ...form, price: t })}
              keyboardType="numeric"
              editable={!salvando}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>CATEGORIA</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={form.category}
                onValueChange={(value) => setForm({ ...form, category: value })}
                style={{ color: theme.text }}
                dropdownIconColor={theme.textSecondary}
                enabled={!salvando}
              >
                <Picker.Item label="Vinil" value="vinyl" />
                <Picker.Item label="CD" value="CD" />
                <Picker.Item label="Cassete" value="cassete" />
              </Picker>
            </View>
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSalvarAlteracoes}
            disabled={salvando}
          >
            {salvando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>SALVAR ALTERAÇÕES</Text>
            )}
          </TouchableOpacity>

          {!salvando && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeletar}
            >
              <Ionicons
                name="trash-outline"
                size={18}
                color="#FF3B30"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.deleteButtonText}>Remover do Catálogo</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
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
      justifyContent: "space-between",
      alignItems: "center",
      addingHorizontal: 16,
      paddingVertical: 12,
    },
    backButton: {
      padding: 4,
    },
    headerTitle: {
      color: theme.text,
      fontSize: 20,
      fontWeight: "bold",
      letterSpacing: 0.5,
    },
    form: {
      padding: 24,
      paddingBottom: 48,
    },
    sectionLabel: {
      color: theme.primary,
      fontSize: 12,
      fontWeight: "bold",
      letterSpacing: 1.5,
      marginBottom: 16,
      marginTop: 8,
      textTransform: "uppercase",
    },
    inputGroup: {
      marginBottom: 20,
    },
    pickerWrapper: {
      backgroundColor: theme.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      overflow: "hidden",
    },
    fieldLabel: {
      color: theme.textSecondary,
      fontSize: 10,
      fontWeight: "bold",
      marginBottom: 8,
      letterSpacing: 1,
    },
    input: {
      backgroundColor: theme.surface,
      color: theme.text,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      fontSize: 16,
    },
    textArea: {
      height: 100,
      textAlignVertical: "top",
    },
    saveButton: {
      backgroundColor: theme.primary,
      padding: 18,
      borderRadius: 14,
      alignItems: "center",
      marginTop: 16,
      height: 56,
      justifyContent: "center",
    },
    saveButtonText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "bold",
      letterSpacing: 1,
    },
    deleteButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 20,
      paddingVertical: 12,
    },
    deleteButtonText: {
      color: "#FF3B30",
      fontSize: 14,
      fontWeight: "600",
    },
  });
