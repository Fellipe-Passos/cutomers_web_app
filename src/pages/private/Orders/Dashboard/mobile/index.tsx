import {
  Badge,
  Box,
  Group,
  Radio,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { useQueryClient } from "react-query";
import { listOrdersInProgress } from "../index.service";
import { getStatus } from "../utils/table";
import { formatCurrency } from "../../../../../utils";
import Loading from "../../../../../components/Loading";
import NoData from "../../../../../components/NoData";

interface OrdersDashboardMobileProps {
  activeTab:
    | "ALL"
    | "FOR_DELIVERY"
    | "FINALIZED"
    | "IN_PROGRESS"
    | "WAITING_STEPS";
  ordersData: any;
  orderDataIsLoading: boolean;
  onTabChange: (
    e: "ALL" | "IN_PROGRESS" | "WAITING_STEPS" | "FOR_DELIVERY" | "FINALIZED"
  ) => void;
}

export default function OrdersDashboardMobile({
  activeTab,
  onTabChange,
  orderDataIsLoading,
  ordersData,
}: OrdersDashboardMobileProps): JSX.Element {
  const queryClient = useQueryClient();

  return (
    <Stack h="100%">
      <Radio.Group
        value={activeTab}
        onChange={async (e) => {
          onTabChange(
            e as
              | "ALL"
              | "FOR_DELIVERY"
              | "FINALIZED"
              | "IN_PROGRESS"
              | "WAITING_STEPS"
          );
          await queryClient.fetchQuery("list-orders", () =>
            listOrdersInProgress(
              e as
                | "ALL"
                | "FOR_DELIVERY"
                | "FINALIZED"
                | "IN_PROGRESS"
                | "WAITING_STEPS"
            )
          );
        }}
      >
        <Group>
          <Radio label="Em andamento" value={"ALL"} />
          <Radio label="Financeiro" value={"FOR_DELIVERY"} />
          <Radio label="Finalizados" value={"FINALIZED"} />
        </Group>
      </Radio.Group>

      {ordersData?.length && !orderDataIsLoading
        ? ordersData?.map((order: any, index: number) => {
            const badge = getStatus({
              delivered: order?.delivered ?? false,
              finished: order?.finished ?? false,
              deliveredAt: order?.deliveredAt ?? null,
              finishedAt: order?.finishedAt ?? null,
              stages: order?.productionStage,
            });

            return (
              <Box
                key={index}
                style={(theme) => ({
                  border: `1px solid ${theme.colors.blue[4]}`,
                  // backgroundColor: "red",
                  borderRadius: "4px",
                  padding: ".5rem",
                })}
              >
                <Group justify="space-between">
                  <Text fw={700}>{`Pedido Nº ${order?.id}`}</Text>
                  <Badge size="xs" color={badge?.color}>
                    {badge?.text}
                  </Badge>
                </Group>
                <SimpleGrid cols={3}>
                  <Text fz={".875rem"}>{`${
                    order?.createdAt
                      ? new Date(order?.createdAt)?.toLocaleDateString("pt-br")
                      : "-"
                  }`}</Text>
                  <Text
                    fz={".875rem"}
                    style={{
                      maxWidth: "100%",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                    }}
                  >{`${order?.client?.name ?? "-"}`}</Text>
                  <Text fz={".875rem"}>{`${formatCurrency(
                    order?.price ?? 0
                  )}`}</Text>
                </SimpleGrid>
              </Box>
            );
          })
        : null}
      {orderDataIsLoading && <Loading />}
      {!orderDataIsLoading && !ordersData?.length && <NoData />}
    </Stack>
  );
}
