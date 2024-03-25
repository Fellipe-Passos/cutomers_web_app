import { ApiService } from "../../../config/api/api";

interface UserType {
    cpf: string;
}

export const login = async (data: UserType) => {
    const api = new ApiService();

    return await api.RequestData("POST", "/auth/customer", data);
};

export const loginSuccess = (data: any) => {
    localStorage.setItem("@ProductionLine:token", data?.token);
    localStorage.setItem("@ProductionLine:user", JSON.stringify(data?.user));
};