// WebCash Payment Integration
// Uses backend API to avoid CORS issues and keep API keys secure

// Backend API URL - change this to your deployed backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

interface CollectResponse {
  success: boolean;
  transaction_id?: string;
  status?: string;
  message?: string;
  error?: string;
  otp_required?: boolean;
}

// Check if backend is configured
export const isBackendConfigured = !!API_BASE_URL;

// Mobile Money Operators by Country
export const MOBILE_MONEY_OPERATORS: Record<string, { name: string; code: string }[]> = {
  CM: [
    { name: 'MTN Mobile Money', code: 'MTN' },
    { name: 'Orange Money', code: 'ORANGE' }
  ],
  NG: [
    { name: 'MTN Mobile Money', code: 'MTN' },
    { name: 'Airtel Money', code: 'AIRTEL' }
  ],
  KE: [
    { name: 'M-Pesa', code: 'MPESA' },
    { name: 'Airtel Money', code: 'AIRTEL' }
  ],
  GH: [
    { name: 'MTN Mobile Money', code: 'MTN' },
    { name: 'Vodafone Cash', code: 'VODAFONE' },
    { name: 'AirtelTigo Money', code: 'AIRTELTIGO' }
  ],
  CI: [
    { name: 'Orange Money', code: 'ORANGE' },
    { name: 'MTN Mobile Money', code: 'MTN' },
    { name: 'Moov Money', code: 'MOOV' }
  ],
  SN: [
    { name: 'Orange Money', code: 'ORANGE' },
    { name: 'Wave', code: 'WAVE' },
    { name: 'Free Money', code: 'FREE' }
  ],
  MG: [
    { name: 'MVola', code: 'MVOLA' },
    { name: 'Orange Money', code: 'ORANGE' },
    { name: 'Airtel Money', code: 'AIRTEL' }
  ],
  UG: [
    { name: 'MTN Mobile Money', code: 'MTN' },
    { name: 'Airtel Money', code: 'AIRTEL' }
  ],
  TZ: [
    { name: 'M-Pesa', code: 'MPESA' },
    { name: 'Airtel Money', code: 'AIRTEL' },
    { name: 'Tigo Pesa', code: 'TIGO' }
  ],
  RW: [
    { name: 'MTN Mobile Money', code: 'MTN' },
    { name: 'Airtel Money', code: 'AIRTEL' }
  ],
  ZA: [
    { name: 'Vodapay', code: 'VODA' },
    { name: 'MTN Mobile Money', code: 'MTN' }
  ],
  CD: [
    { name: 'M-Pesa', code: 'MPESA' },
    { name: 'Orange Money', code: 'ORANGE' },
    { name: 'Airtel Money', code: 'AIRTEL' }
  ],
  ML: [
    { name: 'Orange Money', code: 'ORANGE' },
    { name: 'Moov Money', code: 'MOOV' }
  ],
  BF: [
    { name: 'Orange Money', code: 'ORANGE' },
    { name: 'Moov Money', code: 'MOOV' }
  ],
  GN: [
    { name: 'Orange Money', code: 'ORANGE' },
    { name: 'MTN Mobile Money', code: 'MTN' }
  ],
  TG: [
    { name: 'T-Money', code: 'TMONEY' },
    { name: 'Flooz', code: 'FLOOZ' }
  ],
  BJ: [
    { name: 'MTN Mobile Money', code: 'MTN' },
    { name: 'Moov Money', code: 'MOOV' }
  ],
  NE: [
    { name: 'Airtel Money', code: 'AIRTEL' },
    { name: 'Moov Money', code: 'MOOV' }
  ]
};

