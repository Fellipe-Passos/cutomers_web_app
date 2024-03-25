import CollectionDashboard from "../../pages/private/Collections/Dashboard";
import OrdersDashboard from "../../pages/private/Orders/Dashboard";
import { RoutesType } from "../../types/routesTypes";

export const homeRoutes: RoutesType[] = [
  {
    element: <OrdersDashboard />,
    path: "/view-orders",
    isPrivate: true,
    title: "Meus pedidos",
  },
  {
    element: <CollectionDashboard />,
    path: "/view-collections",
    isPrivate: true,
    title: "Minhas cobranças",
  },
];
