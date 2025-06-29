import { AiFillGithub, AiFillLinkedin, AiOutlineTwitter } from 'react-icons/ai';
import { v4 as uuid } from 'uuid';

export const FOOTER_LINKS = [
  {
    id: 1,
    icon: <AiOutlineTwitter />,
    url: 'https://twitter.com/Swastik2001',
  },
  {
    id: 2,
    icon: <AiFillLinkedin />,
    url: 'https://www.linkedin.com/in/swastik-patro-2a54bb19b/',
  },
  {
    id: 3,
    icon: <AiFillGithub />,
    url: 'https://github.com/swastikpatro',
  },
];

export const ToastType = {
  Warn: 'warn',
  Info: 'info',
  Success: 'success',
  Error: 'error',
};

export const SORT_TYPE = {
  PRICE_LOW_TO_HIGH: 'precio: menor a mayor',
  PRICE_HIGH_TO_LOW: 'precio: mayor a menor',
  NAME_A_TO_Z: 'nombre: a a z',
  NAME_Z_TO_A: 'nombre: z a a',
};

export const RATINGS = [4, 3, 2, 1];

// Usuario de prueba predefinido para login como invitado
export const TEST_USER = {
  email: 'jethalal.gada@gmail.com',
  password: 'babitaji1234',
};

// Super administrador
export const SUPER_ADMIN = {
  email: 'admin@gadaelectronics.com',
  password: 'root',
};

// Usuario alternativo para pruebas
export const GUEST_USER = {
  email: 'invitado@tienda.com',
  password: '123456',
};

export const LOCAL_STORAGE_KEYS = {
  User: 'user',
  Token: 'token',
  StoreConfig: 'storeConfig',
};

export const LOGIN_CLICK_TYPE = {
  GuestClick: 'guest',
  RegisterClick: 'register',
  AdminClick: 'admin',
};

export const INCREMENT_DECRMENT_TYPE = {
  INCREMENT: 'increment',
  DECREMENT: 'decrement',
};

export const FILTER_INPUT_TYPE = {
  PRICE: 'price',
  COMPANY: 'company',
  SORT: 'sortByOption',
  RATING: 'rating',
  CATEGORY: 'category',
};

export const DELAY_TO_SHOW_LOADER = 500;

export const DELAY_DEBOUNCED_MS = 250;

export const TOTAL_SKELETONS_LENGTH = 10;

export const DELAY_BETWEEN_BLUR_AND_CLICK = 250;

export const CUSTOM_TOASTID = 1;

export const ITEMS_PER_PAGE = 9;

export const ALL_STATES = [
  'Andalucía',
  'Aragón',
  'Asturias',
  'Baleares',
  'Canarias',
  'Cantabria',
  'Castilla-La Mancha',
  'Castilla y León',
  'Cataluña',
  'Ceuta',
  'Comunidad de Madrid',
  'Comunidad Foral de Navarra',
  'Comunidad Valenciana',
  'Extremadura',
  'Galicia',
  'La Rioja',
  'Melilla',
  'País Vasco',
  'Región de Murcia',
];

// Tipos de servicio
export const SERVICE_TYPES = {
  HOME_DELIVERY: 'home_delivery',
  PICKUP: 'pickup'
};

// CONFIGURACIÓN DINÁMICA DESDE JSON
// Estas constantes se cargan dinámicamente desde el archivo JSON de configuración
// y se actualizan automáticamente cuando se modifica la configuración

// Zonas de Santiago de Cuba con costos de entrega (se cargan desde JSON)
export const SANTIAGO_ZONES = [
  { id: 'centro', name: 'Centro Histórico', cost: 50 },
  { id: 'vista_alegre', name: 'Vista Alegre', cost: 75 },
  { id: 'sueno', name: 'Sueño', cost: 60 },
  { id: 'san_pedrito', name: 'San Pedrito', cost: 80 },
  { id: 'altamira', name: 'Altamira', cost: 70 },
  { id: 'reparto_flores', name: 'Reparto Flores', cost: 65 },
  { id: 'chicharrones', name: 'Chicharrones', cost: 85 },
  { id: 'los_olmos', name: 'Los Olmos', cost: 90 },
  { id: 'santa_barbara', name: 'Santa Bárbara', cost: 95 },
  { id: 'micro_9', name: 'Micro 9', cost: 100 },
  { id: 'micro_4', name: 'Micro 4', cost: 100 },
  { id: 'alameda', name: 'Alameda', cost: 55 },
  { id: 'puerto', name: 'Puerto', cost: 45 },
  { id: 'siboney', name: 'Siboney', cost: 120 },
  { id: 'ciudamar', name: 'Ciudamar', cost: 110 },
];

// Cupones de descuento (se cargan desde JSON)
export const COUPONS = [
  {
    id: uuid(),
    couponCode: 'DAYA01',
    text: '30% Descuento',
    discountPercent: 30,
    minCartPriceRequired: 150000,
  },
  {
    id: uuid(),
    couponCode: 'BABITA02',
    text: '20% Descuento',
    discountPercent: 20,
    minCartPriceRequired: 100000,
  },
  {
    id: uuid(),
    couponCode: 'TAPU03',
    text: '10% Descuento',
    discountPercent: 10,
    minCartPriceRequired: 50000,
  },
  {
    id: uuid(),
    couponCode: 'BAPUJI04',
    text: '5% Descuento',
    discountPercent: 5,
    minCartPriceRequired: 20000,
  },
];

