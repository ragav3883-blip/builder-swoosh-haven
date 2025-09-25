import React from "react";
import { Pressable, View } from "react-native";

export default function Toggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: () => void;
}) {
  return (
    <Pressable
      onPress={onChange}
      style={{
        width: 48,
        height: 28,
        borderRadius: 999,
        padding: 4,
        backgroundColor: value ? "#3B82F6" : "#D1D5DB",
      }}
    >
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 999,
          backgroundColor: "#fff",
          transform: [{ translateX: value ? 20 : 0 }],
          elevation: 2,
        }}
      />
    </Pressable>
  );
}
