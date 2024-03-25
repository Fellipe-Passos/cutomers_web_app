import { em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import CollectionDashboardDesktop from "./desktop";
import CollectionDashboardMobile from "./mobile";

export default function CollectionDashboard() {
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  if (!isMobile) {
    return <CollectionDashboardDesktop />;
  }

  return <CollectionDashboardMobile />;
}
