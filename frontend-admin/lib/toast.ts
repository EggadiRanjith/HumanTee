import { toast as sonnerToast } from 'sonner';

/**
 * Toast notification wrapper
 * Replaces alert() with professional toast notifications
 */
export const toast = {
    success: (message: string) => {
        sonnerToast.success(message, {
            duration: 3000,
            position: 'top-right',
        });
    },

    error: (message: string) => {
        sonnerToast.error(message, {
            duration: 5000,
            position: 'top-right',
        });
    },

    loading: (message: string) => {
        return sonnerToast.loading(message, {
            position: 'top-right',
        });
    },

    dismiss: (id: string | number) => {
        sonnerToast.dismiss(id);
    },

    promise: <T,>(
        promise: Promise<T>,
        {
            loading,
            success,
            error,
        }: {
            loading: string;
            success: string | ((data: T) => string);
            error: string | ((error: any) => string);
        }
    ) => {
        return sonnerToast.promise(promise, {
            loading,
            success,
            error,
        });
    },
};
