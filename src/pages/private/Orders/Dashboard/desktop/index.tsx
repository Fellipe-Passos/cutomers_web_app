import { ActionIcon, Badge, Group, Stack, Table, Tooltip } from "@mantine/core";
import { useQueryClient } from "react-query";
import Loading from "../../../../../components/Loading";
import NoData from "../../../../../components/NoData";
import Tabs from "../../../../../components/Tabs";
import { listOrdersInProgress } from "../index.service";
import { getStatus, header } from "../utils/table";
import { Eye } from "tabler-icons-react";
import { formatCurrency } from "../../../../../utils";

interface OrdersDashboardDesktopProps {
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

export default function OrdersDashboardDesktop({
  activeTab,
  orderDataIsLoading,
  ordersData,
  onTabChange,
}: OrdersDashboardDesktopProps): JSX.Element {
  const queryClient = useQueryClient();

  const rows =
    ordersData &&
    ordersData.map((order: any) => {
      const badge = getStatus({
        delivered: order?.delivered ?? false,
        finished: order?.finished ?? false,
        deliveredAt: order?.deliveredAt ?? null,
        finishedAt: order?.finishedAt ?? null,
        stages: order?.productionStage,
      });

      return (
        <Table.Tr key={order?.id}>
          <Table.Td>{order?.id ?? ""}</Table.Td>
          <Table.Td>
            {order?.createdAt
              ? new Date(order?.createdAt)?.toLocaleDateString("pt-br")
              : "-"}
          </Table.Td>

          <Table.Td>{order?.client?.name ?? "-"}</Table.Td>
          <Table.Td>{order?.patientName ?? "-"}</Table.Td>
          <Table.Td>{formatCurrency(order?.price ?? 0)}</Table.Td>
          <Table.Td>
            <Badge color={badge?.color}>{badge?.text}</Badge>
          </Table.Td>
          <Table.Td>
            <Group>
              <Tooltip label="Visualizar pedido">
                <ActionIcon
                  color="cyan"
                  // onClick={() => navigate(`/edit-order/${order?.id}`)}
                >
                  <Eye />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Table.Td>
        </Table.Tr>
      );
    });

  return (
    <Stack h="100%">
      <Group justify="center">
        <Tabs
          tabs={[
            { label: "Pedidos em progresso", value: "ALL" },
            { label: "Pedidos no setor financeiro", value: "FOR_DELIVERY" },
            { label: "Pedidos finalizados", value: "FINALIZED" },
          ]}
          defaultValue={activeTab}
          onChange={async (
            e:
              | "ALL"
              | "IN_PROGRESS"
              | "WAITING_STEPS"
              | "FOR_DELIVERY"
              | "FINALIZED"
          ) => {
            onTabChange(e);
            await queryClient.fetchQuery("list-orders", () =>
              listOrdersInProgress(e)
            );
          }}
        />
      </Group>
      {ordersData?.length && !orderDataIsLoading ? (
        <Table.ScrollContainer minWidth={"100%"}>
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
              {header.map((h) => (
                <Table.Th key={h}>{h}</Table.Th>
              ))}
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      ) : null}
      {orderDataIsLoading && <Loading />}
      {!orderDataIsLoading && !ordersData?.length && <NoData />}
    </Stack>
  );
}
