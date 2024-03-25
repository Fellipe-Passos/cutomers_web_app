import { em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useState } from "react";
import { useQuery } from "react-query";
import OrdersDashboardDesktop from "./desktop";
import { listOrdersInProgress } from "./index.service";
import OrdersDashboardMobile from "./mobile";

export default function OrdersDashboard(): JSX.Element {
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  const [activeTab, setActiveTab] = useState<
    "ALL" | "IN_PROGRESS" | "WAITING_STEPS" | "FOR_DELIVERY" | "FINALIZED"
  >("ALL");

  const { isFetching: orderDataIsLoading, data: ordersData } = useQuery(
    ["list-orders"],
    () => listOrdersInProgress(activeTab)
  );

  const onTabChange = (
    e: "ALL" | "IN_PROGRESS" | "WAITING_STEPS" | "FOR_DELIVERY" | "FINALIZED"
  ) => {
    setActiveTab(e);
  };

  if (!isMobile) {
    return (
      <OrdersDashboardDesktop
        activeTab={activeTab}
        onTabChange={onTabChange}
        orderDataIsLoading={orderDataIsLoading}
        ordersData={ordersData}
      />
    );
  }

  return (
    <OrdersDashboardMobile
      activeTab={activeTab}
      onTabChange={onTabChange}
      orderDataIsLoading={orderDataIsLoading}
      ordersData={ordersData}
    />
  );
}
