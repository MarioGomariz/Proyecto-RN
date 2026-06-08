import { Modal, StyleSheet, Text, TouchableOpacity, View, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { borderRadius, spacing, typography } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  buttons?: AlertButton[];
  onClose?: () => void; // Called when background is pressed or a default 'OK' button is pressed
  type?: 'success' | 'error' | 'info';
}

export default function CustomAlert({ 
  visible, 
  title, 
  message, 
  buttons, 
  onClose,
  type = 'info'
}: CustomAlertProps) {
  const { colors } = useTheme();

  // Si no hay botones definidos, creamos un botón "OK" por defecto
  const renderButtons = buttons && buttons.length > 0 
    ? buttons 
    : [{ text: 'OK', onPress: onClose }];

  const getIconName = () => {
    switch(type) {
      case 'success': return 'checkmark-circle-outline';
      case 'error': return 'alert-circle-outline';
      case 'info':
      default: return 'information-circle-outline';
    }
  };

  const getIconColor = () => {
    switch(type) {
      case 'success': return colors.primary; // Or a specific success color
      case 'error': return colors.error;
      case 'info':
      default: return colors.primary;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.alertBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              
              <View style={styles.iconContainer}>
                <Ionicons name={getIconName()} size={48} color={getIconColor()} />
              </View>

              <Text style={[typography.heading3, { color: colors.text, textAlign: 'center', marginBottom: spacing.sm }]}>
                {title}
              </Text>
              
              <Text style={[typography.body, { color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.xl }]}>
                {message}
              </Text>

              <View style={styles.buttonsContainer}>
                {renderButtons.map((btn, index) => {
                  const isCancel = btn.style === 'cancel';
                  const isDestructive = btn.style === 'destructive';
                  
                  return (
                    <TouchableOpacity 
                      key={index}
                      style={[
                        styles.button, 
                        { 
                          backgroundColor: isCancel ? 'transparent' : (isDestructive ? colors.error : colors.primary),
                          borderWidth: isCancel ? 1 : 0,
                          borderColor: colors.border,
                        }
                      ]}
                      onPress={() => {
                        if (btn.onPress) btn.onPress();
                        if (onClose) onClose();
                      }}
                    >
                      <Text style={[
                        styles.buttonText, 
                        { color: isCancel ? colors.text : '#fff' }
                      ]}>
                        {btn.text}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  alertBox: {
    width: '100%',
    maxWidth: 340,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: spacing.md,
  },
  buttonsContainer: {
    width: '100%',
    gap: spacing.sm,
  },
  button: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    ...typography.label,
    fontSize: 16,
  },
});
