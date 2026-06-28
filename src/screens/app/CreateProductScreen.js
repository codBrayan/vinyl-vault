import React, { useState, useContext } from "react";
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

export default function CreateProductScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const { usuario } = useContext(AuthContext);
  const styles = createStyles(theme);

  const [form, setForm] = useState({
    title: "",
    artist: "",
    price: "",
    genre: "",
    category: "",
    releaseDate: "",
    imageURL: "",
    currency: "USD",
  });
  const [salvando, setSalvando] = useState(false);

  const getHeaders = () => ({
    userId: usuario?.id,
    userEmail: usuario?.email,
    userType: usuario?.role === "Admin" ? 0 : 1,
  });

  const handleSalvar = async () => {
    if (!form.title || !form.artist || !form.price) {
      Alert.alert("Atenção", "Por favor, preencha os campos obrigatórios.");
      return;
    }

    setSalvando(true);
    try {
      await productService.create(form, getHeaders()); // 👈
      Alert.alert("Sucesso", "Novo produto cadastrado com sucesso!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível cadastrar o produto.");
    } finally {
      setSalvando(false);
    }
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
          <Text style={styles.headerTitle}>Novo Produto</Text>
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
              placeholder="Ex: Abbey Road"
              placeholderTextColor={theme.textSecondary}
              editable={!salvando}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>ARTISTA / BANDA *</Text>
            <TextInput
              style={styles.input}
              value={form.artist}
              onChangeText={(t) => setForm({ ...form, artist: t })}
              placeholder="Ex: The Beatles"
              placeholderTextColor={theme.textSecondary}
              editable={!salvando}
            />
          </View>

          <Text style={styles.sectionLabel}>Especificações</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>PREÇO *</Text>
            <TextInput
              style={styles.input}
              value={form.price}
              onChangeText={(t) => setForm({ ...form, price: t })}
              keyboardType="numeric"
              placeholder="Ex: 34.99"
              placeholderTextColor={theme.textSecondary}
              editable={!salvando}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>MOEDA</Text>
            <TextInput
              style={styles.input}
              value={form.currency}
              onChangeText={(t) => setForm({ ...form, currency: t })}
              placeholder="Ex: USD, BRL"
              placeholderTextColor={theme.textSecondary}
              editable={!salvando}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>CATEGORIA</Text>
            <TextInput
              style={styles.input}
              value={form.category}
              onChangeText={(t) => setForm({ ...form, category: t })}
              placeholder="Ex: vinyl, CD, cassete"
              placeholderTextColor={theme.textSecondary}
              editable={!salvando}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>GÊNERO</Text>
            <TextInput
              style={styles.input}
              value={form.genre}
              onChangeText={(t) => setForm({ ...form, genre: t })}
              placeholder="Ex: rock, pop, jazz"
              placeholderTextColor={theme.textSecondary}
              editable={!salvando}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>DATA DE LANÇAMENTO</Text>
            <TextInput
              style={styles.input}
              value={form.releaseDate}
              onChangeText={(t) => setForm({ ...form, releaseDate: t })}
              placeholder="Ex: 1969-09-26"
              placeholderTextColor={theme.textSecondary}
              editable={!salvando}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>URL DA IMAGEM</Text>
            <TextInput
              style={styles.input}
              value={form.imageURL}
              onChangeText={(t) => setForm({ ...form, imageURL: t })}
              placeholder="https://..."
              placeholderTextColor={theme.textSecondary}
              editable={!salvando}
            />
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSalvar}
            disabled={salvando}
          >
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
      paddingHorizontal: 16,
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
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 4,
    },
    saveButtonText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "bold",
      letterSpacing: 1,
    },
  });
