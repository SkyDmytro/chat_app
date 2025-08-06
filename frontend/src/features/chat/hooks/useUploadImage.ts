import { authFetch } from "@/lib/requests";
import { type ImageResponse } from "../model/types";

export const useUploadImage = () => {
  const uploadImage = async (file: File): Promise<ImageResponse> => {
    console.log("Uploading image:", file);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await authFetch.post<ImageResponse, FormData>(
        `/uploads`,
        formData
      );
      return response;
    } catch (e) {
      console.error(e);
      throw new Error("Failed to upload image");
    }
  };

  return { uploadImage };
};