export const CHARGE_AND_DISCOUNT = {
  deliveryCharge: 0, // Gratis por defecto
  discount: 0, // Sin descuento por defecto
};

export const MIN_DISTANCE_BETWEEN_THUMBS = 1000;

export const MAX_RESPONSES_IN_CACHE_TO_STORE = 50;

// WhatsApp de la tienda (se carga desde JSON)
export const STORE_WHATSAPP = '+53 54690878';

// Configuración por defecto de la tienda (se carga desde JSON)
export const DEFAULT_STORE_CONFIG = {
  storeInfo: {
    storeName: 'Gada Electronics',
    whatsappNumber: '+53 54690878',
    storeAddressId: 'store-main-address',
  },
  coupons: COUPONS,
  zones: SANTIAGO_ZONES,
  products: [],
  categories: [],
  lastModified: new Date().toISOString(),
  version: '1.0.0'
};

// Códigos de países para validación de WhatsApp
export const COUNTRY_CODES = [
  { code: '+1', country: 'Estados Unidos/Canadá', flag: '🇺🇸' },
  { code: '+7', country: 'Rusia', flag: '🇷🇺' },
  { code: '+20', country: 'Egipto', flag: '🇪🇬' },
  { code: '+27', country: 'Sudáfrica', flag: '🇿🇦' },
  { code: '+30', country: 'Grecia', flag: '🇬🇷' },
  { code: '+31', country: 'Países Bajos', flag: '🇳🇱' },
  { code: '+32', country: 'Bélgica', flag: '🇧🇪' },
  { code: '+33', country: 'Francia', flag: '🇫🇷' },
  { code: '+34', country: 'España', flag: '🇪🇸' },
  { code: '+36', country: 'Hungría', flag: '🇭🇺' },
  { code: '+39', country: 'Italia', flag: '🇮🇹' },
  { code: '+40', country: 'Rumania', flag: '🇷🇴' },
  { code: '+41', country: 'Suiza', flag: '🇨🇭' },
  { code: '+43', country: 'Austria', flag: '🇦🇹' },
  { code: '+44', country: 'Reino Unido', flag: '🇬🇧' },
  { code: '+45', country: 'Dinamarca', flag: '🇩🇰' },
  { code: '+46', country: 'Suecia', flag: '🇸🇪' },
  { code: '+47', country: 'Noruega', flag: '🇳🇴' },
  { code: '+48', country: 'Polonia', flag: '🇵🇱' },
  { code: '+49', country: 'Alemania', flag: '🇩🇪' },
  { code: '+51', country: 'Perú', flag: '🇵🇪' },
  { code: '+52', country: 'México', flag: '🇲🇽' },
  { code: '+53', country: 'Cuba', flag: '🇨🇺' },
  { code: '+54', country: 'Argentina', flag: '🇦🇷' },
  { code: '+55', country: 'Brasil', flag: '🇧🇷' },
  { code: '+56', country: 'Chile', flag: '🇨🇱' },
  { code: '+57', country: 'Colombia', flag: '🇨🇴' },
  { code: '+58', country: 'Venezuela', flag: '🇻🇪' },
  { code: '+60', country: 'Malasia', flag: '🇲🇾' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+62', country: 'Indonesia', flag: '🇮🇩' },
  { code: '+63', country: 'Filipinas', flag: '🇵🇭' },
  { code: '+64', country: 'Nueva Zelanda', flag: '🇳🇿' },
  { code: '+65', country: 'Singapur', flag: '🇸🇬' },
  { code: '+66', country: 'Tailandia', flag: '🇹🇭' },
  { code: '+81', country: 'Japón', flag: '🇯🇵' },
  { code: '+82', country: 'Corea del Sur', flag: '🇰🇷' },
  { code: '+84', country: 'Vietnam', flag: '🇻🇳' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+90', country: 'Turquía', flag: '🇹🇷' },
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+92', country: 'Pakistán', flag: '🇵🇰' },
  { code: '+93', country: 'Afganistán', flag: '🇦🇫' },
  { code: '+94', country: 'Sri Lanka', flag: '🇱🇰' },
  { code: '+95', country: 'Myanmar', flag: '🇲🇲' },
  { code: '+98', country: 'Irán', flag: '🇮🇷' },
];

// Función para obtener configuración actualizada desde JSON
export const getConfigFromJSON = async () => {
  try {
    const response = await fetch('/gada-electronics-config-2025-06-28.json');
    const config = await response.json();
    return config;
  } catch (error) {
    console.error('Error al cargar configuración desde JSON:', error);
    return DEFAULT_STORE_CONFIG;
  }
};

// Función para actualizar constantes dinámicamente desde JSON
export const updateConstantsFromJSON = async () => {
  try {
    const config = await getConfigFromJSON();
    
    // Actualizar zonas dinámicamente
    if (config.zones && config.zones.length > 0) {
      SANTIAGO_ZONES.length = 0; // Limpiar array
      SANTIAGO_ZONES.push(...config.zones);
    }
    
    // Actualizar cupones dinámicamente
    if (config.coupons && config.coupons.length > 0) {
      COUPONS.length = 0; // Limpiar array
      COUPONS.push(...config.coupons);
    }
    
    // Actualizar WhatsApp dinámicamente
    if (config.storeInfo && config.storeInfo.whatsappNumber) {
      // No se puede reasignar const, pero se puede usar en el contexto
      return config.storeInfo.whatsappNumber;
    }
    
    return config;
  } catch (error) {
    console.error('Error al actualizar constantes desde JSON:', error);
    return DEFAULT_STORE_CONFIG;
  }
};