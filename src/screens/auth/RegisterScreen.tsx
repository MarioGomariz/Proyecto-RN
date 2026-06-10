import { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { authService } from '../../services/authService';
import { spacing, typography, borderRadius } from '../../constants/theme';
import AnimatedScreen from '../../components/AnimatedScreen';

export default function RegisterScreen({ navigation }: any) {
  const { colors } = useTheme();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [securePassword, setSecurePassword] = useState(true);
  const [secureConfirmPassword, setSecureConfirmPassword] = useState(true);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      setError('Por favor completa todos los campos');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      await authService.signUp(email, password);
      navigation.goBack();
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al registrarse');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatedScreen>
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.inner}>
              
              <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                  <Ionicons name="close" size={28} color={colors.text} />
                </TouchableOpacity>
              </View>

              <View style={styles.formContainer}>
                <View style={styles.titleContainer}>
                  <Text style={[typography.heading1, { color: colors.text, marginBottom: spacing.xs }]}>
                    Crear Cuenta
                  </Text>
                  <Text style={[typography.body, { color: colors.textSecondary }]}>
                    Ingresa tus datos para registrarte
                  </Text>
                </View>

                {error && (
                  <View style={[styles.errorContainer, { backgroundColor: '#e74c3c20' }]}>
                    <Text style={[typography.bodySmall, { color: '#e74c3c' }]}>{error}</Text>
                  </View>
                )}

                <View style={styles.inputGroup}>
                  <Text style={[typography.label, { color: colors.text }]}>Correo Electrónico</Text>
                  <TextInput
                    style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
                    placeholder="tucorreo@ejemplo.com"
                    placeholderTextColor={colors.textDisabled}
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      setError(null);
                    }}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    editable={!isLoading}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[typography.label, { color: colors.text }]}>Contraseña</Text>
                  <View style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                    <TextInput
                      style={[styles.inputField, { color: colors.text }]}
                      placeholder="Mínimo 6 caracteres"
                      placeholderTextColor={colors.textDisabled}
                      value={password}
                      onChangeText={(text) => {
                        setPassword(text);
                        setError(null);
                      }}
                      secureTextEntry={securePassword}
                      editable={!isLoading}
                    />
                    <TouchableOpacity 
                      style={styles.eyeButton}
                      onPress={() => setSecurePassword(prev => !prev)}
                    >
                      <Ionicons 
                        name={securePassword ? "eye-off-outline" : "eye-outline"} 
                        size={22} 
                        color={colors.textSecondary} 
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[typography.label, { color: colors.text }]}>Confirmar Contraseña</Text>
                  <View style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                    <TextInput
                      style={[styles.inputField, { color: colors.text }]}
                      placeholder="Repite la contraseña"
                      placeholderTextColor={colors.textDisabled}
                      value={confirmPassword}
                      onChangeText={(text) => {
                        setConfirmPassword(text);
                        setError(null);
                      }}
                      secureTextEntry={secureConfirmPassword}
                      editable={!isLoading}
                    />
                    <TouchableOpacity 
                      style={styles.eyeButton}
                      onPress={() => setSecureConfirmPassword(prev => !prev)}
                    >
                      <Ionicons 
                        name={secureConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                        size={22} 
                        color={colors.textSecondary} 
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity 
                  style={[styles.registerButton, { backgroundColor: colors.primary }, isLoading && { opacity: 0.7 }]}
                  onPress={handleRegister}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={[typography.heading3, { color: '#fff', fontSize: 16 }]}>Registrarse</Text>
                  )}
                </TouchableOpacity>

              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    padding: spacing.xl,
  },
  header: {
    alignItems: 'flex-end',
    marginBottom: spacing.xl,
  },
  backButton: {
    padding: spacing.xs,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  titleContainer: {
    marginBottom: spacing.xxl,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  input: {
    ...typography.body,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    marginTop: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.md,
    marginTop: spacing.xs,
  },
  inputField: {
    flex: 1,
    ...typography.body,
    paddingLeft: spacing.md,
    paddingRight: spacing.sm,
    paddingVertical: 14,
  },
  eyeButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButton: {
    paddingVertical: 16,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  errorContainer: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
});
