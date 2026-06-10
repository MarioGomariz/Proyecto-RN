import { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '../../context/ThemeContext';
import { spacing, typography, borderRadius } from '../../constants/theme';
import { productService } from '../../services/productService';
import AnimatedScreen from '../../components/AnimatedScreen';
import CustomAlert, { AlertButton } from '../../components/CustomAlert';

export default function StockMovementScreen({ route, navigation }: any) {
  const { colors, isDark } = useTheme();
  const { defaultTipo } = route.params || {};
  
  const [tipoMovimiento, setTipoMovimiento] = useState<'ingreso' | 'egreso'>(defaultTipo || 'ingreso');
  const [productos, setProductos] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [cantidad, setCantidad] = useState('');
  const [observaciones, setObservaciones] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productService.getProducts();
      setProductos(data || []);
      if (data && data.length > 0) {
        setSelectedProductId(data[0].id);
      }
    } catch (error) {
      console.error(error);
      showAlert('Error', 'No se pudieron cargar los productos.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedProductId) {
      showAlert('Error', 'Por favor seleccione un producto.', 'error');
      return;
    }

    const qty = parseInt(cantidad, 10);
    if (isNaN(qty) || qty <= 0) {
      showAlert('Error', 'La cantidad debe ser un número mayor a 0.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await productService.registerMovement(selectedProductId, tipoMovimiento, qty, observaciones);
      setCantidad('');
      setObservaciones('');
      showAlert(
        'Éxito', 
        `Se registró el ${tipoMovimiento} de ${qty} unidades correctamente.`, 
        'success',
        [{ text: 'Aceptar', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      console.error(error);
      showAlert('Error', error.message || 'Ocurrió un error al registrar el movimiento', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.safe, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

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
            onPress={() => {navigation.openDrawer();}} 
            style={styles.backButton}
          >
            <Ionicons 
              name={"menu-outline"} 
              size={24} 
              color={colors.text} 
            />
          </TouchableOpacity>
          <Text style={[typography.heading3, { color: colors.text, flex: 1, textAlign: 'center' }]}>
            {tipoMovimiento === 'ingreso' ? 'Ingreso de Stock' : 'Salida de Stock'}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          

          <View style={styles.typeSelector}>
            <TouchableOpacity 
              style={[
                styles.typeButton, 
                tipoMovimiento === 'ingreso' ? { backgroundColor: colors.primary, borderColor: colors.primary } : { backgroundColor: colors.surface, borderColor: colors.border }
              ]}
              onPress={() => setTipoMovimiento('ingreso')}
            >
              <Ionicons name="arrow-down-circle-outline" size={20} color={tipoMovimiento === 'ingreso' ? '#fff' : colors.text} style={{ marginRight: 8 }} />
              <Text style={[typography.label, { color: tipoMovimiento === 'ingreso' ? '#fff' : colors.text }]}>Ingreso</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.typeButton, 
                tipoMovimiento === 'egreso' ? { backgroundColor: '#e74c3c', borderColor: '#e74c3c' } : { backgroundColor: colors.surface, borderColor: colors.border }
              ]}
              onPress={() => setTipoMovimiento('egreso')}
            >
              <Ionicons name="arrow-up-circle-outline" size={20} color={tipoMovimiento === 'egreso' ? '#fff' : colors.text} style={{ marginRight: 8 }} />
              <Text style={[typography.label, { color: tipoMovimiento === 'egreso' ? '#fff' : colors.text }]}>Salida</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.formContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            

            <View style={styles.inputGroup}>
              <Text style={[typography.label, { color: colors.text }]}>Seleccionar Producto *</Text>
              <View style={[styles.pickerContainer, { borderColor: colors.border, backgroundColor: colors.background }]}>
                {productos.length === 0 ? (
                  <Text style={[typography.body, { padding: spacing.md, color: colors.textSecondary }]}>No hay productos registrados</Text>
                ) : (
                  <Picker
                    selectedValue={selectedProductId}
                    onValueChange={(itemValue) => setSelectedProductId(itemValue)}
                    style={{ color: colors.text }}
                    dropdownIconColor={colors.text}
                  >
                    {productos.map(p => (
                      <Picker.Item 
                        key={p.id} 
                        label={`${p.nombre} (Stock: ${p.stock_actual})`} 
                        value={p.id} 
                        color={isDark ? '#fff' : '#000'}
                      />
                    ))}
                  </Picker>
                )}
              </View>
            </View>


            <View style={styles.inputGroup}>
              <Text style={[typography.label, { color: colors.text }]}>Cantidad a mover *</Text>
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                placeholder="Ej. 10"
                placeholderTextColor={colors.textDisabled}
                keyboardType="numeric"
                value={cantidad}
                onChangeText={setCantidad}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[typography.label, { color: colors.text }]}>Observaciones (Opcional)</Text>
              <TextInput
                style={[styles.textArea, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                placeholder="Motivo, proveedor, cliente, etc."
                placeholderTextColor={colors.textDisabled}
                value={observaciones}
                onChangeText={setObservaciones}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

          </View>
        </ScrollView>

        <View style={[styles.bottomBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <TouchableOpacity 
            style={[
              styles.saveButton, 
              { backgroundColor: tipoMovimiento === 'ingreso' ? colors.primary : '#e74c3c' }, 
              isSubmitting && { opacity: 0.7 },
              productos.length === 0 && { opacity: 0.5 }
            ]}
            onPress={handleSave}
            disabled={isSubmitting || productos.length === 0}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="checkmark-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={[typography.label, { color: '#fff', fontSize: 16 }]}>Registrar Movimiento</Text>
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
    paddingBottom: 100,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  formContainer: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    marginTop: spacing.xs,
    overflow: 'hidden',
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
    minHeight: 80,
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
