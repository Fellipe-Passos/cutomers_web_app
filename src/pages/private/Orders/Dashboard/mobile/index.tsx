import {
  Accordion,
  Anchor,
  Badge,
  Button,
  Group,
  Radio,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import { useQueryClient } from "react-query";
import Loading from "../../../../../components/Loading";
import NoData from "../../../../../components/NoData";
import { formatCurrency } from "../../../../../utils";
import { listOrdersInProgress } from "../index.service";
import { getStatus } from "../utils/table";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  return (
    <Stack h="100%" style={{ overflow: "auto" }}>
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

      {ordersData?.length && !orderDataIsLoading ? (
        <Accordion>
          {ordersData?.map((order: any, index: number) => {
            const badge = getStatus({
              delivered: order?.delivered ?? false,
              finished: order?.finished ?? false,
              deliveredAt: order?.deliveredAt ?? null,
              finishedAt: order?.finishedAt ?? null,
              stages: order?.productionStage,
            });

            return (
              <Accordion.Item
                key={index}
                value={order?.id?.toString() ?? index?.toString}
              >
                <Accordion.Control>
                  <Group>
                    <Text fw={700}>{`Pedido Nº ${order?.id}`}</Text>
                    <Badge size="xs" color={badge?.color}>
                      {badge?.text}
                    </Badge>
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>
                  <Table>
                    <Table.Thead
                      style={{
                        fontSize: ".65rem",
                        backgroundColor: "none",
                        color: "black",
                      }}
                    >
                      <Table.Th>Data</Table.Th>
                      <Table.Th>Paciente</Table.Th>
                      <Table.Th>Valor</Table.Th>
                    </Table.Thead>
                    <Table.Tbody style={{ fontSize: ".6rem" }}>
                      <Table.Tr>
                        <Table.Td>
                          {order?.createdAt
                            ? new Date(order?.createdAt)?.toLocaleDateString(
                                "pt-br"
                              )
                            : "-"}
                        </Table.Td>
                        <Table.Td>{order?.patientName ?? "-"}</Table.Td>
                        <Table.Td>{formatCurrency(order?.price ?? 0)}</Table.Td>
                      </Table.Tr>
                    </Table.Tbody>
                  </Table>
                  <Button
                    variant="subtle"
                    onClick={() => navigate(`/view-order/${order?.id}`)}
                  >
                    Visualizar pedido
                  </Button>
                </Accordion.Panel>
              </Accordion.Item>
            );
          })}
        </Accordion>
      ) : null}
      {orderDataIsLoading && <Loading />}
      {!orderDataIsLoading && !ordersData?.length && <NoData />}
    </Stack>
  );
}
