import { ApiService } from "../../../../config/api/api";

export const getOrder = async (orderId: string): Promise<any> => {
    const api = new ApiService();

    return await api.RequestData("GET", `/order/${orderId}`, {});
};
