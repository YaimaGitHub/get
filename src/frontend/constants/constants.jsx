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

export const LOCAL_STORAGE_KEYS = {
  User: 'user',
  Token: 'token',
};

export const LOGIN_CLICK_TYPE = {
  GuestClick: 'guest',
  RegisterClick: 'register',
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
  deliveryCharge: 100,
  discount: -200,
};

export const MIN_DISTANCE_BETWEEN_THUMBS = 1000;

export const MAX_RESPONSES_IN_CACHE_TO_STORE = 50;