// Supported Currencies
export const CURRENCIES: Record<string, { code: string; symbol: string; rate: number; name: string }> = {
  XAF: { code: 'XAF', symbol: 'FCFA', rate: 1, name: 'CFA Franc (Central)' },
  XOF: { code: 'XOF', symbol: 'FCFA', rate: 1, name: 'CFA Franc (West)' },
  USD: { code: 'USD', symbol: '$', rate: 0.00167, name: 'US Dollar' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.00152, name: 'Euro' },
  NGN: { code: 'NGN', symbol: '₦', rate: 2.5, name: 'Nigerian Naira' },
  KES: { code: 'KES', symbol: 'KSh', rate: 0.21, name: 'Kenyan Shilling' },
  GHS: { code: 'GHS', symbol: 'GH₵', rate: 0.026, name: 'Ghanaian Cedi' },
  CDF: { code: 'CDF', symbol: 'FC', rate: 4.8, name: 'Congolese Franc' },
  ZAR: { code: 'ZAR', symbol: 'R', rate: 0.031, name: 'South African Rand' },
  UGX: { code: 'UGX', symbol: 'USh', rate: 6.1, name: 'Ugandan Shilling' },
  TZS: { code: 'TZS', symbol: 'TSh', rate: 4.2, name: 'Tanzanian Shilling' },
  RWF: { code: 'RWF', symbol: 'FRw', rate: 2.5, name: 'Rwandan Franc' },
  MGA: { code: 'MGA', symbol: 'Ar', rate: 7.5, name: 'Malagasy Ariary' }
};

// Country information
export const COUNTRIES = [
  { code: 'CM', name: 'Cameroon', flag: '🇨🇲', currency: 'XAF', phonePrefix: '+237' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', currency: 'NGN', phonePrefix: '+234' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', currency: 'KES', phonePrefix: '+254' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', currency: 'GHS', phonePrefix: '+233' },
  { code: 'CI', name: 'Ivory Coast', flag: '🇨🇮', currency: 'XOF', phonePrefix: '+225' },
  { code: 'SN', name: 'Senegal', flag: '🇸🇳', currency: 'XOF', phonePrefix: '+221' },
  { code: 'MG', name: 'Madagascar', flag: '🇲🇬', currency: 'MGA', phonePrefix: '+261' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬', currency: 'UGX', phonePrefix: '+256' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', currency: 'TZS', phonePrefix: '+255' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼', currency: 'RWF', phonePrefix: '+250' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', currency: 'ZAR', phonePrefix: '+27' },
  { code: 'CD', name: 'DR Congo', flag: '🇨🇩', currency: 'CDF', phonePrefix: '+243' },
  { code: 'ML', name: 'Mali', flag: '🇲🇱', currency: 'XOF', phonePrefix: '+223' },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫', currency: 'XOF', phonePrefix: '+226' },
  { code: 'TG', name: 'Togo', flag: '🇹🇬', currency: 'XOF', phonePrefix: '+228' },
  { code: 'BJ', name: 'Benin', flag: '🇧🇯', currency: 'XOF', phonePrefix: '+229' },
  { code: 'NE', name: 'Niger', flag: '🇳🇪', currency: 'XOF', phonePrefix: '+227' }
];

// Base amount in XAF
export const BASE_AMOUNT_XAF = 1800;

// Convert currency
export const convertCurrency = (amountXAF: number, toCurrency: string): number => {
  const currency = CURRENCIES[toCurrency];
  if (!currency) return amountXAF;
  return Math.round(amountXAF * currency.rate * 100) / 100;
};

// Format phone number for API (local format without country code)
export const formatPhoneForAPI = (phone: string, countryCode: string): string => {
  const country = COUNTRIES.find(c => c.code === countryCode);
  if (!country) return phone;
  
  let cleanPhone = phone.replace(/\D/g, '');
  const prefix = country.phonePrefix.replace('+', '');
  
  if (cleanPhone.startsWith(prefix)) {
    cleanPhone = cleanPhone.substring(prefix.length);
  }
  
  if (cleanPhone.startsWith('0')) {
    cleanPhone = cleanPhone.substring(1);
  }
  
  return cleanPhone;
};

// Generate unique transaction reference
export const generateReference = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `WC-${timestamp}-${random}`.toUpperCase();
};

