import { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { productService } from '../../services/productService';
import { spacing, typography, borderRadius } from '../../constants/theme';
import AnimatedScreen from '../../components/AnimatedScreen';
import CustomAlert, { AlertButton } from '../../components/CustomAlert';

export default function ProductDetailScreen({ route, navigation }: any) {
  const { colors } = useTheme();
  const { productId } = route.params || {};

  const [product, setProduct] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    if (productId) {
      loadData();
    } else {
      setIsLoading(false);
      showAlert('Error', 'No se proporcionó un ID de producto válido', 'error', [{ text: 'Volver', onPress: () => navigation.goBack() }]);
    }
  }, [productId]);

  const loadData = async () => {
    try {
      const [prodData, histData] = await Promise.all([
        productService.getProductById(productId),
        productService.getProductHistory(productId)
      ]);
      setProduct(prodData);
      setHistory(histData || []);
    } catch (error) {
      showAlert('Error', 'No se pudo cargar la información del producto', 'error', [{ text: 'Volver', onPress: () => navigation.goBack() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderHistoryItem = ({ item }: { item: any }) => {
    const isIngreso = item.tipo === 'ingreso';
    const date = new Date(item.created_at).toLocaleDateString();
    
    return (
      <View style={[styles.historyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={[styles.historyIcon, { backgroundColor: isIngreso ? colors.primary + '20' : '#e74c3c20' }]}>
          <Ionicons 
            name={isIngreso ? 'arrow-down-outline' : 'arrow-up-outline'} 
            size={20} 
            color={isIngreso ? colors.primary : '#e74c3c'} 
          />
        </View>
        <View style={styles.historyInfo}>
          <Text style={[typography.heading3, { color: colors.text, fontSize: 16 }]}>
            {isIngreso ? 'Ingreso' : 'Egreso'} de {item.cantidad} u.
          </Text>
          <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>
            {date} {item.observaciones ? `• ${item.observaciones}` : ''}
          </Text>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <CustomAlert 
          visible={alertConfig.visible}
          title={alertConfig.title}
          message={alertConfig.message}
          type={alertConfig.type}
          buttons={alertConfig.buttons}
          onClose={closeAlert}
        />
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

      <SafeAreaView style={styles.safe}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[typography.heading3, { color: colors.text, flex: 1, textAlign: 'center' }]}>
            Detalles del Producto
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={renderHistoryItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.headerComponent}>
              <View style={[styles.mainCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={[styles.bigIconContainer, { backgroundColor: colors.primary + '15' }]}>
                  <Ionicons name="cube-outline" size={64} color={colors.primary} />
                </View>
                
                <Text style={[typography.heading2, { color: colors.text, marginTop: spacing.lg, textAlign: 'center' }]}>
                  {product.nombre}
                </Text>
                
                <View style={[styles.tagBadge, { backgroundColor: colors.primary + '20' }]}>
                  <Text style={[typography.label, { color: colors.primary }]}>
                    {product.tag}
                  </Text>
                </View>

                {product.descripcion && (
                  <Text style={[typography.body, { color: colors.textSecondary, marginTop: spacing.md, textAlign: 'center' }]}>
                    {product.descripcion}
                  </Text>
                )}

                <View style={[styles.divider, { backgroundColor: colors.border }]} />

                <View style={styles.infoRow}>
                  <Text style={[typography.body, { color: colors.textSecondary }]}>Stock Actual</Text>
                  <Text style={[typography.heading2, { color: colors.primary }]}>{product.stock_actual}</Text>
                </View>

              </View>

              <Text style={[typography.heading3, { color: colors.text, marginTop: spacing.xl, marginBottom: spacing.sm }]}>
                Historial de Movimientos
              </Text>
            </View>
          }
          ListEmptyComponent={
            <Text style={[typography.body, { color: colors.textSecondary, textAlign: 'center', marginTop: spacing.lg }]}>
              No hay movimientos registrados para este producto.
            </Text>
          }
        />
      </SafeAreaView>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  listContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  headerComponent: {
    marginBottom: spacing.md,
  },
  mainCard: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing.xl,
    alignItems: 'center',
  },
  bigIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: 16,
    marginTop: spacing.sm,
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  historyCard: {
    flexDirection: 'row',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  historyInfo: {
    flex: 1,
  },
});
