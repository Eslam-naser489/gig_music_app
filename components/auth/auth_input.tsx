// components/auth/AuthInput.tsx
import { StyleSheet, TextInput, TextInputProps } from "react-native";

export const AuthInput = (props: TextInputProps) => {
  return (
    <TextInput style={styles.input} placeholderTextColor="#888" {...props} />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#FBE9E4",
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#171827",
    marginBottom: 16,
    width: "100%",
  },
});
