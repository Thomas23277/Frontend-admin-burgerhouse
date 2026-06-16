import apiClient from './apiClient';
import type { CloudinaryUploadResponse, CloudinaryDestroyResponse } from '../types';

export const uploadImagen = (file: File, folder = 'burger-house') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  return apiClient
    .post<CloudinaryUploadResponse>('/cloudinary/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((r) => r.data);
};

export const destroyImagen = (public_id: string) =>
  apiClient
    .delete<CloudinaryDestroyResponse>('/cloudinary/destroy', {
      data: { public_id },
    })
    .then((r) => r.data);
