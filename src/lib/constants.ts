export const SITE = {
  name: 'Free Space Factory',
  tagline: 'Liberi di spaziare',
  legalName: 'Free Space Factory',
  description:
    'Free Space Factory: studio di architetti a Roma fondato da Flavia Rosano e Laura Gramaccini. Progettazione, ristrutturazioni e lavori di interior design a Roma.',
  url: 'https://www.freespacefactory.it',
  email: 'info@freespacefactory.it',
  city: 'Roma',
  country: 'IT',
  foundingYear: 2019,
  founders: ['Flavia Rosano', 'Laura Gramaccini'],
  // TODO: replace with the studio's real street address once available, to
  // strengthen local SEO (Google Business Profile / Maps consistency).
  addressLocality: 'Roma',
  addressRegion: 'RM',
  // TODO: replace with your real Web3Forms access key (free, no account/password —
  // get one at https://web3forms.com by entering info@freespacefactory.it).
  // Until then, the contact form on /contatti/ will not deliver messages.
  web3formsAccessKey: 'YOUR_WEB3FORMS_ACCESS_KEY',
} as const;

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/lo-studio/', label: 'Lo Studio' },
  { href: '/architetti/', label: 'Architetti' },
  { href: '/servizi/', label: 'Servizi' },
  { href: '/chiavi-in-mano/', label: 'Chiavi in Mano' },
  { href: '/progetti/', label: 'Progetti' },
  { href: '/contatti/', label: 'Contatti' },
] as const;
