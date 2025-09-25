import React, { useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import {
  Link2,
  MapPin,
  BusStop,
  ChevronRight,
  Search,
} from "lucide-react-native";
import { useApp } from "@/context/AppContext";
import RouteCard from "@/components/RouteCard";
import CityModal from "@/components/CityModal";
import { t } from "@/i18n/translations";

export default function HomeScreen() {
  const { state, dispatch, data } = useApp();
  const [cityModal, setCityModal] = useState(false);
  const results = useMemo(() => {
    if (!state.searchQuery) return [];
    const q = state.searchQuery.toLowerCase();
    return data.routes.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.from.toLowerCase().includes(q) ||
        r.to.toLowerCase().includes(q),
    );
  }, [state.searchQuery, data.routes]);
  const defaultRoute = data.routes[0];

  return (
    <View style={{ flex: 1, backgroundColor: "#F3F4F6" }}>
      <CityModal visible={cityModal} onClose={() => setCityModal(false)} />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        style={{ flex: 1 }}
      >
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Link2 color="#111827" />
            <Text
              style={{
                fontSize: 24,
                fontWeight: "800",
                marginLeft: 8,
                color: "#111827",
              }}
            >
              LYNK
            </Text>
          </View>
          <Pressable
            onPress={() => setCityModal(true)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#fff",
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: "#E5E7EB",
            }}
          >
            <MapPin color="#111827" size={18} />
            <Text style={{ fontWeight: "700", marginLeft: 6 }}>
              {state.currentCity}
            </Text>
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: 16 }}>
          <Text style={{ fontSize: 28, fontWeight: "800", color: "#111827" }}>
            {t.hello[state.language]}
            {state.isLoggedIn && state.user?.displayName
              ? `, ${state.user.displayName.split(" ")[0]}`
              : ""}
            !
          </Text>
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: 16 }}>
          <View style={{ position: "relative" }}>
            <View style={{ position: "absolute", left: 14, top: 14 }}>
              <Search color="#9CA3AF" size={20} />
            </View>
            <TextInput
              value={state.searchQuery}
              onChangeText={(v) => dispatch({ type: "SET_SEARCH", query: v })}
              placeholder={t.findBus[state.language]}
              style={{
                backgroundColor: "#fff",
                borderRadius: 999,
                paddingVertical: 12,
                paddingLeft: 40,
                paddingRight: 16,
                borderWidth: 1,
                borderColor: "#E5E7EB",
                fontSize: 16,
              }}
            />
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: 16 }}>
          {results.map((r) => (
            <RouteCard key={r.id} route={r} />
          ))}
        </View>

        {state.searchQuery.length === 0 && (
          <>
            <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "800",
                  color: "#111827",
                  marginBottom: 12,
                }}
              >
                {t.searchResult[state.language]}
              </Text>
              <RouteCard route={defaultRoute} />
              <Text
                style={{
                  fontSize: 12,
                  color: "#6B7280",
                  textAlign: "center",
                  marginTop: 6,
                }}
              >
                {t.clickToSeeMap[state.language]}
              </Text>
            </View>

            <View style={{ paddingHorizontal: 20, marginTop: 12 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "800",
                  color: "#111827",
                  marginBottom: 12,
                }}
              >
                {t.nearbyStops[state.language]}
              </Text>
              <View
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                  marginBottom: 10,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
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
                >
                  <BusStop color="#3B82F6" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      color: "#111827",
                    }}
                  >
                    {data.stops.locationName}
                  </Text>
                  <Text style={{ fontSize: 12, color: "#6B7280" }}>
                    {data.stops.count}
                  </Text>
                </View>
                <ChevronRight color="#111827" />
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
