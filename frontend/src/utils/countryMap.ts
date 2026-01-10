// Country Code to Full Name Mapping
// ISO 3166-1 alpha-2 codes to full country names

export const COUNTRY_NAMES: Record<string, string> = {
  // Americas
  'AR': 'Argentina',
  'BR': 'Brazil',
  'CA': 'Canada',
  'CL': 'Chile',
  'CO': 'Colombia',
  'MX': 'Mexico',
  'US': 'United States',
  'VE': 'Venezuela',
  'PE': 'Peru',
  
  // Europe
  'DE': 'Germany',
  'ES': 'Spain',
  'FR': 'France',
  'GB': 'United Kingdom',
  'GR': 'Greece',
  'IT': 'Italy',
  'NL': 'Netherlands',
  'PL': 'Poland',
  'PT': 'Portugal',
  'RU': 'Russia',
  'SE': 'Sweden',
  'TR': 'Turkey',
  'UA': 'Ukraine',
  
  // Asia
  'BD': 'Bangladesh',
  'CN': 'China',
  'ID': 'Indonesia',
  'IN': 'India',
  'JP': 'Japan',
  'KR': 'South Korea',
  'MY': 'Malaysia',
  'PH': 'Philippines',
  'PK': 'Pakistan',
  'SA': 'Saudi Arabia',
  'SG': 'Singapore',
  'TH': 'Thailand',
  'VN': 'Vietnam',
  'AE': 'United Arab Emirates',
  
  // Africa
  'EG': 'Egypt',
  'KE': 'Kenya',
  'MA': 'Morocco',
  'NG': 'Nigeria',
  'ZA': 'South Africa',
  
  // Oceania
  'AU': 'Australia',
  'NZ': 'New Zealand',
  
  // Other
  'IL': 'Israel',
  'HK': 'Hong Kong',
  'TW': 'Taiwan',
};

// Country flag emojis (optional)
export const COUNTRY_FLAGS: Record<string, string> = {
  'AR': '🇦🇷',
  'BR': '🇧🇷',
  'CA': '🇨🇦',
  'CL': '🇨🇱',
  'CO': '🇨🇴',
  'MX': '🇲🇽',
  'US': '🇺🇸',
  'DE': '🇩🇪',
  'ES': '🇪🇸',
  'FR': '🇫🇷',
  'GB': '🇬🇧',
  'GR': '🇬🇷',
  'IT': '🇮🇹',
  'NL': '🇳🇱',
  'PL': '🇵🇱',
  'PT': '🇵🇹',
  'RU': '🇷🇺',
  'SE': '🇸🇪',
  'TR': '🇹🇷',
  'UA': '🇺🇦',
  'BD': '🇧🇩',
  'CN': '🇨🇳',
  'ID': '🇮🇩',
  'IN': '🇮🇳',
  'JP': '🇯🇵',
  'KR': '🇰🇷',
  'MY': '🇲🇾',
  'PH': '🇵🇭',
  'PK': '🇵🇰',
  'SA': '🇸🇦',
  'SG': '🇸🇬',
  'TH': '🇹🇭',
  'VN': '🇻🇳',
  'AE': '🇦🇪',
  'EG': '🇪🇬',
  'KE': '🇰🇪',
  'MA': '🇲🇦',
  'NG': '🇳🇬',
  'ZA': '🇿🇦',
  'AU': '🇦🇺',
  'NZ': '🇳🇿',
  'IL': '🇮🇱',
  'HK': '🇭🇰',
  'TW': '🇹🇼',
};

/**
 * Get full country name from country code
 * @param code - ISO 3166-1 alpha-2 country code (e.g., "US", "JP")
 * @returns Full country name (e.g., "United States", "Japan")
 */
export const getCountryName = (code?: string): string => {
  if (!code) return 'Unknown';
  const upperCode = code.toUpperCase();
  return COUNTRY_NAMES[upperCode] || code; // Fallback to code if not found
};

/**
 * Get country flag emoji
 * @param code - ISO 3166-1 alpha-2 country code
 * @returns Flag emoji or empty string
 */
export const getCountryFlag = (code?: string): string => {
  if (!code) return '';
  const upperCode = code.toUpperCase();
  return COUNTRY_FLAGS[upperCode] || '';
};

/**
 * Get country with flag (formatted)
 * @param code - ISO 3166-1 alpha-2 country code
 * @param includeFlag - Whether to include flag emoji
 * @returns Formatted country name with optional flag
 */
export const getCountryDisplay = (code?: string, includeFlag = false): string => {
  if (!code) return 'Unknown';
  const name = getCountryName(code);
  if (includeFlag) {
    const flag = getCountryFlag(code);
    return flag ? `${flag} ${name}` : name;
  }
  return name;
};

/**
 * Get all available countries (sorted alphabetically)
 */
export const getAllCountries = (): Array<{ code: string; name: string; flag: string }> => {
  return Object.entries(COUNTRY_NAMES)
    .map(([code, name]) => ({
      code,
      name,
      flag: COUNTRY_FLAGS[code] || '',
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

