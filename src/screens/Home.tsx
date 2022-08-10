import { useState, useEffect } from "react";
import {
  HStack,
  IconButton,
  VStack,
  useTheme,
  Text,
  Heading,
  FlatList,
  Center,
} from "native-base";
import { SignOut } from "phosphor-react-native";
import Logo from "../assets/logo_secondary.svg";
import { Filter } from "../components/Filter";
import { Button } from "../components/Button";
import { Task, TaskProps } from "../components/Task";
import { Confetti, SmileySad } from "phosphor-react-native";
import { useNavigation } from "@react-navigation/native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { Alert } from "react-native";
import { dateFormat } from "../utils/firestoreDateFormat";
import Loading from "../components/Loading";

export function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [statusSelected, setStatusSelected] = useState<
    "todo" | "doing" | "done"
  >("todo");

  const [tasks, setTasks] = useState<TaskProps[]>([]);
  const { colors } = useTheme();
  const navigation = useNavigation();

  function handleNewTask() {
    navigation.navigate("new");
  }

  function handleOpenDetails(taskId: string) {
    navigation.navigate("details", { taskId });
  }

  function handleLogout() {
    auth()
      .signOut()
      .catch((error) => {
        console.log(error);
        return Alert.alert("Sair", "Não foi possível sair.");
      });
  }

  useEffect(() => {
    setIsLoading(true);

    const subscriber = firestore()
      .collection("tasks")
      .where("status", "==", statusSelected)
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const { title, description, status, created_at } = doc.data();
          return {
            id: doc.id,
            title,
            description,
            status,
            when: dateFormat(created_at),
          };
        });
        setTasks(data);
        setIsLoading(false);
      });

    return subscriber;
  }, [statusSelected]);

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
        <IconButton
          icon={<SignOut size={26} color={colors.gray[300]} />}
          onPress={handleLogout}
        />
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
          <Text color="gray.200">{tasks.length}</Text>
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
            title="finalizadas"
            onPress={() => setStatusSelected("done")}
            isActive={statusSelected === "done"}
          />
        </HStack>

        {isLoading ? (
          <Loading />
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Task data={item} onPress={() => handleOpenDetails(item.id)} />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            ListEmptyComponent={() => (
              <Center>
                {statusSelected === "done" ? (
                  <SmileySad color={colors.gray[300]} size={40} />
                ) : (
                  <Confetti color={colors.gray[300]} size={40} />
                )}
                <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
                  Nenhuma tarefa{" "}
                  {statusSelected === "todo"
                    ? "a fazer"
                    : statusSelected === "doing"
                    ? "em andamento"
                    : "finalizada"}
                </Text>
              </Center>
            )}
          />
        )}

        <Button title="Nova Tarefa" onPress={handleNewTask} mb={5} mt={5} />
      </VStack>
    </VStack>
  );
}
