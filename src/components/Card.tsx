import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Motion } from '@legendapp/motion';
import { useTheme } from '../context/ThemeContext';
import { Item } from '../types';
import { borderRadius, spacing, typography } from '../constants/theme';

interface CardProps {
  item: Item;
  index: number; 
  onPress?: (item: Item) => void;
}

export default function Card({ item, index, onPress }: CardProps) {
  const { colors } = useTheme();


  const delay = index * 60;

  return (
    <Motion.View
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 18, stiffness: 180, delay }}
    >
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => onPress?.(item)}
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            shadowColor: colors.shadow,
          },
        ]}
      >

        {item.category && (
          <View style={[styles.badge, { backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.badgeText, { color: colors.primary }]}>
              {item.category}
            </Text>
          </View>
        )}

        <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>

        {item.subtitle && (
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {item.subtitle}
          </Text>
        )}

        {item.description && (
          <Text
            style={[styles.description, { color: colors.textSecondary }]}
            numberOfLines={2}
          >
            {item.description}
          </Text>
        )}
      </TouchableOpacity>
    </Motion.View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    marginBottom: spacing.sm,
  },
  badgeText: {
    ...typography.caption,
    fontWeight: '600',
  },
  title: {
    ...typography.heading3,
    marginBottom: 4,
  },
  subtitle: {
    ...typography.label,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.bodySmall,
    lineHeight: 20,
  },
});
