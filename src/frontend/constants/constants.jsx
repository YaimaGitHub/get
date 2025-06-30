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

export const TEST_USER = {
  email: 'jethalal.gada@gmail.com',
  password: 'babitaji1234',
};

export const SUPER_ADMIN = {
  email: 'admin@gadaelectronics.com',
  password: 'root',
};

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

export const SERVICE_TYPES = {
  HOME_DELIVERY: 'home_delivery',
  PICKUP: 'pickup'
};

// Zonas de Santiago de Cuba con costos de entrega - ACTUALIZADAS
export const SANTIAGO_ZONES = [
  {
    "id": "centro",
    "name": "Centro Histórico",
    "cost": 50
  },
  {
    "id": "vista_alegre",
    "name": "Vista Alegre",
    "cost": 75
  },
  {
    "id": "sueno",
    "name": "Sueño",
    "cost": 60
  },
  {
    "id": "san_pedrito",
    "name": "San Pedrito",
    "cost": 80
  },
  {
    "id": "altamira",
    "name": "Altamira",
    "cost": 70
  },
  {
    "id": "reparto_flores",
    "name": "Reparto Flores",
    "cost": 65
  },
  {
    "id": "chicharrones",
    "name": "Chicharrones",
    "cost": 85
  },
  {
    "id": "los_olmos",
    "name": "Los Olmos",
    "cost": 90
  },
  {
    "id": "santa_barbara",
    "name": "Santa Bárbara",
    "cost": 95
  },
  {
    "id": "micro_9",
    "name": "Micro 9",
    "cost": 100
  },
  {
    "id": "micro_4",
    "name": "Micro 4",
    "cost": 100
  },
  {
    "id": "alameda",
    "name": "Alameda",
    "cost": 55
  },
  {
    "id": "puerto",
    "name": "Puerto",
    "cost": 45
  },
  {
    "id": "siboney",
    "name": "Siboney",
    "cost": 120
  },
  {
    "id": "ciudamar",
    "name": "Ciudamar",
    "cost": 110
  }
];

// Cupones de descuento - ACTUALIZADOS
export const COUPONS = [
  {
    "couponCode": "PEPEP",
    "text": "100% Descuento",
    "discountPercent": 55,
    "minCartPriceRequired": 150000,
    "id": "b6c7a585-79a2-4fde-93cd-80422ef3acfa"
  },
  {
    "couponCode": "PEPE 2",
    "text": "20% Descuento",
    "discountPercent": 20,
    "minCartPriceRequired": 100000,
    "id": "ecdff7ad-f653-467f-9257-7fcd0fdea3a8"
  },
  {
    "couponCode": "PEPE 3",
    "text": "10% Descuento",
    "discountPercent": 10,
    "minCartPriceRequired": 50000,
    "id": "4898bd1c-7227-47b0-b6fe-32159f71072b"
  },
  {
    "couponCode": "PEPE 4",
    "text": "5% Descuento",
    "discountPercent": 5,
    "minCartPriceRequired": 20000,
    "id": "12ee6cb8-1d2d-463d-b9f7-78bcd415c2e4"
  }
];

export const CHARGE_AND_DISCOUNT = {
  deliveryCharge: 0,
  discount: 0,
};

export const MIN_DISTANCE_BETWEEN_THUMBS = 1000;
export const MAX_RESPONSES_IN_CACHE_TO_STORE = 50;

// WhatsApp de la tienda - ACTUALIZADO
export const STORE_WHATSAPP = '+53 54690878';

// Configuración por defecto de la tienda - ACTUALIZADA
export const DEFAULT_STORE_CONFIG = {
  "storeName": "Gada Electronicssss",
  "whatsappNumber": "+53 54690878",
  "storeAddressId": "store-main-address"
};

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
