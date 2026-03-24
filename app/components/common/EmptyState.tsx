import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../../utils/theme';
import { haptics } from '../../utils/haptics';

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({
  icon,
  title,
  subtitle,
  actionLabel,
  onAction,
}: EmptyStateProps): React.JSX.Element => (
  <View style={styles.container}>
    <View style={styles.iconRing}>
      <View style={styles.iconInner}>
        <Ionicons name={icon} size={36} color={Theme.colors.primary} />
      </View>
    </View>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.subtitle}>{subtitle}</Text>
    {actionLabel && onAction && (
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => {
          haptics.light();
          onAction();
        }}
        activeOpacity={0.8}
      >
        <Text style={styles.actionText}>{actionLabel}</Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  iconRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Theme.colors.highlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  iconInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Theme.colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 4,
  },
  actionButton: {
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 32,
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.border.radius.large,
    ...Theme.shadow.medium,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
