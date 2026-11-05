import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert, Image, Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Button, Card, colors, Heading, styles } from '../components/UI';
import { useDriver } from '../context/DriverContext';
import { validatePersonal, validateVehicle } from '../utils/validation';

const initial = {
  name: '', document: '', phone: '', birthDate: '', gender: '', email: '', language: 'Español',
  category: '', plate: '', brand: '', model: '', year: '', color: '', capacity: '4',
  profilePhoto: '', vehiclePhoto: '',
};
const choices = {
  gender: ['Femenino', 'Masculino', 'Otro', 'Prefiero no decirlo'],
  language: ['Español', 'English'],
  category: ['Económico', 'XL', 'Premium'],
  color: ['Blanco', 'Negro', 'Gris', 'Rojo', 'Azul', 'Plateado', 'Otro'],
};
const categoryValue = { 'Económico': 'economy', XL: 'xl', Premium: 'premium' };
const categoryLabel = { economy: 'Económico', xl: 'XL', premium: 'Premium' };

function ErrorText({ children }) {
  return children ? <Text style={{ color: colors.red, fontSize: 12, marginTop: 5 }}>{children}</Text> : null;
}

function Field({ label, error, children }) {
  return <View style={{ marginBottom: 15 }}>
    <Text style={styles.label}>{label}</Text>
    {children}
    <ErrorText>{error}</ErrorText>
  </View>;
}

function OptionPicker({ value, options, onChange, placeholder = 'Selecciona una opción' }) {
  const [visible, setVisible] = useState(false);
  return <>
    <Pressable onPress={() => setVisible(true)} style={{ borderWidth: 1, borderColor: colors.line, borderRadius: 10, padding: 13, backgroundColor: 'white' }}>
      <Text style={{ color: value ? colors.navy : '#98A2B3' }}>{value || placeholder}　⌄</Text>
    </Pressable>
    <Modal transparent visible={visible} animationType="fade" onRequestClose={() => setVisible(false)}>
      <Pressable onPress={() => setVisible(false)} style={{ flex: 1, backgroundColor: '#00000066', justifyContent: 'center', padding: 25 }}>
        <Pressable onPress={() => {}} style={{ backgroundColor: 'white', borderRadius: 16, padding: 16 }}>
          <Text style={{ fontSize: 17, fontWeight: '800', color: colors.navy, marginBottom: 10 }}>Selecciona una opción</Text>
          {options.map(option => <Pressable key={option} onPress={() => { onChange(option); setVisible(false); }} style={{ paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: colors.line }}>
            <Text style={{ color: value === option ? colors.blue : colors.navy, fontWeight: value === option ? '700' : '400' }}>{option}</Text>
          </Pressable>)}
          <Button title="Cancelar" secondary onPress={() => setVisible(false)} />
        </Pressable>
      </Pressable>
    </Modal>
  </>;
}

