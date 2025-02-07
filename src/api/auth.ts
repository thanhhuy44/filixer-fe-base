import { ApiResponse } from "@/types";
import request from "@/utils/axiosClient";

export const AuthApi = {
  login: async (): Promise<ApiResponse> => {
    return request.post("/auth/login");
  },
};
