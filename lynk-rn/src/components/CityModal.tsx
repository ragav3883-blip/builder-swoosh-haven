import React from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { useApp } from "@/context/AppContext";
import { t } from "@/i18n/translations";

const cities = ["Chennai", "Punjab"] as const;

export default function CityModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { state, dispatch } = useApp();
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable
        onPress={onClose}
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            width: "80%",
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 16,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 8 }}>
            {t.selectCity[state.language]}
          </Text>
          {cities.map((c) => (
            <Pressable
              key={c}
              onPress={() => {
                dispatch({ type: "SET_CITY", city: c });
                onClose();
              }}
              style={{
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: "#E5E7EB",
              }}
            >
              <Text>{c}</Text>
            </Pressable>
          ))}
          <Pressable
            onPress={onClose}
            style={{
              marginTop: 12,
              paddingVertical: 12,
              borderWidth: 1,
              borderColor: "#E5E7EB",
              borderRadius: 10,
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "700" }}>
              {t.cancel[state.language]}
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
