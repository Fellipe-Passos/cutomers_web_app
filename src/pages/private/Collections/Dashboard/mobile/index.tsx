import { useEffect, useState, useRef } from "react";
import { useMutation } from "react-query";
import { getCollections } from "../services/get-collections";
import { Accordion, Group, Stack, Badge, Table, Anchor } from "@mantine/core";
import { formatCurrency } from "../../../../../utils";

type StatusType = "RECEIVED" | "PENDING" | "OVERDUE" | "CANCELLED";

export default function CollectionDashboardMobile(): JSX.Element {
  const [pagination, setPagination] = useState({
    limit: 20,
    offset: 0,
  });
  const [collections, setCollections] = useState<any[]>([]); // Use o tipo apropriado em vez de `any` se possível
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data, mutate } = useMutation(getCollections);

  useEffect(() => {
    mutate(pagination);
  }, [pagination]);

  useEffect(() => {
    if (data?.data) {
      setCollections((prevCollections) => [...prevCollections, ...data.data]);
      if (data.data.length < data.totalCount) {
        setHasMore(true); // Correção: se houver mais dados, setHasMore para true
      } else {
        setHasMore(false);
      }
    }
  }, [data]);

  useEffect(() => {
    function handleScroll() {
      if (
        containerRef.current &&
        containerRef.current.scrollHeight - containerRef.current.scrollTop ===
          containerRef.current.clientHeight &&
        hasMore
      ) {
        setPagination((prevPagination) => ({
          ...prevPagination,
          offset: prevPagination.offset + prevPagination.limit,
        }));
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore]);

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

  const items = collections.map((collection: any) => {
    const orderId = collection.externalReference?.replace("ORDER_", "");
    const installmentNumber = collection.installmentNumber
      ? `(${collection.installmentNumber})`
      : "";

    return (
      <Accordion.Item key={collection.id} value={collection.id}>
        <Accordion.Control>
          <Group>
            {`Pedido ${orderId ?? "S.N."} ${installmentNumber}`}
            <Badge
              size="xs"
              color={STATUSES[collection.status as StatusType]?.color}
            >
              {STATUSES[collection.status as StatusType]?.text}
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
                  {collection.dateCreated
                    ? new Date(
                        new Date(collection.dateCreated).setHours(24, 0, 0, 0)
                      ).toLocaleDateString("pt-br")
                    : "-"}
                </Table.Td>
                <Table.Td>
                  {collection.dueDate
                    ? new Date(
                        new Date(collection.dueDate).setHours(24, 0, 0, 0)
                      ).toLocaleDateString("pt-br")
                    : "-"}
                </Table.Td>
                <Table.Td>{collection.installmentNumber ?? 1}</Table.Td>
                <Table.Td>{formatCurrency(collection.value ?? 0)}</Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
          <Anchor
            href={collection.bankSlipUrl ?? collection.invoiceUrl}
            target="_blank"
          >
            Visualizar cobrança
          </Anchor>
        </Accordion.Panel>
      </Accordion.Item>
    );
  });

  return (
    <Stack h={"90vh"} mah={"90vh"} style={{ overflow: "auto" }}>
      <div ref={containerRef}>
        <Accordion>{items}</Accordion>
      </div>
    </Stack>
  );
}
