// Validaciones del registro del conductor (primera entrega: pestañas 1 y 2).
export const isEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());

export function isAdult(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false;
  const birth = new Date(`${value}T00:00:00`);
  if (Number.isNaN(birth.getTime()) || birth.toISOString().slice(0, 10) !== value) return false;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  if (today.getMonth() < birth.getMonth() ||
      (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--;
  return age >= 18;
}

export function validatePersonal(form) {
  const errors = {};
  if (!form.profilePhoto) errors.profilePhoto = 'Selecciona una foto de perfil.';
  if (!String(form.name || '').trim()) errors.name = 'El nombre es obligatorio.';
  else if (!/^[\p{L} ]{1,50}$/u.test(form.name.trim())) errors.name = 'Usa solo letras y espacios (máximo 50 caracteres).';
  if (!/^\d{6,10}$/.test(form.document || '')) errors.document = 'El documento debe tener entre 6 y 10 dígitos.';
  if (!/^\d{10}$/.test(form.phone || '')) errors.phone = 'El celular debe tener 10 dígitos.';
  if (!isAdult(form.birthDate)) errors.birthDate = 'Debes ingresar una fecha válida y tener al menos 18 años.';
  if (!form.gender) errors.gender = 'Selecciona tu género.';
  if (!isEmail(form.email)) errors.email = 'Ingresa un correo electrónico válido.';
  if (!form.language) errors.language = 'Selecciona un idioma.';
  return errors;
}

export function validateVehicle(form) {
  const errors = {};
  if (!form.category) errors.category = 'Selecciona una categoría.';
  if (!/^[A-Z]{3}\d{3}$/.test((form.plate || '').toUpperCase())) errors.plate = 'La placa debe tener el formato ABC123.';
  if (!String(form.brand || '').trim()) errors.brand = 'La marca es obligatoria.';
  else if (form.brand.trim().length > 30) errors.brand = 'Máximo 30 caracteres.';
  if (!String(form.model || '').trim()) errors.model = 'El modelo es obligatorio.';
  else if (form.model.trim().length > 30) errors.model = 'Máximo 30 caracteres.';
  if (!/^\d{4}$/.test(form.year || '') || Number(form.year) > new Date().getFullYear()) errors.year = 'Ingresa un año de 4 dígitos que no sea futuro.';
  if (!form.color) errors.color = 'Selecciona el color.';
  const capacity = Number(form.capacity);
  if (!/^\d+$/.test(String(form.capacity || '')) || capacity < 1) errors.capacity = 'Ingresa una capacidad válida.';
  else if (form.category === 'xl' && capacity < 6) errors.capacity = 'La categoría XL requiere mínimo 6 pasajeros.';
  if (!form.vehiclePhoto) errors.vehiclePhoto = 'Selecciona una foto del vehículo donde se vea la placa.';
  return errors;
}

// Se conserva para la fase posterior de documentos y pagos.
export function validateRegistration(form) {
  return { ...validatePersonal(form), ...validateVehicle(form) };
}