function DatePicker({ value, onChange }) {
  const [visible, setVisible] = useState(false);
  const [day, setDay] = useState(value ? value.slice(8, 10) : '');
  const [month, setMonth] = useState(value ? value.slice(5, 7) : '');
  const [year, setYear] = useState(value ? value.slice(0, 4) : '');
  const save = () => {
    const date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    const parsed = new Date(`${date}T00:00:00`);
    if (!/^\d{4}$/.test(year) || !/^\d{1,2}$/.test(month) || !/^\d{1,2}$/.test(day) || Number(month) < 1 || Number(month) > 12 || Number(day) < 1 || Number(day) > 31 || Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
      Alert.alert('Fecha no válida', 'Revisa el día, mes y año.');
      return;
    }
    onChange(date);
    setVisible(false);
  };
  return <>
    <Pressable onPress={() => setVisible(true)} style={{ borderWidth: 1, borderColor: colors.line, borderRadius: 10, padding: 13, backgroundColor: 'white' }}>
      <Text style={{ color: value ? colors.navy : '#98A2B3' }}>{value || 'Selecciona tu fecha de nacimiento'}　▦</Text>
    </Pressable>
    <Modal transparent visible={visible} animationType="fade" onRequestClose={() => setVisible(false)}>
      <View style={{ flex: 1, backgroundColor: '#00000066', justifyContent: 'center', padding: 24 }}>
        <View style={{ backgroundColor: 'white', padding: 18, borderRadius: 16 }}>
          <Text style={{ fontSize: 17, fontWeight: '800', color: colors.navy, marginBottom: 14 }}>Fecha de nacimiento</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {[['Día', day, setDay, '2'], ['Mes', month, setMonth, '2'], ['Año', year, setYear, '4']].map(([label, val, setter, max]) => <View key={label} style={{ flex: label === 'Año' ? 1.5 : 1 }}>
              <Text style={styles.label}>{label}</Text>
              <TextInput value={val} onChangeText={v => setter(v.replace(/\D/g, '').slice(0, Number(max)))} keyboardType="number-pad" placeholder={label === 'Día' ? 'DD' : label === 'Mes' ? 'MM' : 'AAAA'} style={{ borderWidth: 1, borderColor: colors.line, borderRadius: 9, padding: 11, color: colors.navy }} />
            </View>)}
          </View>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
            <View style={{ flex: 1 }}><Button title="Cancelar" secondary onPress={() => setVisible(false)} /></View>
            <View style={{ flex: 1 }}><Button title="Guardar fecha" onPress={save} /></View>
          </View>
        </View>
      </View>
    </Modal>
  </>;
}

async function choosePhoto(setPhoto) {
  Alert.alert('Seleccionar fotografía', '¿De dónde deseas obtener la imagen?', [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Galería', onPress: async () => {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) return Alert.alert('Permiso necesario', 'Autoriza el acceso a tus fotos para continuar.');
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, quality: 0.75 });
      if (!result.canceled) setPhoto(result.assets[0].uri);
    } },
    { text: 'Cámara', onPress: async () => {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) return Alert.alert('Permiso necesario', 'Autoriza el uso de la cámara para continuar.');
      const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.75 });
      if (!result.canceled) setPhoto(result.assets[0].uri);
    } },
  ]);
}

function PhotoField({ label, value, onPress, error, help }) {
  return <Field label={label} error={error}>
    <Pressable onPress={onPress} style={{ borderWidth: 1, borderStyle: 'dashed', borderColor: error ? colors.red : colors.line, borderRadius: 12, padding: 12, alignItems: 'center', backgroundColor: '#FCFCFD' }}>
      {value ? <Image source={{ uri: value }} style={{ width: '100%', height: 155, borderRadius: 9 }} resizeMode="cover" /> : <>
        <Text style={{ fontSize: 28, color: colors.blue }}>＋</Text>
        <Text style={{ color: colors.blue, fontWeight: '700' }}>Tomar foto o elegir de galería</Text>
      </>}
      <Text style={{ color: colors.gray, fontSize: 12, marginTop: 7 }}>{value ? 'Toca para cambiar la foto' : help}</Text>
    </Pressable>
  </Field>;
}

