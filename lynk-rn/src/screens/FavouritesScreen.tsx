import React, { useMemo } from "react";
import { View, Text, ScrollView } from "react-native";
import { useApp } from "@/context/AppContext";
import RouteCard from "@/components/RouteCard";

export default function FavouritesScreen() {
  const { state } = useApp();
  const allRoutes = useMemo(
    () => (state.currentCity === "Punjab" ? [] : []),
    [state.currentCity],
  );
  // We show favourites across both cities
  const favIds = state.favorites;
  const chennai = require("@/data/cities").chennaiData.routes;
  const punjab = require("@/data/cities").punjabData.routes;
  const favoriteRoutes = [...chennai, ...punjab].filter((r: any) =>
    favIds.includes(r.id),
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#F3F4F6" }}
      contentContainerStyle={{ padding: 20 }}
    >
      <Text style={{ fontSize: 22, fontWeight: "800" }}>Favourites</Text>
      {favoriteRoutes.length > 0 ? (
        <View style={{ marginTop: 16 }}>
          {favoriteRoutes.map((r: any) => (
            <RouteCard key={r.id} route={r} />
          ))}
        </View>
      ) : (
        <View style={{ alignItems: "center", marginTop: 80 }}>
          <Text style={{ color: "#6B7280" }}>
            Your saved routes will appear here.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
