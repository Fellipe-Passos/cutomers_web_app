import { ApiService } from "../../../../../config/api/api";

interface ListServicesReturnType {
    id: number,
    name: string
    price: string
}


export const listServices = async (): Promise<ListServicesReturnType[] | null | undefined> => {
    const api = new ApiService();

    return await api.RequestData("GET", "/list-services", {}) as Promise<ListServicesReturnType[] | null | undefined>;
};

export const getServicesToSelect = (materials: ListServicesReturnType[] | null | undefined): Array<{ label: string, value: string }> => {
    if (!materials) return []

    const formattedMaterials = materials?.map((material) => ({
        label: material?.name ?? '',
        value: material?.id?.toString() ?? ''
    }))

    return formattedMaterials
}


export const dent = [
    { label: '11', value: '11' },
    { label: '12', value: '12' },
    { label: '13', value: '13' },
    { label: '14', value: '14' },
    { label: '15', value: '15' },
    { label: '16', value: '16' },
    { label: '17', value: '17' },
    { label: '18', value: '18' },
    { label: '21', value: '21' },
    { label: '22', value: '22' },
    { label: '23', value: '23' },
    { label: '24', value: '24' },
    { label: '25', value: '25' },
    { label: '26', value: '26' },
    { label: '27', value: '27' },
    { label: '28', value: '28' },
    { label: '41', value: '41' },
    { label: '42', value: '42' },
    { label: '43', value: '43' },
    { label: '44', value: '44' },
    { label: '45', value: '45' },
    { label: '46', value: '46' },
    { label: '47', value: '47' },
    { label: '48', value: '48' },
    { label: '31', value: '31' },
    { label: '32', value: '32' },
    { label: '33', value: '33' },
    { label: '34', value: '34' },
    { label: '35', value: '35' },
    { label: '36', value: '36' },
    { label: '37', value: '37' },
    { label: '38', value: '38' },
]