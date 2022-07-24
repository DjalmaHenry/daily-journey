import { useState } from "react";
import {
  HStack,
  IconButton,
  VStack,
  useTheme,
  Text,
  Heading,
} from "native-base";
import { SignOut } from "phosphor-react-native";
import Logo from "../assets/logo_secondary.svg";
import { Filter } from "../components/filter";

export function Home() {
  const [statusSelected, setStatusSelected] = useState<
    "todo" | "doing" | "done"
  >("todo");
  const { colors } = useTheme();

  return (
    <VStack flex={1} pb={6} bg="gray.700">
      <HStack
        w="full"
        justifyContent="space-between"
        alignItems="center"
        bg="gray.600"
        pt={12}
        px={6}
      >
        <Logo width={200} />
        <IconButton icon={<SignOut size={26} color={colors.gray[300]} />} />
      </HStack>

      <VStack flex={1} px={6}>
        <HStack
          w="full"
          mt={8}
          mb={4}
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading color="gray.100">Tarefas</Heading>
          <Text color="gray.200">3</Text>
        </HStack>

        <HStack space={3} mb={8}>
          <Filter
            type="todo"
            title="a fazer"
            onPress={() => setStatusSelected("todo")}
            isActive={statusSelected === "todo"}
          />
          <Filter
            type="doing"
            title="fazendo"
            onPress={() => setStatusSelected("doing")}
            isActive={statusSelected === "doing"}
          />
          <Filter
            type="done"
            title="finalizados"
            onPress={() => setStatusSelected("done")}
            isActive={statusSelected === "done"}
          />
        </HStack>
      </VStack>
    </VStack>
  );
}
