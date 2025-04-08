import { supabase } from "./supabase";
import * as FileSystem from "expo-file-system";
import { MaterialCategory } from "@/types/Material";

export const uploadFileToSupabase = async (
  uri: string,
  mimeType: string | null,
  fileName: string,
  category: MaterialCategory
): Promise<string> => {
  try {
    // Get file extension from name or mime type
    const fileExt =
      fileName.split(".").pop() || (mimeType ? mimeType.split("/")[1] : "file");

    const uniqueFileName = `${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 10)}.${fileExt}`;
    const filePath = `materials/${category}/${uniqueFileName}`;

    // For non-web platforms
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (!fileInfo.exists) {
      throw new Error("File does not exist");
    }

    // Read the file as base64
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Convert base64 to blob
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {
      type: mimeType || "application/octet-stream",
    });

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("materials")
      .upload(filePath, blob);

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("materials")
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
