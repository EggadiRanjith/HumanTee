/**
 * Phone Number Validation Utility
 * Country-specific phone number validation and formatting
 */

export interface PhoneValidationResult {
    isValid: boolean;
    error?: string;
}

export interface CountryPhoneRule {
    code: string;
    name: string;
    flag: string;
    pattern: RegExp;
    length: number | [number, number];
    placeholder: string;
}

export const COUNTRY_PHONE_RULES: Record<string, CountryPhoneRule> = {
    '+91': {
        code: '+91',
        name: 'India',
        flag: '🇮🇳',
        pattern: /^[6-9]\d{9}$/,
        length: 10,
        placeholder: '9876543210',
    },
    '+1': {
        code: '+1',
        name: 'US/Canada',
        flag: '🇺🇸',
        pattern: /^\d{10}$/,
        length: 10,
        placeholder: '5551234567',
    },
    '+44': {
        code: '+44',
        name: 'UK',
        flag: '🇬🇧',
        pattern: /^\d{10,11}$/,
        length: [10, 11],
        placeholder: '7700900000',
    },
    '+61': {
        code: '+61',
        name: 'Australia',
        flag: '🇦🇺',
        pattern: /^\d{9}$/,
        length: 9,
        placeholder: '412345678',
    },
    '+971': {
        code: '+971',
        name: 'UAE',
        flag: '🇦🇪',
        pattern: /^\d{9}$/,
        length: 9,
        placeholder: '501234567',
    },
};

/**
 * Validate phone number based on country code
 */
export function validatePhoneNumber(
    countryCode: string,
    phoneNumber: string
): PhoneValidationResult {
    // Remove any spaces, dashes, or parentheses
    const cleanNumber = phoneNumber.replace(/[\s\-()]/g, '');

    // Check if number contains only digits
    if (!/^\d+$/.test(cleanNumber)) {
        return {
            isValid: false,
            error: 'Phone number must contain only digits',
        };
    }

    // Get country-specific rule
    const rule = COUNTRY_PHONE_RULES[countryCode];

    if (rule) {
        // Validate against country-specific pattern
        if (!rule.pattern.test(cleanNumber)) {
            const lengthInfo = Array.isArray(rule.length)
                ? `${rule.length[0]}-${rule.length[1]}`
                : rule.length;

            if (countryCode === '+91') {
                return {
                    isValid: false,
                    error: `Indian mobile numbers must be ${lengthInfo} digits and start with 6-9`,
                };
            }

            return {
                isValid: false,
                error: `${rule.name} phone numbers must be ${lengthInfo} digits`,
            };
        }
    } else {
        // Generic validation for other countries (7-15 digits)
        if (cleanNumber.length < 7 || cleanNumber.length > 15) {
            return {
                isValid: false,
                error: 'Phone number must be between 7-15 digits',
            };
        }
    }

    return { isValid: true };
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(countryCode: string, phoneNumber: string): string {
    const cleanNumber = phoneNumber.replace(/[\s\-()]/g, '');

    // Format based on country
    switch (countryCode) {
        case '+91': // India: 98765 43210
            return cleanNumber.replace(/(\d{5})(\d{5})/, '$1 $2');

        case '+1': // US/Canada: (555) 123-4567
            return cleanNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');

        case '+44': // UK: 7700 900000
            if (cleanNumber.length === 10) {
                return cleanNumber.replace(/(\d{4})(\d{6})/, '$1 $2');
            }
            return cleanNumber.replace(/(\d{5})(\d{6})/, '$1 $2');

        case '+61': // Australia: 412 345 678
            return cleanNumber.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');

        default:
            return cleanNumber;
    }
}

/**
 * Get expected phone length for country
 */
export function getPhoneLength(countryCode: string): number | [number, number] {
    const rule = COUNTRY_PHONE_RULES[countryCode];
    return rule ? rule.length : [7, 15];
}

/**
 * Parse phone number with country code
 */
export function parsePhoneNumber(fullNumber: string): {
    countryCode: string;
    phoneNumber: string;
} {
    // Try to extract country code from beginning
    const match = fullNumber.match(/^(\+\d{1,4})([\d\s\-()]+)$/);

    if (match) {
        return {
            countryCode: match[1],
            phoneNumber: match[2].replace(/[\s\-()]/g, ''),
        };
    }

    // Default to India if no country code
    return {
        countryCode: '+91',
        phoneNumber: fullNumber.replace(/[\s\-()]/g, ''),
    };
}

/**
 * Combine country code and phone number
 */
export function combinePhoneNumber(countryCode: string, phoneNumber: string): string {
    const cleanNumber = phoneNumber.replace(/[\s\-()]/g, '');
    return `${countryCode}${cleanNumber}`;
}
