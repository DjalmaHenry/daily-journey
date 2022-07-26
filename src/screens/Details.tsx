import { VStack, Text } from "native-base";
import { Header } from "../components/Header";
import { useRoute } from "@react-navigation/native";

type RouteParams = {
  taskId: string;
};

export function Details() {
  const route = useRoute();
  const { taskId } = route.params as RouteParams;

  return (
    <VStack flex={1} bg="gray.700">
      <Header title="Tarefa" />
      <Text color="white">Detalhes da tarefa {taskId}</Text>
    </VStack>
  );
}
