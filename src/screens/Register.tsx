import { useState } from "react";
import { VStack } from "native-base";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";
import { firebase } from "@react-native-firebase/auth";

export function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const navigation = useNavigation();

  function handleNewTaskRegister() {
    if (!title || !description) {
      return Alert.alert("Registrar", "Preencha todos os campos.");
    }

    setIsLoading(true);

    firestore()
      .collection("tasks")
      .add({
        title,
        description,
        status: "todo",
        created_at: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        Alert.alert("Solicitação", "Solicitação registrada com sucesso.");
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        return Alert.alert(
          "Solicitação",
          "Não foi possível registrar o pedido."
        );
      });
  }

  return (
    <VStack flex={1} p={6} bg="gray.600">
      <Header title="Nova Tarefa" />

      <Input placeholder="Título da tarefa" mt={4} onChangeText={setTitle} />

      <Input
        placeholder="Descrição da tarefa"
        flex={1}
        mt={5}
        multiline
        textAlignVertical="top"
        onChangeText={setDescription}
      />

      <Button
        title="Criar"
        mt={5}
        mb={5}
        isLoading={isLoading}
        onPress={handleNewTaskRegister}
      />
    </VStack>
  );
}
