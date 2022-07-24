import { Input as InputNB, IInputProps } from "native-base";

export function Input({ ...rest }: IInputProps) {
  return (
    <InputNB
      bg="gray.700"
      h={14}
      size="md"
      borderWidth={1}
      borderColor="gray.300"
      fontSize="md"
      fontFamily="body"
      color="white"
      placeholderTextColor="gray.300"
      _focus={{
        borderColor: "green.500",
        bg: "gray.700",
      }}
      {...rest}
    />
  );
}
