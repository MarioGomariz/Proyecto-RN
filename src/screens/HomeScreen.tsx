import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AnimatedScreen from '../components/AnimatedScreen';
import ThemeToggle from '../components/ThemeToggle';
import { borderRadius, spacing } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

export default function HomeScreen({ navigation }: any) {
  const { colors, isDark } = useTheme();

  return (
    <AnimatedScreen>
      <LinearGradient
        colors={isDark ? ['#020202', '#0A0A0A', '#220507'] : ['#FFFFFF', '#FFF0F1', '#FFD2D6']}
        style={styles.gradientContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={styles.safe}>

          <View style={styles.publicHeader}>
            <ThemeToggle />
          </View>

          <View style={styles.heroSection}>

            <View style={[styles.iconHalo, { backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : colors.primary + '18' }]}>
              <View style={[styles.iconInner, { backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : colors.primary + '30' }]}>
                <Ionicons name="cube" size={56} color={isDark ? '#fff' : colors.primary} />
              </View>
            </View>

            <Text style={[styles.heroTitle, { color: isDark ? '#fff' : colors.text }]}>StockApp</Text>
            <Text style={[styles.heroSubtitle, { color: isDark ? 'rgba(255,255,255,0.8)' : colors.textSecondary }]}>
              Gestiona tu inventario de{'\n'}forma simple y eficiente
            </Text>

            <View style={[styles.heroDivider, { backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : colors.border }]} />

            <TouchableOpacity
              style={[styles.loginButtonSolid, { backgroundColor: isDark ? '#fff' : colors.primary }]}
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.85}
            >
              <Ionicons name="log-in-outline" size={22} color={isDark ? colors.primary : '#fff'} />
              <Text style={[styles.loginButtonSolidText, { color: isDark ? colors.primary : '#fff' }]}>Iniciar Sesión</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.registerButtonGhost, { borderColor: isDark ? 'rgba(255,255,255,0.5)' : colors.primary }]}
              onPress={() => navigation.navigate('Register')}
              activeOpacity={0.75}
            >
              <Ionicons name="person-add-outline" size={20} color={isDark ? '#fff' : colors.primary} />
              <Text style={[styles.registerButtonGhostText, { color: isDark ? '#fff' : colors.primary }]}>Crear Cuenta Gratis</Text>
            </TouchableOpacity>

          </View>

        </SafeAreaView>
      </LinearGradient>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  gradientContainer: {
    flex: 1,
  },
  publicHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  heroSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    width: '100%',
  },
  iconHalo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  iconInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: '800' as const,
    color: '#FFFFFF',
    letterSpacing: -1,
    marginBottom: spacing.sm,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  heroDivider: {
    width: '80%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: spacing.xl,
    marginTop: spacing.xs,
  },
  loginButtonSolid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  loginButtonSolidText: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  registerButtonGhost: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: 14,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
    width: '100%',
  },
  registerButtonGhostText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
