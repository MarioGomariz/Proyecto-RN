import { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { Motion } from '@legendapp/motion';
import { useTheme } from '../context/ThemeContext';

interface AnimatedScreenProps {
  children: ReactNode;
}

export default function AnimatedScreen({ children }: AnimatedScreenProps) {
  const { colors } = useTheme();

  return (
    <Motion.View
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {children}
    </Motion.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
