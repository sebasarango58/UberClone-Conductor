import { Pressable, StyleSheet, Text, View } from 'react-native';

export const colors = {
  navy: '#101828',
  blue: '#175CD3',
  pale: '#EFF8FF',
  green: '#067647',
  red: '#B42318',
  gray: '#667085',
  line: '#EAECF0',
  white: '#FFFFFF',
  bg: '#F8FAFC',
};

export function Button({ title, onPress, secondary = false, disabled = false }) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.button,
        secondary && styles.secondary,
        disabled && { opacity: 0.45 },
      ]}
    >
      <Text style={[styles.buttonText, secondary && { color: colors.navy }]}>
        {title}
      </Text>
    </Pressable>
  );
}

export function Card({ children }) {
  return <View style={styles.card}>{children}</View>;
}

export function Heading({ children, small = false }) {
  return (
    <Text style={small ? styles.smallHeading : styles.heading}>
      {children}
    </Text>
  );
}

export function Field({ label, value, hint }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.field}>
        <Text style={{ color: value ? colors.navy : '#98A2B3' }}>
          {value || 'Sin registrar'}
        </Text>
      </View>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 18,
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.navy,
    marginBottom: 8,
  },
  smallHeading: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.navy,
    marginBottom: 8,
  },
  subtitle: {
    color: colors.gray,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 16,
  },
  card: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: 12,
  },
  button: {
    backgroundColor: colors.blue,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  secondary: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
  },
  buttonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
  label: {
    fontWeight: '600',
    color: colors.navy,
    marginBottom: 5,
  },
  field: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
    padding: 12,
    backgroundColor: colors.white,
  },
  hint: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 4,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.pale,
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 30,
    color: colors.blue,
    fontWeight: '700',
    overflow: 'hidden',
  },
});