/**
 * Fetch supported countries from backend
 */
export const fetchCountries = async (): Promise<{
  success: boolean;
  data?: unknown[];
  error?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/countries`);
    return await response.json();
  } catch (error) {
    return { success: false, error: 'Failed to fetch countries' };
  }
};

/**
 * Fetch transaction fees from backend
 */
export const fetchFees = async (): Promise<{
  success: boolean;
  data?: unknown;
  error?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/fees`);
    return await response.json();
  } catch (error) {
    return { success: false, error: 'Failed to fetch fees' };
  }
};

/**
 * Initiate a payment collection
 * POST /api/pay
 */
export const initiateCollect = async (params: {
  amount: number;
  currency: string;
  phone: string;
  operator: string;
  country_code?: string;
  reference?: string;
  user_id?: string;
}): Promise<CollectResponse> => {
  
  if (!API_BASE_URL) {
    return {
      success: false,
      error: 'Backend API URL not configured. Please set VITE_API_URL in environment variables.'
    };
  }

  const reference = params.reference || generateReference();

  console.log('[Payment] Initiating payment:', {
    amount: params.amount,
    currency: params.currency,
    operator: params.operator,
    reference
  });

  try {
    const response = await fetch(`${API_BASE_URL}/api/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: params.amount,
        currency: params.currency,
        phone: params.phone,
        operator: params.operator,
        country_code: params.country_code,
        reference,
        user_id: params.user_id
      })
    });

    const data = await response.json();

    console.log('[Payment] Response:', data);

    if (response.ok && data.success) {
      return {
        success: true,
        transaction_id: data.transaction_id,
        status: data.status || 'pending',
        message: data.message || 'Payment request sent. Please check your phone.',
        otp_required: data.otp_required
      };
    }

    return {
      success: false,
      error: data.error || data.message || `Payment failed (${response.status})`,
      message: data.message
    };

  } catch (error) {
    console.error('[Payment] Network error:', error);
    
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      return {
        success: false,
        error: 'Unable to connect to payment server. Please check your internet connection.'
      };
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
};

/**
 * Submit OTP for payment verification
 * POST /api/otp
 */
export const submitOtp = async (params: {
  otp: string;
  reference: string;
  amount?: number;
  currency?: string;
  phone?: string;
  operator?: string;
}): Promise<CollectResponse> => {
  
  if (!API_BASE_URL) {
    return { success: false, error: 'Backend API URL not configured' };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return {
        success: true,
        transaction_id: data.transaction_id,
        status: data.status || 'pending',
        message: data.message || 'OTP verified successfully'
      };
    }

    return {
      success: false,
      error: data.error || data.message || 'OTP verification failed'
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error'
    };
  }
};

/**
 * Check transaction status
 * GET /api/status/:id
 */
export const checkPaymentStatus = async (reference: string): Promise<{
  success: boolean;
  status: string;
  paid: boolean;
  transaction?: {
    status: string;
    amount?: number;
    reference?: string;
  };
}> => {
  if (!API_BASE_URL) {
    return { success: false, status: 'error', paid: false };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/status/${reference}`);
    const data = await response.json();

    return {
      success: data.success,
      status: data.ashtech_status || data.status || 'unknown',
      paid: data.ashtech_status === 'success' || 
            data.ashtech_status === 'completed' ||
            data.local_status === 'success',
      transaction: data.transaction
    };

  } catch {
    return { success: false, status: 'unknown', paid: false };
  }
};

// Helper functions
export const getOperatorsForCountry = (countryCode: string): { name: string; code: string }[] => {
  return MOBILE_MONEY_OPERATORS[countryCode] || [];
};

export const getCountryInfo = (countryCode: string) => {
  return COUNTRIES.find(c => c.code === countryCode);
};

export const getCurrencyInfo = (currencyCode: string) => {
  return CURRENCIES[currencyCode] || CURRENCIES.XAF;
};
