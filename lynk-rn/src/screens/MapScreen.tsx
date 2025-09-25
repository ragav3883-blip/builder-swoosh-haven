import React, { useEffect, useMemo, useRef } from "react";
import { View, Text } from "react-native";
import { WebView } from "react-native-webview";
import { useRoute } from "@react-navigation/native";
import { useApp } from "@/context/AppContext";
import { leafletHTML } from "@/utils/leafletTemplate";

export default function MapScreen() {
  const route = useRoute<any>();
  const { data } = useApp();
  const webRef = useRef<WebView>(null);
  const selected = useMemo(
    () => data.routes.find((r) => r.id === route.params.routeId)!,
    [data.routes, route.params.routeId],
  );

  useEffect(() => {
    const payload = JSON.stringify({
      startCoords: selected.startCoords,
      endCoords: selected.endCoords,
      path: selected.path,
      mapCenter: selected.mapCenter,
      mapZoom: selected.mapZoom,
    });
    const timer = setTimeout(() => {
      webRef.current?.postMessage(payload);
    }, 500);
    return () => clearTimeout(timer);
  }, [selected]);

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 2,
          margin: 16,
          backgroundColor: "#fff",
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#E5E7EB",
          padding: 12,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 999,
              backgroundColor: "#DBEAFE",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
            }}
          />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: "800", color: "#111827" }}>
              {selected.name}
            </Text>
            <Text style={{ fontSize: 14, color: "#6B7280" }}>
              To {selected.to}
            </Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ fontSize: 18, fontWeight: "800", color: "#16A34A" }}>
              4 min
            </Text>
            <Text style={{ fontSize: 14, color: "#6B7280" }}>ETA</Text>
          </View>
        </View>
      </View>
      <WebView
        ref={webRef}
        originWhitelist={["*"]}
        source={{ html: leafletHTML() }}
        style={{ flex: 1 }}
        allowUniversalAccessFromFileURLs
        javaScriptEnabled
      />
    </View>
  );
}
