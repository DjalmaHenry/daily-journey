import { VStack, Text, HStack, useTheme, ScrollView, Box } from "native-base";
import { Alert } from "react-native";
import { Header } from "../components/Header";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { TaskProps } from "../components/Task";
import firestore from "@react-native-firebase/firestore";
import { TaskFirestoreDTO } from "../DTOs/TaskFirestoreDTO";
import { dateFormat } from "../utils/firestoreDateFormat";
import Loading from "../components/Loading";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { CardDetails } from "../components/CardDetails";
import {
  CircleWavyCheck,
  Hourglass,
  CircleWavyWarning,
  ClipboardText,
} from "phosphor-react-native";

type RouteParams = {
  taskId: string;
};

type TaskDetails = TaskProps & {
  description: string;
  solution: string;
  closed: string;
};

export function Details() {
  const [solution, setSolution] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [task, setTask] = useState<TaskDetails>({} as TaskDetails);
  const navigation = useNavigation();
  const route = useRoute();
  const { taskId } = route.params as RouteParams;
  const { colors } = useTheme();
  const statusColor =
    task.status === "todo"
      ? colors.primary[700]
      : task.status === "doing"
      ? colors.secondary[700]
      : colors.green[300];

  function handleTaskStatusChange(status: "todo" | "doing" | "done") {
    if (status === "todo") {
      firestore()
        .collection<TaskFirestoreDTO>("tasks")
        .doc(taskId)
        .update({
          status: "doing",
        })
        .then(() => {
          Alert.alert("Tarefa", "Status da tarefa alterado para fazendo.");
          navigation.goBack();
        })
        .catch((error) => {
          console.log(error);
          Alert.alert("Tarefa", "Não foi possível alterar o status da tarefa.");
        });
    } else if (status === "doing") {
      if (!solution) {
        return Alert.alert(
          "Tarefa",
          "Favor informe a solução para finalizar a tarefa."
        );
      }

      firestore()
        .collection<TaskFirestoreDTO>("tasks")
        .doc(taskId)
        .update({
          status: "done",
          solution,
          closed_at: firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          Alert.alert("Tarefa", "Tarefa finalizada com sucesso.");
          navigation.goBack();
        })
        .catch((error) => {
          console.log(error);
          Alert.alert("Tarefa", "Não foi possível finalizar a tarefa.");
        });
    } else {
      firestore()
        .collection<TaskFirestoreDTO>("tasks")
        .doc(taskId)
        .delete()
        .then(() => {
          Alert.alert("Tarefa", "Tarefa excluída com sucesso.");
          navigation.goBack();
        })
        .catch((error) => {
          console.log(error);
          Alert.alert("Tarefa", "Não foi possível excluir a tarefa.");
        });
    }
  }

  useEffect(() => {
    firestore()
      .collection<TaskFirestoreDTO>("tasks")
      .doc(taskId)
      .get()
      .then((doc) => {
        const { title, description, status, created_at, closed_at, solution } =
          doc.data();

        const closed = closed_at ? dateFormat(closed_at) : null;

        setTask({
          id: doc.id,
          title,
          description,
          status,
          when: dateFormat(created_at),
          closed,
          solution,
        });

        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <VStack flex={1} bg="gray.700">
      <Box px={6} bg="gray.600">
        <Header title="Tarefa" />
      </Box>

      <HStack bg="gray.500" justifyContent="center" p={4}>
        {task.status === "done" ? (
          <CircleWavyCheck size={22} color={statusColor} />
        ) : task.status === "doing" ? (
          <Hourglass size={22} color={statusColor} />
        ) : (
          <CircleWavyWarning size={22} color={statusColor} />
        )}

        <Text
          fontSize="sm"
          color={statusColor}
          ml={2}
          textTransform="uppercase"
        >
          {task.status === "done"
            ? "Finalizado"
            : task.status === "doing"
            ? "Fazendo"
            : "A fazer"}
        </Text>
      </HStack>

      <ScrollView mx={5} showsVerticalScrollIndicator={false}>
        <CardDetails
          title="Título"
          description={task.title}
          icon={CircleWavyWarning}
        />

        <CardDetails
          title="Descrição"
          description={task.description}
          icon={ClipboardText}
          footer={`Criado em ${task.when}`}
        />

        {task.status !== "todo" && (
          <CardDetails
            title="Solução"
            icon={CircleWavyCheck}
            description={task.solution}
            footer={task.closed && `Finalizado em ${task.closed}`}
          >
            {task.status === "doing" && (
              <Input
                placeholder="Descrição da solução"
                onChangeText={setSolution}
                textAlignVertical="top"
                multiline
                h={24}
              />
            )}
          </CardDetails>
        )}
      </ScrollView>

      {task.status === "todo" ? (
        <Button
          title="Fazer Tarefa"
          m={5}
          mb={10}
          onPress={() => handleTaskStatusChange(task.status)}
        />
      ) : task.status === "doing" ? (
        <Button
          title="Encerrar Tarefa"
          m={5}
          mb={10}
          onPress={() => handleTaskStatusChange(task.status)}
        />
      ) : (
        <Button
          title="Excluir Tarefa"
          m={5}
          mb={10}
          onPress={() => handleTaskStatusChange(task.status)}
        />
      )}
    </VStack>
  );
}
