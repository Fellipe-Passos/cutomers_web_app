import {
  Badge,
  Group,
  Paper,
  Stack,
  Table,
  Text,
  Timeline,
  em,
} from "@mantine/core";
import { useElementSize, useMediaQuery } from "@mantine/hooks";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getStatus } from "../Dashboard/utils/table";
import { getOrder } from "./index.service";

const renderItem = (text: string, value: string | JSX.Element) => (
  <Stack style={{ gap: 0 }}>
    <Text fw={400}>{text}</Text>
    <Text fw={700}>{value}</Text>
  </Stack>
);

export default function ViewOrder(): JSX.Element {
  const { orderId } = useParams();
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
  const { ref, height } = useElementSize();

  const { data: orderData } = useQuery(
    "view-order",
    () => getOrder(orderId as string),
    { enabled: Boolean(orderId) }
  );

  const badge = getStatus({
    delivered: orderData?.delivered ?? false,
    finished: orderData?.finished ?? false,
    deliveredAt: orderData?.deliveredAt ?? null,
    finishedAt: orderData?.finishedAt ?? null,
    stages: orderData?.productionStage,
  });

  const stages = orderData?.productionStage;

  const renderTimeline = () => {
    let active = 0;

    stages?.forEach((stage: any) => {
      if (stage?.finished) {
        active++;
      }
    });

    if (orderData?.finished) active++;

    if (orderData?.delivered) active++;

    return (
      <Timeline
        active={active}
        bulletSize={18}
        lineWidth={2}
        styles={{ itemTitle: { fontSize: ".8rem" } }}
      >
        <Timeline.Item title="Recebemos o pedido">
          <Text c="dimmed" size="xs">
            Seu pedido foi recebido e está agora em nossas mãos.
            <Text>
              Estamos trabalhando para garantir sua preparação e entrega
              impecáveis.
            </Text>
          </Text>
          <Text size="xs" mt={4}>
            {orderData?.createdAt
              ? new Date(orderData?.createdAt)?.toLocaleDateString("pt-br")
              : "-"}
          </Text>
        </Timeline.Item>

        {stages?.map((stage: any, index: number) => (
          <Timeline.Item key={index} title={`Setor ${stage?.role}`}>
            <Text c="dimmed" size="xs">
              {`Seu pedido encontra-se atualmente no setor ${stage?.role}.`}
              <Text>
                Está sendo cuidadosamente processado para garantir um produto de
                alta qualidade.
              </Text>
            </Text>
            <Text size="xs" mt={4}>
              {`Previsão de entrega: ${
                stage?.time
                  ? new Date(stage?.time)?.toLocaleDateString("pt-br")
                  : "-"
              }`}
            </Text>
            {stage?.finishedAt ? (
              <Text size="xs" mt={4}>
                {`Entregue em: ${
                  stage?.finishedAt
                    ? new Date(stage?.finishedAt)?.toLocaleDateString("pt-br")
                    : "-"
                }`}
              </Text>
            ) : null}
          </Timeline.Item>
        ))}

        <Timeline.Item title="Enviado para o setor financeiro">
          <Text c="dimmed" size="xs">
            <Text variant="link" component="span" inherit>
              Seu pedido foi direcionado ao setor financeiro, onde estamos
              aguardando o processamento do pagamento.
            </Text>{" "}
          </Text>
          <Text size="xs" mt={4}>
            {orderData?.finishedAt
              ? new Date(orderData?.finishedAt)?.toLocaleDateString("pt-br")
              : "-"}
          </Text>
        </Timeline.Item>

        <Timeline.Item title="Pagamento recebido">
          <Text c="dimmed" size="xs">
            <Text variant="link" component="span" inherit>
              O pagamento foi processado e seu pedido finalizado.
            </Text>{" "}
          </Text>
          <Text size="xs" mt={4}>
            {orderData?.deliveredAt
              ? new Date(orderData?.deliveredAt)?.toLocaleDateString("pt-br")
              : "-"}
          </Text>
        </Timeline.Item>
      </Timeline>
    );
  };

  const renderDesktopTable = () => (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Data</Table.Th>
          <Table.Th>Paciente</Table.Th>
          <Table.Th>Cor</Table.Th>
          <Table.Th>Materiais enviados</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th>Data de pagamento</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr>
          <Table.Td>
            {orderData?.createdAt
              ? new Date(orderData?.createdAt)?.toLocaleDateString("pt-br")
              : "-"}
          </Table.Td>
          <Table.Td>{orderData?.patientName ?? "-"}</Table.Td>
          <Table.Td>{orderData?.color ?? "-"}</Table.Td>
          <Table.Td>{orderData?.materialsSendedByClient ?? "-"}</Table.Td>
          <Table.Td>
            <Badge size="xs" color={badge?.color}>
              {badge?.text}
            </Badge>
          </Table.Td>
          <Table.Td>
            {orderData?.paidAt
              ? new Date(orderData?.paidAt)?.toLocaleDateString("pt-br")
              : "Sem pagamento"}
          </Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );

  const renderMobileTable = () => (
    <Stack>
      <Group>
        {renderItem(
          "Data",
          orderData?.createdAt
            ? new Date(orderData?.createdAt)?.toLocaleDateString("pt-br")
            : "-"
        )}
        {renderItem("Paciente", orderData?.patientName ?? "-")}
        {renderItem("Cor", orderData?.color ?? "-")}
      </Group>
      <Group>
        {renderItem(
          "Materiais enviados",
          orderData?.materialsSendedByClient?.trim()?.length
            ? orderData?.materialsSendedByClient
            : "-"
        )}
      </Group>
      <Group>
        {renderItem(
          "Status",
          <Badge size="xs" color={badge?.color}>
            {badge?.text}
          </Badge>
        )}
        {renderItem(
          "Pagamento",
          orderData?.paidAt
            ? new Date(orderData?.paidAt)?.toLocaleDateString("pt-br")
            : "-"
        )}
      </Group>
    </Stack>
  );

  return (
    <Stack h={"100%"} style={{ overflow: "hidden" }}>
      <Paper p={"2rem"} shadow="xl" ref={ref}>
        {!isMobile && renderDesktopTable()}
        {isMobile && renderMobileTable()}
      </Paper>
      <Paper
        p={"2rem"}
        // bg={"red"}
        shadow="xl"
        style={{
          overflow: "auto",
          height: `calc(100% - ${height}px - 1rem)`,
          maxHeight: `calc(100% - ${height}px - 1rem)`,
        }}
      >
        <Stack>
          <Text fz={"1.5erm"} fw={800}>
            Andamento do pedido
          </Text>
          {renderTimeline()}
        </Stack>
      </Paper>
    </Stack>
  );
}
