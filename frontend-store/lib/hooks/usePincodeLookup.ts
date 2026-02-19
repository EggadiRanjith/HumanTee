/**
 * Pincode Auto-Fill Hook
 * Fetches city/state/district from India Post API when a valid 6-digit pincode is entered.
 * If user has already filled city/state, returns pending data and asks for confirmation.
 */

import { useState, useCallback, useRef } from 'react';

interface PincodeLookupResult {
    city: string;
    state: string;
    district: string;
}

interface PendingOverwrite {
    city: string;
    state: string;
    district: string;
}

interface UsePincodeLookupReturn {
    /** Call this when pincode changes (pass current city/state to detect conflicts) */
    lookupPincode: (pincode: string, currentCity: string, currentState: string) => void;
    /** True while API call is in progress */
    isLooking: boolean;
    /** If user had existing values, this holds the API result pending confirmation */
    pendingOverwrite: PendingOverwrite | null;
    /** User accepted the overwrite */
    acceptOverwrite: () => PincodeLookupResult | null;
    /** User rejected the overwrite — keep their values */
    rejectOverwrite: () => void;
}

export function usePincodeLookup(
    onAutoFill: (data: PincodeLookupResult) => void
): UsePincodeLookupReturn {
    const [isLooking, setIsLooking] = useState(false);
    const [pendingOverwrite, setPendingOverwrite] = useState<PendingOverwrite | null>(null);
    const abortRef = useRef<AbortController | null>(null);

    const lookupPincode = useCallback(async (
        pincode: string,
        currentCity: string,
        currentState: string,
    ) => {
        // Only trigger on valid 6-digit pincode
        if (!/^\d{6}$/.test(pincode)) return;

        // Abort previous request if still in-flight
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        setIsLooking(true);
        setPendingOverwrite(null);

        try {
            const res = await fetch(
                `https://api.postalpincode.in/pincode/${pincode}`,
                { signal: controller.signal }
            );
            const data = await res.json();

            if (
                !data?.[0]?.PostOffice?.length ||
                data[0].Status !== 'Success'
            ) {
                setIsLooking(false);
                return;
            }

            const postOffice = data[0].PostOffice[0];
            const result: PincodeLookupResult = {
                city: postOffice.District || postOffice.Division || '',
                state: postOffice.State || '',
                district: postOffice.District || '',
            };

            const hasExistingData = currentCity.trim() || currentState.trim();

            if (hasExistingData) {
                // User already has values — ask for confirmation
                setPendingOverwrite(result);
            } else {
                // Fields empty — auto-fill silently
                onAutoFill(result);
            }
        } catch (err: any) {
            if (err.name !== 'AbortError') {
                // Silently fail — user can type manually
                console.warn('Pincode lookup failed:', err.message);
            }
        } finally {
            setIsLooking(false);
        }
    }, [onAutoFill]);

    const acceptOverwrite = useCallback(() => {
        if (pendingOverwrite) {
            onAutoFill(pendingOverwrite);
            const result = { ...pendingOverwrite };
            setPendingOverwrite(null);
            return result;
        }
        return null;
    }, [pendingOverwrite, onAutoFill]);

    const rejectOverwrite = useCallback(() => {
        setPendingOverwrite(null);
    }, []);

    return {
        lookupPincode,
        isLooking,
        pendingOverwrite,
        acceptOverwrite,
        rejectOverwrite,
    };
}
