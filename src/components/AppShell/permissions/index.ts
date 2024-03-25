import { ReportMoney } from "tabler-icons-react";

export const navbarOptions = (): any[] => {
    const options: any[] = [
        {
            text: "Pedidos",
            URL: "/view-orders",
            icon: ReportMoney
        },
        {
            text: "Cobranças",
            URL: "/view-collections",
            icon: ReportMoney
        },
    ]

    return options
}

