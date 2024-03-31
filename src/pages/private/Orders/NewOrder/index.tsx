import {
  ActionIcon,
  Box,
  Button,
  Group,
  MultiSelect,
  NumberInput,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useMutation, useQuery } from "react-query";
import {
  colors,
  getClientsToSelect,
  listClients,
} from "./services/clients.service";
import {
  dent,
  getServicesToSelect,
  listServices,
} from "./services/services.service";
import { useForm, yupResolver } from "@mantine/form";
import { orderSchema, orderSchemaInitialValues } from "./schema";
import { Check, Trash, X } from "tabler-icons-react";
import NoData from "../../../../components/NoData";
import { notifications } from "@mantine/notifications";
import { createOrder } from "./services/create-order.service";
import { useNavigate } from "react-router-dom";

export default function NewOrder() {
  const navigate = useNavigate();

  const { data: clientsData } = useQuery("list-clients", listClients);
  const { data: servicesData } = useQuery("list-services", listServices);

  const form = useForm({
    validate: yupResolver(orderSchema),
    initialValues: orderSchemaInitialValues,
    validateInputOnBlur: true,
    validateInputOnChange: true,
  });

  const addService = (): void => {
    const { currentService } = form.values;

    const materialList = form.values.services;

    // Clone the initial material schema to avoid modifying it directly
    const initialMaterial = [...orderSchemaInitialValues.services];

    // Insert a new item into the material list
    form.insertListItem("services", initialMaterial[0]);

    // Set the currentService for the newly added item
    const newMaterialIndex = materialList.length;
    form.setFieldValue(`services.${newMaterialIndex}`, currentService);
    form.setFieldValue("currentService", {
      serviceId: "",
      dent: [],
      amount: "",
    });
  };

  const getSelectedService = (value: number) => {
    const service = servicesData?.find((s) => Number(s?.id) === Number(value));

    return service?.name ?? "-";
  };

  const { mutateAsync: createOrderMutate, isLoading: createOrderIsLoading } =
    useMutation(createOrder);

  const onSubmit = async () => {
    const { hasErrors, errors } = form.validate();

    if (hasErrors) console.log(errors);

    const { values } = form;

    const dataToSend = {
      underAnalysis: true,
      patientName: values?.patientName,
      clientId: Number(values?.clientId),
      message: values?.message,
      observations: values?.observations,
      color: values.color,
      serviceIds: values.services?.map((service: any, index: number) => ({
        serviceId: Number(service?.serviceId),
        dent: service?.dent,
        amount: Number(service?.amount),
        orderOfPrecedence: index === 0 ? 1 : null,
      })),
    };

    createOrderMutate(dataToSend, {
      onSuccess() {
        notifications.show({
          title: "Pedido cadastrado",
          message: "A ação de cadastrar pedido foi concluída com sucesso!",
          color: "green",
          icon: <Check />,
          styles: (theme) => ({
            root: {
              backgroundColor: theme.colors.green[0],
              borderColor: theme.colors.green[6],

              "&::before": { backgroundColor: theme.white },
            },

            title: { color: theme.colors.green[6] },
            description: { color: theme.colors.green[6] },
            closeButton: {
              color: theme.colors.green[6],
              "&:hover": { backgroundColor: theme.colors.green[1] },
            },
          }),
        });
        navigate(`/view-orders`);
      },
      onError(err: any) {
        notifications.show({
          title: "Falha ao cadastrar pedido",
          message: err?.response?.data ?? "",
          color: "red",
          icon: <X />,
          styles: (theme) => ({
            root: {
              backgroundColor: theme.colors.red[0],
              borderColor: theme.colors.red[6],

              "&::before": { backgroundColor: theme.white },
            },

            title: { color: theme.colors.red[6] },
            description: { color: theme.colors.red[6] },
            closeButton: {
              color: theme.colors.red[6],
              "&:hover": { backgroundColor: theme.colors.red[1] },
            },
          }),
        });
      },
    });
  };

  return (
    <Stack>
      <Paper
        shadow="xl"
        p={"lg"}
        mah={"85vh"}
        h={"85vh"}
        style={{ overflow: "auto" }}
      >
        <Stack>
          <Text fz={"1.2rem"} fw={700}>
            Dados do pedido
          </Text>
          <Select
            searchable
            clearable
            data={getClientsToSelect(clientsData)}
            disabled={!clientsData}
            label="Cliente"
            placeholder="Selecione o cliente"
            withAsterisk
            {...form.getInputProps("clientId")}
          />
          <TextInput
            label="Nome do paciente"
            withAsterisk
            placeholder="Digite o nome do paciente"
            {...form.getInputProps("patientName")}
          />
          <Select
            searchable
            data={colors}
            disabled={!clientsData}
            label="Cor"
            clearable
            placeholder="Selecione a cor"
            {...form.getInputProps("color")}
          />
          <Textarea
            label="Observações"
            styles={{
              input: {
                height: "6rem",
                maxHeight: "6rem",
              },
            }}
            {...form.getInputProps("observations")}
          />
          <Text fz={".95rem"} fw={700}>
            Adicione o(s) serviço(s)
          </Text>
          <SimpleGrid cols={2}>
            <Select
              data={getServicesToSelect(servicesData)}
              label="Serviço"
              placeholder="Selecione o serviço"
              clearable
              disabled={!servicesData}
              {...form.getInputProps(`currentService.serviceId`)}
            />
            <MultiSelect
              label="Dentes"
              data={dent}
              clearable
              searchable
              styles={{
                input: {
                  maxHeight: "38px",
                  overflow: "auto",
                },
              }}
              {...form.getInputProps("currentService.dent")}
            />
            <NumberInput
              label="Qtd"
              {...form.getInputProps("currentService.amount")}
            />
            <Group h={"100%"} align="end">
              <Button variant="light" onClick={addService}>
                Ok
              </Button>
            </Group>
          </SimpleGrid>

          <Table.ScrollContainer minWidth={"100%"} h={"32vh"} mah={"32vh"}>
            <Table
              captionSide="top"
              striped
              highlightOnHover
              withTableBorder
              withColumnBorders
            >
              <Table.Thead>
                <Table.Th>Serviço</Table.Th>
                <Table.Th>Dentes</Table.Th>
                <Table.Th>Qtd</Table.Th>
                <Table.Th>Ações</Table.Th>
              </Table.Thead>
              <Table.Tbody>
                {form.values.services?.map((service: any, index: number) => (
                  <Table.Tr key={index}>
                    <Table.Td>
                      {`${getSelectedService(service?.serviceId as number)}`}
                    </Table.Td>
                    <Table.Td>{`${
                      typeof service?.dent === "object"
                        ? service?.dent?.join(", ")
                        : service?.dent
                    }`}</Table.Td>
                    <Table.Td>{`${service?.amount ?? 0}`}</Table.Td>
                    <Table.Td>
                      <ActionIcon
                        onClick={() => {
                          form.removeListItem("services", index);
                        }}
                        color="red"
                      >
                        <Trash />
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
            {!form.values.services?.length ? (
              <Box h={"24vh"}>
                <NoData />
              </Box>
            ) : null}
            {}
          </Table.ScrollContainer>
        </Stack>
      </Paper>
      <Group justify="space-between">
        <Button
          loading={createOrderIsLoading}
          variant="outline"
          onClick={() => navigate(-1)}
        >
          Cancelar
        </Button>
        <Button loading={createOrderIsLoading} onClick={onSubmit}>
          Salvar
        </Button>
      </Group>
    </Stack>
  );
}
