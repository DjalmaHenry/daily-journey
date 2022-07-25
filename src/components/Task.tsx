import {
  VStack,
  HStack,
  Text,
  Box,
  Circle,
  useTheme,
  Pressable,
  IPressableProps
} from "native-base";
import {
  ClockAfternoon,
  Hourglass,
  CircleWavyWarning,
  CircleWavyCheck,
} from "phosphor-react-native";

export type TaskProps = {
  id: string;
  title: string;
  when: string;
  status: "todo" | "doing" | "done";
};

type Props = IPressableProps & {
  data: TaskProps;
};

export function Task({ data, ...rest }: Props) {
  const { colors } = useTheme();
  const statusColor =
    data.status === "todo"
      ? colors.primary[700]
      : data.status === "doing"
      ? colors.secondary[700]
      : colors.green[300];
  return (
    <Pressable {...rest}>
      <HStack
        bg="gray.600"
        mb={4}
        alignItems="center"
        justifyContent="space-between"
        rounded="sm"
        overflow="hidden"
      >
        <Box h="full" w={2} bg={statusColor} />
        <VStack flex={1} my={5} ml={5}>
          <Text color="white" fontSize="md">
            {data.title}
          </Text>

          <HStack alignItems="center">
            <ClockAfternoon size={15} color={colors.gray[300]} />
            <Text color="gray.200" fontSize="xs" ml={1}>
              {data.when}
            </Text>
          </HStack>
        </VStack>

        <Circle bg="gray.500" h={12} w={12} mr={5}>
          {data.status === "done" ? (
            <CircleWavyCheck size={24} color={statusColor} />
          ) : data.status === "doing" ? (
            <Hourglass size={24} color={statusColor} />
          ) : (
            <CircleWavyWarning size={24} color={statusColor} />
          )}
        </Circle>
      </HStack>
    </Pressable>
  );
}
