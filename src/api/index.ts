import axios from "axios";

export * as authApi from "./auth";
export * as bookingApi from "./booking";
export * as driverApi from "./driver";
export * as userApi from "./user";
export * as mapApi from "./map";
export * as notificationApi from "./notification";

const CLOUD_NAME = "diom7seyg";
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
const PRESET = "stndhxae";
export const uploadImg = async (file: File) => {
  // Initial FormData
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", PRESET);
  formData.append("folder", "tamtam");

  // Make an AJAX upload request using Axios (replace Cloudinary URL below with your own)
  return axios
    .post<{ secure_url: string }>(UPLOAD_URL, formData)
    .then((response) => {
      const data = response.data;
      const fileURL = data.secure_url;
      return fileURL;
    });
};
