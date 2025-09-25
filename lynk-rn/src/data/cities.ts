export type RouteDef = {
  id: string;
  name: string;
  from: string;
  to: string;
  eta: string;
  startCoords: [number, number];
  endCoords: [number, number];
  mapCenter: [number, number];
  mapZoom: number;
  path: [number, number][];
};

export type StopsData = {
  locationName: string;
  count: string;
  list: { name: string; distance: string; buses: string }[];
};

export type CityData = {
  routes: RouteDef[];
  stops: {
    locationName: string;
    count: string;
    list: { name: string; distance: string; buses: string }[];
  };
};

export const chennaiData: CityData = {
  routes: [
    {
      id: "M88",
      name: "M88",
      from: "T. Nagar",
      to: "Vadapalani",
      eta: "5 min",
      startCoords: [13.037, 80.229],
      endCoords: [13.051, 80.213],
      mapCenter: [13.044, 80.221],
      mapZoom: 14,
      path: [
        [13.037, 80.229],
        [13.038, 80.227],
        [13.039, 80.225],
        [13.04, 80.223],
        [13.042, 80.22],
        [13.043, 80.218],
        [13.045, 80.216],
        [13.046, 80.215],
        [13.048, 80.214],
        [13.05, 80.2135],
        [13.051, 80.213],
      ],
    },
  ],
  stops: {
    locationName: "T. Nagar Bus Terminus",
    count: "3 stops near you",
    list: [
      {
        name: "T. Nagar Bus Terminus",
        distance: "50m",
        buses: "M88, 12C, 29A",
      },
      { name: "Panagal Park", distance: "250m", buses: "M88, 47D" },
      { name: "Vivekananda House", distance: "500m", buses: "12C, 21G" },
    ],
  },
};

export const punjabData: CityData = {
  routes: [
    {
      id: "PRTC-7",
      name: "PRTC 7",
      from: "Patiala",
      to: "Chandigarh",
      eta: "15 min",
      startCoords: [30.3398, 76.3869],
      endCoords: [30.7333, 76.7794],
      mapCenter: [30.53, 76.58],
      mapZoom: 10,
      path: [
        [30.3398, 76.3869],
        [30.4905, 76.5943],
        [30.6384, 76.7495],
        [30.7333, 76.7794],
      ],
    },
    {
      id: "PRTC-6",
      name: "PRTC 6",
      from: "Patiala",
      to: "Bathinda",
      eta: "25 min",
      startCoords: [30.3398, 76.3869],
      endCoords: [30.21, 74.9455],
      mapCenter: [30.25, 75.66],
      mapZoom: 9,
      path: [
        [30.3398, 76.3869],
        [30.2136, 75.9818],
        [30.2319, 75.5976],
        [30.015, 75.2981],
        [30.21, 74.9455],
      ],
    },
    {
      id: "CHD-1",
      name: "CHD 1",
      from: "Chandigarh",
      to: "Bathinda",
      eta: "8 min",
      startCoords: [30.7333, 76.7794],
      endCoords: [30.21, 74.9455],
      mapCenter: [30.45, 75.8],
      mapZoom: 9,
      path: [
        [30.7333, 76.7794],
        [30.3398, 76.3869],
        [30.2136, 75.9818],
        [30.2319, 75.5976],
        [30.21, 74.9455],
      ],
    },
  ],
  stops: {
    locationName: "Patiala Bus Stand",
    count: "4 stops near you",
    list: [
      { name: "Patiala Bus Stand", distance: "100m", buses: "PRTC 7, PRTC 6" },
      { name: "Leela Bhawan", distance: "400m", buses: "PRTC 7" },
      { name: "Rajpura Colony", distance: "850m", buses: "PRTC 6" },
      { name: "Urban Estate", distance: "1.5km", buses: "PRTC 7, PRTC 6" },
    ],
  },
};
