import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AnimatedScreen from '../../components/AnimatedScreen';
import ThemeToggle from '../../components/ThemeToggle';
import { borderRadius, spacing, typography } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';

export default function ProfileScreen({ navigation }: any) {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await authService.signOut();
    } catch (error) {
      console.log('Error al desloguear', error);
    }
  };

  return (
    <AnimatedScreen>
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        

        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
            <Ionicons name="menu-outline" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[typography.heading3, { color: colors.text }]}>Mi Cuenta</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.content}>          
          <View style={[styles.avatarContainer, { backgroundColor: colors.primary + '18' }]}>
            <Text style={[styles.avatarText, { color: colors.primary }]}>
              {user?.email?.[0].toUpperCase() || 'A'}
            </Text>
          </View>

          <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={20} color={colors.textSecondary} />
              <View style={styles.infoTextWrapper}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Nombre de usuario</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Administrador'}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={20} color={colors.textSecondary} />
              <View style={styles.infoTextWrapper}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Email</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{user?.email}</Text>
              </View>
            </View>

          </View>

          <Text style={[typography.heading3, { color: colors.text, marginTop: spacing.xl, marginBottom: spacing.sm }]}>
            Preferencias
          </Text>

          <View style={[styles.settingsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons name={isDark ? 'moon-outline' : 'sunny-outline'} size={20} color={colors.textSecondary} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  Modo Oscuro ({isDark ? 'Activado' : 'Desactivado'})
                </Text>
              </View>
              <ThemeToggle />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: '#e74c3c' }]}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={20} color="#fff" />
            <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  menuButton: {
    padding: 8,
    borderRadius: borderRadius.md,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.md,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700',
  },
  infoCard: {
    width: '100%',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  infoTextWrapper: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#00000015',
    marginVertical: spacing.sm,
  },
  settingsCard: {
    width: '100%',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    width: '100%',
    paddingVertical: 14,
    borderRadius: borderRadius.lg,
    marginTop: 'auto',
    marginBottom: spacing.sm,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
