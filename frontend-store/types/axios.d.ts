// Axios module augmentation for custom error properties
import 'axios';

declare module 'axios' {
    export interface AxiosError {
        isTimeout?: boolean;
    }
}