export default function RegistrationScreen() {
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const { setProfile } = useDriver();
  const update = (key, value) => setForm(current => ({ ...current, [key]: key === 'plate' ? value.toUpperCase().replace(/\s/g, '').slice(0, 6) : value }));
  const validateCurrent = () => {
    const nextErrors = tab === 0 ? validatePersonal(form) : validateVehicle(form);
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };
  const nextTab = () => { if (validateCurrent()) { setTab(1); setErrors({}); } };
  const saveDraft = () => {
    if (!validateCurrent()) return;
    // Guardamos el avance localmente en el contexto; no enviamos el registro final.
    setProfile(form);
    Alert.alert('Primera entrega completada', 'Los datos personales y del vehículo están completos. La pestaña de documentos y el envío final corresponden a la siguiente entrega.');
  };
  const input = (key, placeholder, keyboardType = 'default', maxLength) => <TextInput
    value={form[key]} onChangeText={value => update(key, value)} placeholder={placeholder}
    keyboardType={keyboardType} maxLength={maxLength} autoCapitalize={key === 'email' ? 'none' : key === 'plate' || key === 'name' || key === 'brand' || key === 'model' ? 'characters' : 'none'}
    style={{ borderWidth: 1, borderColor: errors[key] ? colors.red : colors.line, borderRadius: 10, padding: 12, color: colors.navy, backgroundColor: 'white' }}
  />;

  return <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 30 }} keyboardShouldPersistTaps="handled">
    <Heading>Registro del conductor</Heading>
    <Text style={styles.subtitle}>Primera entrega: completa tus datos personales y la información del vehículo.</Text>
    <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
      {['Datos personales', 'Vehículo'].map((title, index) => <Pressable key={title} onPress={() => { if (index === 0 || validateCurrent()) { setTab(index); setErrors({}); } }} style={{ flex: 1, padding: 12, borderRadius: 10, backgroundColor: tab === index ? colors.blue : '#EAECF0' }}>
        <Text style={{ textAlign: 'center', fontSize: 12, fontWeight: '700', color: tab === index ? 'white' : colors.navy }}>{index + 1}. {title}</Text>
      </Pressable>)}
    </View>
    <Card>
      {tab === 0 ? <>
        <Heading small>1. Datos personales</Heading>
        <PhotoField label="Foto de perfil *" value={form.profilePhoto} onPress={() => choosePhoto(uri => update('profilePhoto', uri))} error={errors.profilePhoto} help="Tu rostro debe verse claramente." />
        <Field label="Nombre completo *" error={errors.name}>{input('name', 'Ej. Kevin Pérez', 'default', 50)}</Field>
        <Field label="Documento de identidad *" error={errors.document}>{input('document', 'Entre 6 y 10 dígitos', 'number-pad', 10)}</Field>
        <Field label="Número de celular *" error={errors.phone}>{input('phone', '10 dígitos', 'phone-pad', 10)}</Field>
        <Field label="Fecha de nacimiento *" error={errors.birthDate}><DatePicker value={form.birthDate} onChange={value => update('birthDate', value)} /></Field>
        <Field label="Género *" error={errors.gender}><OptionPicker value={form.gender} options={choices.gender} onChange={value => update('gender', value)} /></Field>
        <Field label="Correo electrónico *" error={errors.email}>{input('email', 'correo@ejemplo.com')}</Field>
        <Field label="Idioma *" error={errors.language}><OptionPicker value={form.language} options={choices.language} onChange={value => update('language', value)} /></Field>
        <Button title="Continuar a Vehículo" onPress={nextTab} />
      </> : <>
        <Heading small>2. Información del vehículo</Heading>
        <Field label="Categoría *" error={errors.category}><OptionPicker value={categoryLabel[form.category] || ''} options={choices.category} onChange={value => update('category', categoryValue[value])} /></Field>
        <Field label="Placa *" error={errors.plate}>{input('plate', 'ABC123', 'default', 6)}</Field>
        <Field label="Marca *" error={errors.brand}>{input('brand', 'Ej. Chevrolet', 'default', 30)}</Field>
        <Field label="Modelo *" error={errors.model}>{input('model', 'Ej. Onix', 'default', 30)}</Field>
        <Field label="Año *" error={errors.year}>{input('year', 'Ej. 2022', 'number-pad', 4)}</Field>
        <Field label="Color *" error={errors.color}><OptionPicker value={form.color} options={choices.color} onChange={value => update('color', value)} /></Field>
        <Field label="Capacidad de pasajeros *" error={errors.capacity}>{input('capacity', 'Ej. 4', 'number-pad', 2)}</Field>
        <PhotoField label="Foto del vehículo *" value={form.vehiclePhoto} onPress={() => choosePhoto(uri => update('vehiclePhoto', uri))} error={errors.vehiclePhoto} help="Toma la foto de forma que la placa quede visible." />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <View style={{ flex: 1 }}><Button title="Anterior" secondary onPress={() => { setTab(0); setErrors({}); }} /></View>
          <View style={{ flex: 1 }}><Button title="Guardar avance" onPress={saveDraft} /></View>
        </View>
      </>}
    </Card>
    <Text style={styles.subtitle}>* Campos obligatorios. En esta entrega no se envía el registro ni se activa el conductor: falta implementar Documentos y pagos.</Text>
  </ScrollView>;
}
