import { TouchableOpacity, StyleSheet } from 'react-native';
import { Motion } from '@legendapp/motion';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  size?: number;
}

export default function ThemeToggle({ size = 22 }: ThemeToggleProps) {
  const { isDark, toggleTheme, colors } = useTheme();

  return (
    <TouchableOpacity onPress={toggleTheme} style={styles.button} activeOpacity={0.7}>
      <Motion.View
        animate={{ rotate: isDark ? '180deg' : '0deg' }}
        transition={{ type: 'spring', damping: 12, stiffness: 150 }}
      >
        <Ionicons
          name={isDark ? 'sunny' : 'moon'}
          size={size}
          color={isDark ? colors.warning : colors.primary}
        />
      </Motion.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
});
