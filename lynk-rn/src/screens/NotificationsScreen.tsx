import React from "react";
import { View, Text, ScrollView } from "react-native";
import Toggle from "@/components/Toggle";
import { useApp } from "@/context/AppContext";
import { t } from "@/i18n/translations";

export default function NotificationsScreen() {
  const { state, dispatch } = useApp();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#F3F4F6" }}
      contentContainerStyle={{ padding: 20 }}
    >
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 12,
          padding: 12,
          borderWidth: 1,
          borderColor: "#E5E7EB",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontWeight: "800", color: "#111827" }}>
            {t.enableNotifications[state.language]}
          </Text>
          <Toggle
            value={state.notifications.all}
            onChange={() =>
              dispatch({ type: "TOGGLE_NOTIFICATION", key: "all" })
            }
          />
        </View>
      </View>

      <View style={{ opacity: state.notifications.all ? 1 : 0.5 }}>
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 12,
            borderWidth: 1,
            borderColor: "#E5E7EB",
            marginTop: 12,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text style={{ fontWeight: "800", color: "#111827" }}>
                {t.etaAlerts[state.language]}
              </Text>
              <Text style={{ fontSize: 12, color: "#6B7280" }}>
                {t.etaAlertsDesc[state.language]}
              </Text>
            </View>
            <Toggle
              value={state.notifications.etaAlerts}
              onChange={() =>
                dispatch({ type: "TOGGLE_NOTIFICATION", key: "etaAlerts" })
              }
            />
          </View>
        </View>
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 12,
            borderWidth: 1,
            borderColor: "#E5E7EB",
            marginTop: 12,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text style={{ fontWeight: "800", color: "#111827" }}>
                {t.promotions[state.language]}
              </Text>
              <Text style={{ fontSize: 12, color: "#6B7280" }}>
                {t.promotionsDesc[state.language]}
              </Text>
            </View>
            <Toggle
              value={state.notifications.promotions}
              onChange={() =>
                dispatch({ type: "TOGGLE_NOTIFICATION", key: "promotions" })
              }
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
