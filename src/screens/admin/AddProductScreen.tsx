import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { spacing, typography, borderRadius } from '../../constants/theme';
import { productService, NewProductData } from '../../services/productService';
import AnimatedScreen from '../../components/AnimatedScreen';
import CustomAlert, { AlertButton } from '../../components/CustomAlert';

export default function AddProductScreen({ navigation }: any) {
  const { colors } = useTheme();
  
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tag, setTag] = useState('');
  const [stockInicial, setStockInicial] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    message: '',
    type: 'info' as 'error' | 'success' | 'info',
    buttons: undefined as AlertButton[] | undefined
  });

  const closeAlert = () => setAlertConfig(prev => ({ ...prev, visible: false }));
  const showAlert = (title: string, message: string, type: 'error' | 'success' | 'info', buttons?: AlertButton[]) => {
    setAlertConfig({ visible: true, title, message, type, buttons });
  };

  const handleSave = async () => {
    if (!nombre || !tag || !stockInicial) {
      showAlert('Error', 'Por favor complete los campos obligatorios (Nombre, Tag, Stock Inicial).', 'error');
      return;
    }

    const stock = parseInt(stockInicial, 10);
    if (isNaN(stock) || stock < 0) {
      showAlert('Error', 'El stock inicial debe ser un número válido mayor o igual a cero.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const data: NewProductData = {
        nombre,
        descripcion,
        tag,
        stock_actual: stock
      };

      await productService.createProduct(data);
      showAlert(
        'Éxito', 
        'Producto registrado correctamente', 
        'success',
        [{ text: 'Aceptar', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      console.error(error);
      showAlert('Error', error.message || 'Ocurrió un error al registrar el producto', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatedScreen>
      <CustomAlert 
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        buttons={alertConfig.buttons}
        onClose={closeAlert}
      />
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity 
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              } else if (typeof navigation.openDrawer === 'function') {
                navigation.openDrawer();
              }
            }} 
            style={styles.backButton}
          >
            <Ionicons 
              name={navigation.canGoBack() ? "arrow-back" : "menu-outline"} 
              size={24} 
              color={colors.text} 
            />
          </TouchableOpacity>
          <Text style={[typography.heading3, { color: colors.text, flex: 1, textAlign: 'center' }]}>
            Nuevo Producto
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={[styles.formContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            
            <View style={styles.inputGroup}>
              <Text style={[typography.label, { color: colors.text }]}>Nombre del Producto *</Text>
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                placeholder="Ej. Taladro Percutor 800W"
                placeholderTextColor={colors.textDisabled}
                value={nombre}
                onChangeText={setNombre}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[typography.label, { color: colors.text }]}>Categoría / Tag *</Text>
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                placeholder="Ej. Herramientas, Electrónica..."
                placeholderTextColor={colors.textDisabled}
                value={tag}
                onChangeText={setTag}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[typography.label, { color: colors.text }]}>Stock Inicial *</Text>
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                placeholder="Ej. 100"
                placeholderTextColor={colors.textDisabled}
                keyboardType="numeric"
                value={stockInicial}
                onChangeText={setStockInicial}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[typography.label, { color: colors.text }]}>Descripción (Opcional)</Text>
              <TextInput
                style={[styles.textArea, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                placeholder="Detalles adicionales del producto"
                placeholderTextColor={colors.textDisabled}
                value={descripcion}
                onChangeText={setDescripcion}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

          </View>
        </ScrollView>

        <View style={[styles.bottomBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <TouchableOpacity 
            style={[styles.saveButton, { backgroundColor: colors.primary }, isSubmitting && { opacity: 0.7 }]}
            onPress={handleSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="save-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={[typography.label, { color: '#fff', fontSize: 16 }]}>Guardar Producto</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: spacing.xs,
    width: 40,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 100, // Espacio para el botón inferior
  },
  formContainer: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  input: {
    ...typography.body,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    marginTop: spacing.xs,
  },
  textArea: {
    ...typography.body,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    marginTop: spacing.xs,
    minHeight: 100,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    borderTopWidth: 1,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: borderRadius.md,
  },
});
