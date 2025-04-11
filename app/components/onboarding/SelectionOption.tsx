import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Theme } from '../../utils/theme';

interface SelectionOptionProps {
  label: string;
  isSelected: boolean;
  onSelect: () => void;
  icon?: React.ReactNode;
  description?: string;
}

const SelectionOption: React.FC<SelectionOptionProps> = ({
  label,
  isSelected,
  onSelect,
  icon,
  description,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected && styles.containerSelected,
      ]}
      onPress={onSelect}
      activeOpacity={0.7}
    >
      <View style={styles.contentContainer}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        
        <View style={styles.textContainer}>
          <Text style={[
            styles.label,
            isSelected && styles.labelSelected,
          ]}>
            {label}
          </Text>
          
          {description && (
            <Text style={styles.description}>{description}</Text>
          )}
        </View>
        
        <View style={[
          styles.checkCircle,
          isSelected && styles.checkCircleSelected,
        ]}>
          {isSelected && <View style={styles.checkMark} />}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.border.radius.medium,
    marginBottom: Theme.spacing.m,
    padding: Theme.spacing.m,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  containerSelected: {
    borderColor: Theme.colors.primary,
    backgroundColor: `${Theme.colors.primary}10`, // 10% opacity of primary color
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: Theme.spacing.m,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: Theme.typography.fontSize.medium,
    fontWeight: '600',
    color: Theme.colors.text,
  },
  labelSelected: {
    color: Theme.colors.primary,
  },
  description: {
    fontSize: Theme.typography.fontSize.small,
    color: Theme.colors.textSecondary,
    marginTop: Theme.spacing.xs,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleSelected: {
    borderColor: Theme.colors.primary,
    backgroundColor: Theme.colors.primary,
  },
  checkMark: {
    width: 10,
    height: 6,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#FFFFFF',
    transform: [{ rotate: '-45deg' }],
  },
});

export default SelectionOption; 