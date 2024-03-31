import { ApiService } from "../../../../../config/api/api";

interface ListClientsReturnType {
    id: number,
    name: string
    phone: string
}

export const listClients = async (): Promise<ListClientsReturnType[] | null | undefined> => {
    const api = new ApiService();

    return await api.RequestData("GET", "/list-clients", {}) as Promise<ListClientsReturnType[] | null | undefined>;
};

export const getClientsToSelect = (clients: ListClientsReturnType[] | null | undefined): Array<{ label: string, value: string }> => {
    if (!clients) return []

    const formattedClients = clients?.map((client) => ({
        label: client?.name ?? '',
        value: client?.id?.toString() ?? ''
    }))

    return formattedClients
}


export const colors = [
    { label: "BL1", value: "BL1" },
    { label: "BL2", value: "BL2" },
    { label: "BL3", value: "BL3" },
    { label: "BL4", value: "BL4" },
    { label: "B1", value: "B1" },
    { label: "B2", value: "B2" },
    { label: "B3", value: "B3" },
    { label: "B4", value: "B4" },
    { label: "A1", value: "A1" },
    { label: "A2", value: "A2" },
    { label: "A3", value: "A3" },
    { label: "A3.5", value: "A3.5" },
    { label: "A4", value: "A4" },
    { label: "C1", value: "C1" },
    { label: "C2", value: "C2" },
    { label: "C3", value: "C3" },
    { label: "C4", value: "C4" },
    { label: "D1", value: "D1" },
    { label: "D2", value: "D2" },
    { label: "D3", value: "D3" },
    { label: "D4", value: "D4" },
]