import CollectionDashboard from "../../pages/private/Collections/Dashboard";
import OrdersDashboard from "../../pages/private/Orders/Dashboard";
import NewOrder from "../../pages/private/Orders/NewOrder";
import ViewOrder from "../../pages/private/Orders/ViewOrder";
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
  {
    element: <ViewOrder />,
    path: "/view-order/:orderId",
    isPrivate: true,
    title: "Pedido",
    returnButton: true,
  },
  {
    element: <NewOrder />,
    path: "/new-order",
    isPrivate: true,
    title: "Novo pedido",
    returnButton: true,
  },
];
