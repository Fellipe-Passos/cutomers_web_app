import { UserType } from "../types/user";

export function getUserRole() {
    const token = localStorage.getItem('@APPDreamLab:user') || '{}'

    if (token) {
        const { role } = JSON?.parse(token) as UserType

        return role
    }

    return undefined
}

export function getUserFirstName() {
    const userData = JSON.parse(localStorage.getItem('@APPDreamLab:user') || '') as UserType;

    if (userData && userData?.name) {
        const nameParts = userData?.name?.split(' ');

        return nameParts[0];
    }

    return 'Usuário';
}
