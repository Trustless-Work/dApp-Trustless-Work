import { User, UserPayload } from "@/@types/user.entity";
import http from "@/core/config/axios/http";

export class AuthService {
  // ! todo: add promise types

  async createUser(address: string): Promise<any> {
    try {
      const response = await http.post("/user/create", { address });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async addAPIKey(address: string, token: string): Promise<any> {
    try {
      const response = await http.post(`/user/${address}/api-key`, { token });
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

  async getAllUsers(): Promise<any[]> {
    try {
      const response = await http.get("/get-all-users");
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getUser(address: string): Promise<User> {
    try {
      const response = await http.get(`/user/${address}`);
      return response.data;
    } catch (error) {
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
