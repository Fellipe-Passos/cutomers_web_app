import {
  Button,
  Group,
  Radio,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { PatternFormat } from "react-number-format";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../../../components/ErrorMessage";
import { removeCPFMask } from "../../../utils";
import { login, loginSuccess } from "./Login.service";
import { LoginSchema, LoginSchemaInitialValues } from "./schema";

export default function Login() {
  const navigate = useNavigate();
  const { isLoading, mutate, error } = useMutation(login, {
    onSuccess: (data) => {
      loginSuccess(data);
      navigate("/view-orders");
    },
  });

  const err = error as any;

  const form = useForm({
    validate: yupResolver(LoginSchema),
    initialValues: LoginSchemaInitialValues,
    validateInputOnChange: true,
  });

  const onSubmit = (e: any) => {
    e.preventDefault();
    const { hasErrors } = form.validate();

    if (hasErrors) return;

    const dataToSend = {
      cpf: removeCPFMask(form.values.cpf),
    };

    mutate(dataToSend);
  };

  return (
    <Group bg="main" h={"100vh"} w={"100vw"} justify="center" align="center">
      <Stack
        w={"40rem"}
        bg={"white"}
        style={{ borderRadius: "8px" }}
        py={"5rem"}
        px={"2rem"}
      >
        <form style={{ height: "100%" }} onSubmit={onSubmit}>
          <Stack justify="center" h={"100%"}>
            <Title c={"main"}>Login</Title>
            <Text fz={".9rem"} c="gray">
              Informe seu CPF para acompanhar seus pedidos.
            </Text>
            <Radio.Group
              label="Tipo de cliente"
              {...form.getInputProps("type")}
            >
              <Group>
                <Radio label="Pessoa física" value={"PF"} />
                <Radio label="Pessoa jurídica" value={"PJ"} />
              </Group>
            </Radio.Group>
            <PatternFormat
              format={
                form.values.type === "PF"
                  ? "###.###.###-##"
                  : "##.###.###/####-##"
              }
              customInput={TextInput}
              label={form.values.type === "PF" ? "CPF" : "CNPJ"}
              mask={"_"}
              withAsterisk
              placeholder={
                form.values.type === "PF"
                  ? "000.000.000-00"
                  : "00.000.000/0000-00"
              }
              {...form.getInputProps("cpf")}
            />
            {Boolean(err) && <ErrorMessage text={err?.response?.data} />}
            <Button
              mt={"1.8rem"}
              variant="filled"
              fullWidth
              type="submit"
              // onClick={onSubmit}
              loading={isLoading}
            >
              Entrar
            </Button>
          </Stack>
        </form>
      </Stack>
    </Group>
  );
}
