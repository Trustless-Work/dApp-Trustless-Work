import { User, UserPayload } from "@/@types/user.entity";
import http from "@/core/config/axios/http";

interface CreateUserResponse {
  message: string;
}

interface ApiErrorResponse {
  message: string;
  error: string;
  statusCode: number;
}

interface AxiosErrorResponse {
  response: {
    status: number;
    data: ApiErrorResponse;
  };
}

export class AuthService {
  async createUser(address: string): Promise<CreateUserResponse> {
    try {
      const response = await http.post("/user/create", { address });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateUser(address: string, updateData: UserPayload): Promise<User> {
    try {
      const response = await http.patch(`/user/${address}`, updateData);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const response = await http.get("/get-all-users");
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getUser(address: string): Promise<User | null> {
    try {
      const response = await http.get(`/user/${address}`);
      return response.data;
    } catch (error: unknown) {
      // Handle axios error response
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as AxiosErrorResponse;
        if (axiosError.response?.status === 404) {
          return null;
        }
      }
      console.error(error);
      throw error;
    }
  }

  async requestApiKey(wallet: string): Promise<User> {
    try {
      const response = await http.post("/auth/request-api-key", { wallet });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
