import { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View, FlatList, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { borderRadius, spacing, typography } from '../constants/theme';

interface SelectPickerProps {
  selectedValue: string;
  onValueChange: (value: string) => void;
  options: string[];
}

export default function SelectPicker({ selectedValue, onValueChange, options }: SelectPickerProps) {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (value: string) => {
    onValueChange(value);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: colors.surface, borderColor: colors.border }]} 
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.buttonText, { color: colors.text }]}>
          {selectedValue}
        </Text>
        <Ionicons name="caret-down" size={16} color={colors.textSecondary} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.modalContent, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <FlatList
                  data={options}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      style={[styles.option, { 
                        backgroundColor: selectedValue === item ? colors.primary + '20' : 'transparent',
                        borderBottomColor: colors.border
                      }]}
                      onPress={() => handleSelect(item)}
                    >
                      <Text style={[styles.optionText, { 
                        color: selectedValue === item ? colors.primary : colors.text,
                        fontWeight: selectedValue === item ? '600' : '400'
                      }]}>
                        {item}
                      </Text>
                      {selectedValue === item && (
                        <Ionicons name="checkmark" size={20} color={colors.primary} />
                      )}
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    borderWidth: 1,
    borderRadius: borderRadius.md,
  },
  buttonText: {
    ...typography.body,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  modalContent: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    maxHeight: '80%',
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
  },
  optionText: {
    ...typography.body,
  },
});
