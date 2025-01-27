import type { ToastOptions } from 'react-toastify';
import { toast } from 'react-toastify';

const baseOptions: ToastOptions = {
  position: 'top-center',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'colored',
};

const createNotification = (type: 'success' | 'error' | 'warning', message: string) => {
  toast[type](message, baseOptions);
};

export const toastSuccess = (message: string) => createNotification('success', message);
export const toastError = (message: string) => createNotification('error', message);
export const toastWarning = (message: string) => createNotification('warning', message);
