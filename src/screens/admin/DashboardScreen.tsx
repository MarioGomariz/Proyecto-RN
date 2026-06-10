import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AnimatedScreen from '../../components/AnimatedScreen';
import ThemeToggle from '../../components/ThemeToggle';
import { borderRadius, spacing, typography } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';

export default function DashboardScreen({ navigation }: any) {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await authService.signOut();
    } catch (error) {
      console.log('Error al desloguear', error);
    }
  };

  const dashboardItems = [
    { icon: 'add-circle-outline', label: 'Nuevo Producto', color: colors.primary, route: 'AddProductTab' },
    { icon: 'list-outline', label: 'Lista de Productos', color: colors.primary, route: 'ListProductsTab' },
    { icon: 'arrow-down-circle-outline', label: 'Ingreso de Stock', color: '#27ae60', route: 'StockMovementTab', params: { defaultTipo: 'ingreso' } },
    { icon: 'arrow-up-circle-outline', label: 'Salida de Stock', color: '#e74c3c', route: 'StockMovementTab', params: { defaultTipo: 'egreso' } },
  ];

  return (
    <AnimatedScreen>
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        
        <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.background }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
              <Ionicons name="menu-outline" size={26} color={colors.text} />
            </TouchableOpacity>
            <View>
              <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>Panel de Control</Text>
              <Text style={[typography.heading2, { color: colors.text }]}>
                {(user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Admin')}
              </Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <ThemeToggle />
            <TouchableOpacity onPress={handleLogout} style={[styles.logoutButton, { backgroundColor: '#e74c3c15' }]}>
              <Ionicons name="log-out-outline" size={22} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.dashboardGrid}>
            {dashboardItems.map((item) => (
              <TouchableOpacity
                key={item.label}
                style={[styles.dashboardCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => {
                  if (item.route.endsWith('Tab')) {
                    navigation.navigate('Inventario', {
                      screen: item.route,
                      params: 'params' in item ? item.params : undefined
                    });
                  } else {
                    navigation.navigate(item.route, 'params' in item ? item.params : undefined);
                  }
                }}
                activeOpacity={0.75}
              >
                <View style={[styles.cardIconWrapper, { backgroundColor: item.color + '18' }]}>
                  <Ionicons name={item.icon as any} size={28} color={item.color} />
                </View>
                <Text style={[styles.dashboardCardText, { color: colors.text }]}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  menuButton: {
    padding: 8,
    borderRadius: borderRadius.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logoutButton: {
    padding: 8,
    borderRadius: borderRadius.md,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.xl,
  },
  summaryLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600' as const,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  summaryTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '700' as const,
  },
  dashboardGrid: {
    gap: spacing.sm,
  },
  dashboardCard: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  cardIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dashboardCardText: {
    flex: 1,
    ...typography.heading3,
    fontSize: 16,
  },
});
