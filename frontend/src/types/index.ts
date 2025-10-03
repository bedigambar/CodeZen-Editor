export interface CodeState {
  htmlCode: string;
  cssCode: string;
  jsCode: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  title: string;
}

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  icon: string;
}

export type FileType = 'html' | 'css' | 'js' | 'all';

export interface DownloadResponse {
  data: Blob;
  headers: {
    'content-disposition': string;
  };
}
