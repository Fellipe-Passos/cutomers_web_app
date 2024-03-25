/* eslint-disable no-unsafe-optional-chaining */
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { getCollections } from "../services/get-collections";
import { Accordion, Group, Stack, Badge, Table, Anchor } from "@mantine/core";
import { formatCurrency } from "../../../../../utils";

type StatusType = "RECEIVED" | "PENDING" | "OVERDUE" | "CANCELLED";

export default function CollectionDashboardMobile(): JSX.Element {
  const [pagination, setPagination] = useState({
    limit: 12,
    offset: 0,
  });

  const { innerHeight } = window;

  const handleLimit = (): void => {
    const countRowsInTable = Math.round((12 * innerHeight) / 695);

    setPagination({
      ...pagination,
      limit: countRowsInTable,
    });
  };

  window.onresize = () => {
    handleLimit();
  };

  useEffect(() => {
    handleLimit();
  }, [innerHeight]);

  const { data, mutate } = useMutation(getCollections);

  useEffect(() => {
    mutate(pagination);
  }, [pagination]);

  const STATUSES = {
    RECEIVED: {
      text: "PAGO",
      color: "green",
    },
    PENDING: {
      text: "AGUARDANDO PAGAMENTO",
      color: "yellow",
    },
    OVERDUE: {
      text: "PAGAMENTO ATRASADO",
      color: "orange",
    },
    CANCELLED: {
      text: "CANCELADO",
      color: "red",
    },
  };

  const collections = data?.data;

  const items = collections?.map((collection: any) => {
    const orderId = collection?.externalReference?.replace("ORDER_", "");
    const installmentNumber = collection?.installmentNumber
      ? `(${collection?.installmentNumber})`
      : "";

    return (
      <Accordion.Item key={collection?.id} value={collection?.id}>
        <Accordion.Control>
          <Group>
            {`Pedido ${orderId ?? "S.N."} ${installmentNumber}`}
            <Badge
              size="xs"
              color={STATUSES[collection?.status as StatusType]?.color}
            >
              {STATUSES[collection?.status as StatusType]?.text}
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
              <Table.Th>Vencimento</Table.Th>
              <Table.Th>Parcela</Table.Th>
              <Table.Th>Valor total</Table.Th>
            </Table.Thead>
            <Table.Tbody style={{ fontSize: ".6rem" }}>
              <Table.Tr>
                <Table.Td>
                  {collection?.dateCreated
                    ? new Date(
                        new Date(collection.dateCreated)?.setHours(24, 0, 0, 0)
                      )?.toLocaleDateString("pt-br")
                    : "-"}
                </Table.Td>
                <Table.Td>
                  {collection?.dueDate
                    ? new Date(
                        new Date(collection.dueDate)?.setHours(24, 0, 0, 0)
                      )?.toLocaleDateString("pt-br")
                    : "-"}
                </Table.Td>
                <Table.Td>{collection?.installmentNumber ?? 1}</Table.Td>
                <Table.Td>{formatCurrency(collection?.value ?? 0)}</Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
          <Anchor
            href={collection?.bankSlipUrl ?? collection?.invoiceUrl}
            target="_blank"
          >
            Visualizar cobrança
          </Anchor>
        </Accordion.Panel>
      </Accordion.Item>
    );
  });

  return (
    <Stack h={"100%"}>
      <Accordion>{items}</Accordion>
    </Stack>
  );
}
