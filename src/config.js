// Central configuration for the IbaChic storefront.

// WhatsApp business number in international format, digits only (no +, spaces).
export const WHATSAPP_NUMBER = '21629200623'

// Django API base URL. Override with VITE_API_BASE in a .env file if needed.
export const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000'

export const CATEGORIES = ['women', 'men', 'kids', 'accessories']

// Secret admin page route. Not linked anywhere in the public UI.
// Change this value to rename the hidden management URL.
export const ADMIN_PATH = '/gestion-ibachic'

export const LANGUAGES = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'العربية' },
]
