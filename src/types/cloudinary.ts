export interface CloudinaryUploadResponse {
  url: string;
  secure_url: string;
  public_id: string;
  format?: string | null;
  width?: number | null;
  height?: number | null;
}

export interface CloudinaryDestroyResponse {
  result: string;
}
