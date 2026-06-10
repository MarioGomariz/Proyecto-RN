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
import ThemeToggle from '../../components/ThemeToggle';
import CustomAlert from '../../components/CustomAlert';

export default function LoginScreen({ navigation }: any) {
  const { colors } = useTheme();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [securePassword, setSecurePassword] = useState(true);
  
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    message: '',
    type: 'info' as 'error' | 'success' | 'info'
  });

  const closeAlert = () => setAlertConfig(prev => ({ ...prev, visible: false }));

  const handleLogin = async () => {
    if (!email || !password) {
      setAlertConfig({
        visible: true,
        title: 'Error',
        message: 'Por favor ingresá tu email y contraseña',
        type: 'error'
      });
      return;
    }

    setIsLoading(true);
    try {
      await authService.signIn(email, password);
      navigation.goBack();
    } catch (error: any) {
      setAlertConfig({
        visible: true,
        title: 'Error al iniciar sesión',
        message: error.message || 'Ocurrió un error inesperado',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatedScreen>
      <CustomAlert 
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={closeAlert}
      />
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.inner}>
              <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                  <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <ThemeToggle />
              </View>

              <View style={styles.content}>
                <Text style={[typography.heading1, { color: colors.text, marginBottom: spacing.sm }]}>
                  Bienvenido
                </Text>
                <Text style={[typography.body, { color: colors.textSecondary, marginBottom: spacing.xl }]}>
                  Iniciá sesión para continuar
                </Text>

                
                <View style={styles.formContainer}>
                  <TextInput
                    style={[
                      styles.input, 
                      { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }
                    ]}
                    placeholder="Email"
                    placeholderTextColor={colors.textDisabled}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                  
                  <View style={[
                    styles.inputContainer, 
                    { backgroundColor: colors.surface, borderColor: colors.border }
                  ]}>
                    <TextInput
                      style={[
                        styles.inputField, 
                        { color: colors.text }
                      ]}
                      placeholder="Contraseña"
                      placeholderTextColor={colors.textDisabled}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={securePassword}
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

                  <TouchableOpacity 
                    style={[styles.button, { backgroundColor: colors.primary }]}
                    onPress={handleLogin}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Iniciar Sesión</Text>
                    )}
                  </TouchableOpacity>
                </View>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  backButton: {
    padding: spacing.xs,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
    paddingBottom: '20%', // Para que no quede exactamente en el centro
  },
  formContainer: {
    gap: spacing.md,
  },
  input: {
    ...typography.body,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    borderWidth: 1,
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
  button: {
    marginTop: spacing.sm,
    paddingVertical: 14,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  buttonText: {
    ...typography.label,
    color: '#fff',
    fontSize: 16,
  },
});
