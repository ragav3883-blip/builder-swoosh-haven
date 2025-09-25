import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Home as HomeIcon,
  Star as StarIcon,
  Settings as SettingsIcon,
  Link2,
  MapPin,
  BusStop,
  ChevronRight,
  Search,
  ArrowLeft,
  Map as MapIcon,
  Bus,
} from "lucide-react";

// --- Types ---
interface RouteDef {
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
}

interface CityData {
  routes: RouteDef[];
  stops: {
    locationName: string;
    count: string;
    list: { name: string; distance: string; buses: string }[];
  };
}

type Lang = "en" | "hi" | "pa";

// --- Data ---
const chennaiData: CityData = {
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

const punjabData: CityData = {
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

const translations = {
  selectCity: { en: "Select City", hi: "शहर चुनें", pa: "ਸ਼ਹਿਰ ਚੁਣੋ" },
  cancel: { en: "Cancel", hi: "रद्द करें", pa: "ਰੱਦ ਕਰੋ" },
  logout: { en: "Log Out", hi: "लॉग आउट", pa: "ਲਾਗ ਆਉਟ" },
  areYouSure: {
    en: "Are you sure you want to log out?",
    hi: "क्या आप वाकई लॉग आउट करना चाहते हैं?",
    pa: "ਕੀ ਤੁਸੀਂ ਯਕੀਨਨ ਲੌਗ ਆਉਟ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ?",
  },
  findBus: {
    en: "Find and track your bus",
    hi: "अपनी बस ढूंढें और ट्रैक करें",
    pa: "ਆਪਣੀ ਬੱਸ ਲੱਭੋ ਅਤੇ ਟਰੈਕ ਕਰੋ",
  },
  searchResult: { en: "Search Result", hi: "खोज परिणाम", pa: "ਖੋਜ ਨਤੀਜਾ" },
  eta: { en: "ETA", hi: "ETA", pa: "ETA" },
  clickToSeeMap: {
    en: "(Click the result above to see the map)",
    hi: "(नक्शा देखने के लिए ऊपर दिए गए परिणाम पर क्लिक करें)",
    pa: "(ਨਕਸ਼ਾ ਦੇਖਣ ਲਈ ਉਪਰੋਕਤ ਨਤੀਜੇ ਤੇ ਕਲਿਕ ਕਰੋ)",
  },
  nearbyStops: {
    en: "Nearby Bus Stops",
    hi: "आस-पास के बस स्टॉप",
    pa: "ਨੇੜਲੇ ਬੱਸ ਸਟਾਪ",
  },
  favourites: { en: "Favourites", hi: "पसंदीदा", pa: "ਮਨਪਸੰਦ" },
  noFavourites: {
    en: "Your saved routes will appear here.",
    hi: "आपके सहेजे गए मार्ग यहां दिखाई देंगे।",
    pa: "ਤੁਹਾਡੇ ਸੁਰੱਖਿਅਤ ਕੀਤੇ ਰੂਟ ਇੱਥੇ ਦਿਖਾਈ ਦੇਣਗੇ।",
  },
  settings: { en: "Settings", hi: "सेटिंग्स", pa: "ਸੈਟਿੰਗਜ਼" },
  editProfile: {
    en: "Edit Profile",
    hi: "प्रोफ़ाइल संपादित करें",
    pa: "ਪ੍ਰੋਫਾਈਲ ਸੋਧੋ",
  },
  notifications: { en: "Notifications", hi: "सूचनाएं", pa: "ਸੂਚਨਾਵਾਂ" },
  privacy: { en: "Privacy", hi: "गोपनीयता", pa: "ਗੋਪਨੀਯਤਾ" },
  language: { en: "Language", hi: "भाषा", pa: "ਭਾਸ਼ਾ" },
  home: { en: "Home", hi: "होम", pa: "ਹੋਮ" },
  liveLocation: { en: "Live Location", hi: "लाइव लोकेशन", pa: "ਲਾਈਵ ਟਿਕਾਣਾ" },
  nextStop: { en: "Next Stop", hi: "अगला स्टॉप", pa: "ਅਗਲਾ ਸ��ਾਪ" },
  distanceAway: { en: "away", hi: "दूर", pa: "ਦੂਰ" },
  nearbyStopsTitle: {
    en: "Nearby Stops",
    hi: "आस-पास के स्टॉप",
    pa: "ਨੇੜਲੇ ਸਟਾਪ",
  },
  enableNotifications: {
    en: "Enable All Notifications",
    hi: "सभी सूचनाएं सक्षम करें",
    pa: "ਸਾਰੀਆਂ ਸੂਚਨਾਵਾਂ ਨੂੰ ਸਮਰੱਥ ਕਰੋ",
  },
  etaAlerts: { en: "ETA Alerts", hi: "ETA अलर्ट", pa: "ETA ਅਲਰਟ" },
  etaAlertsDesc: {
    en: "Get notified when your bus is arriving.",
    hi: "आपकी बस आने पर सूचना प्राप्त करें।",
    pa: "ਜਦੋਂ ਤੁਹਾਡੀ ਬੱਸ ਆ ਰਹੀ ਹੋਵੇ ਤਾਂ ਸੂਚਨਾ ਪ੍ਰਾਪਤ ਕਰੋ।",
  },
  promotions: {
    en: "Promotions & Offers",
    hi: "प्रचार और ऑफ़र",
    pa: "ਪ੍ਰਮੋਸ਼ਨ ਅਤੇ ਪੇਸ਼ਕਸ਼ਾਂ",
  },
  promotionsDesc: {
    en: "Receive updates on special deals.",
    hi: "विशेष सौदों पर अपडेट प्राप्त करें।",
    pa: "ਵਿਸ਼ੇਸ਼ ਸੌਦਿਆਂ ‘ਤੇ ਅੱਪਡੇਟ ਪ੍ਰਾਪਤ ਕਰੋ।",
  },
  locationSharing: {
    en: "Location Sharing",
    hi: "स���थान साझाकरण",
    pa: "ਟਿਕਾਣਾ ਸਾਂਝਾਕਰਨ",
  },
  locationSharingDesc: {
    en: "Allow LYNK to use your location to find nearby stops.",
    hi: "लिंक को आस-पास के स्टॉप खोजने के लिए अपने स्थान का उपयोग करने की अनुमति दें।",
    pa: "ਲਿੰਕ ਨੂੰ ਨੇੜਲੇ ਸਟਾਪਾਂ ਨੂੰ ਲੱਭਣ ਲਈ ਤੁਹਾਡੇ ਟਿਕਾਣੇ ਦੀ ਵਰਤੋਂ ਕਰਨ ਦੀ ਇਜਾਜ਼ਤ ਦਿਓ।",
  },
  loginWithGoogle: {
    en: "Log In with Google",
    hi: "Google के साथ लॉग इन करें",
    pa: "Google ਨਾਲ ਲੌਗ ਇਨ ਕਰੋ",
  },
  editProfileTitle: {
    en: "Edit Profile",
    hi: "प्रोफ़ाइल संपादित करें",
    pa: "ਪ੍ਰੋਫਾਈਲ ਸੋਧੋ",
  },
  fullName: { en: "Full Name", hi: "पूरा नाम", pa: "ਪੂਰਾ ਨਾਮ" },
  save: { en: "Save", hi: "सहेजें", pa: "ਸੇਵ ਕਰੋ" },
  hello: { en: "Hello", hi: "नमस्ते", pa: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ" },
} as const;

// --- UI Helpers ---
function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`${value ? "bg-blue-500 justify-end" : "bg-gray-300 justify-start"} w-12 h-7 rounded-full p-1 flex items-center transition-colors`}
    >
      <div className="w-5 h-5 bg-white rounded-full shadow-md" />
    </button>
  );
}

function RouteCard({ route, onOpen }: { route: RouteDef; onOpen: () => void }) {
  const [favorites, setFavorites] = useLocalFavorites();
  const isFavorite = favorites.includes(route.id);
  return (
    <div className="bg-white rounded-xl p-4 flex flex-row items-center border border-gray-200 mb-2.5 shadow-sm">
      <div onClick={onOpen} className="flex-1 flex items-center cursor-pointer">
        <div className="w-11 h-11 rounded-full flex justify-center items-center mr-4 bg-blue-100">
          <MapIcon className="text-blue-500" />
        </div>
        <div className="flex-1">
          <p className="text-base font-bold text-gray-900">{route.name}</p>
          <p className="text-xs text-gray-500">To {route.to}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-900">{route.eta}</p>
          <p className="text-xs text-gray-500">ETA</p>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          const next = isFavorite
            ? favorites.filter((x) => x !== route.id)
            : [...favorites, route.id];
          setFavorites(next);
        }}
        className="ml-4 p-2"
      >
        <StarIcon
          className={
            isFavorite ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
          }
        />
      </button>
    </div>
  );
}

function useLocalFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem("lynk-favs");
      return raw ? (JSON.parse(raw) as string[]) : ["M88"];
    } catch {
      return ["M88"];
    }
  });
  useEffect(() => {
    localStorage.setItem("lynk-favs", JSON.stringify(favorites));
  }, [favorites]);
  return [favorites, setFavorites] as const;
}

// --- Screens ---
function HomeScreen(props: {
  lang: Lang;
  isLoggedIn: boolean;
  userName?: string | null;
  city: "Punjab" | "Chennai";
  onCityModal: () => void;
  search: string;
  setSearch: (v: string) => void;
}) {
  const data = props.city === "Punjab" ? punjabData : chennaiData;
  const results = useMemo(() => {
    if (!props.search) return [] as RouteDef[];
    const q = props.search.toLowerCase();
    return data.routes.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.from.toLowerCase().includes(q) ||
        r.to.toLowerCase().includes(q),
    );
  }, [props.search, data.routes]);
  const defaultRoute = data.routes[0];

  return (
    <div
      className="screen-content overflow-y-auto"
      style={{ height: "calc(100% - 70px)" }}
    >
      <div className="flex justify-between items-center p-5">
        <div className="flex items-center">
          <Link2 className="text-gray-800" />
          <span className="text-2xl font-bold ml-2 text-gray-800">LYNK</span>
        </div>
        <button
          onClick={props.onCityModal}
          className="flex items-center bg-white px-3 py-2 rounded-full border border-gray-200 shadow-sm"
        >
          <MapPin className="w-4 h-4 mr-1.5" />
          <span className="font-semibold text-sm">{props.city}</span>
        </button>
      </div>

      <div className="px-5 mt-4">
        <h1 className="text-3xl font-bold text-gray-800">
          {translations.hello[props.lang]}
          {props.isLoggedIn && props.userName
            ? `, ${props.userName.split(" ")[0]}`
            : ""}
          !
        </h1>
      </div>

      <div className="px-5 mt-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={translations.findBus[props.lang]}
            className="bg-white rounded-full py-4 pl-12 pr-4 border border-gray-200 text-base w-full shadow-sm"
            value={props.search}
            onChange={(e) => props.setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="px-5 mt-4">
        {results.map((r) => (
          <RouteCard
            key={r.id}
            route={r}
            onOpen={() =>
              (window as any).switchScreen("home-with-map", { routeId: r.id })
            }
          />
        ))}
      </div>

      {props.search.length === 0 && (
        <>
          <div className="px-5 mt-6">
            <h2 className="text-lg font-bold mb-3 text-gray-800">
              {translations.searchResult[props.lang]}
            </h2>
            <RouteCard
              route={defaultRoute}
              onOpen={() =>
                (window as any).switchScreen("home-with-map", {
                  routeId: defaultRoute.id,
                })
              }
            />
            <p className="text-xs text-gray-500 mb-5 text-center">
              {translations.clickToSeeMap[props.lang]}
            </p>
          </div>

          <div className="px-5 mt-2">
            <h2 className="text-lg font-bold mb-3 text-gray-800">
              {translations.nearbyStops[props.lang]}
            </h2>
            <div
              onClick={() => (window as any).switchScreen("home-with-stops")}
              className="bg-white rounded-xl p-4 flex flex-row items-center border border-gray-200 mb-2.5 shadow-sm cursor-pointer active:bg-gray-100"
            >
              <div className="w-11 h-11 rounded-full flex justify-center items-center mr-4 bg-blue-100">
                <BusStop className="text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="text-base font-bold text-gray-900">
                  {data.stops.locationName}
                </p>
                <p className="text-xs text-gray-500">{data.stops.count}</p>
              </div>
              <ChevronRight className="text-gray-800" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function FavouritesScreen({ lang }: { lang: Lang }) {
  const [favorites] = useLocalFavorites();
  const favoriteRoutes = [...chennaiData.routes, ...punjabData.routes].filter(
    (r) => favorites.includes(r.id),
  );
  return (
    <div
      className="screen-content p-5"
      style={{ height: "calc(100% - 70px)", overflowY: "auto" }}
    >
      <h1 className="text-2xl font-bold">{translations.favourites[lang]}</h1>
      {favoriteRoutes.length > 0 ? (
        <div className="mt-5">
          {favoriteRoutes.map((r) => (
            <RouteCard
              key={r.id}
              route={r}
              onOpen={() =>
                (window as any).switchScreen("home-with-map", { routeId: r.id })
              }
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center text-gray-500 mt-20">
          <StarIcon className="w-16 h-16 text-gray-300" />
          <p className="mt-4">{translations.noFavourites[lang]}</p>
        </div>
      )}
    </div>
  );
}

function SettingsScreen(props: {
  lang: Lang;
  isLoggedIn: boolean;
  user: {
    displayName?: string | null;
    email?: string | null;
    photoURL?: string | null;
  } | null;
  setLang: (l: Lang) => void;
  onLogin: () => void;
  onLogout: () => void;
}) {
  return (
    <div
      className="screen-content p-5"
      style={{ height: "calc(100% - 70px)", overflowY: "auto" }}
    >
      <h1 className="text-2xl font-bold mb-5">
        {translations.settings[props.lang]}
      </h1>
      {props.isLoggedIn && props.user ? (
        <div className="bg-white rounded-xl p-4 flex flex-row items-center border border-gray-200 mb-2.5 shadow-sm">
          <img
            src={
              props.user.photoURL || "https://placehold.co/60x60/e2e8f0/e2e8f0"
            }
            alt="profile"
            className="w-14 h-14 rounded-full mr-4"
          />
          <div className="flex-1">
            <p className="text-base font-bold text-gray-900">
              {props.user.displayName}
            </p>
            <p className="text-xs text-gray-500">{props.user.email}</p>
          </div>
          <ChevronRight className="text-gray-800" />
        </div>
      ) : (
        <button
          onClick={props.onLogin}
          className="bg-white rounded-xl p-4 w-full text-center border border-gray-200 shadow-sm flex items-center justify-center"
        >
          <img
            src="https://www.google.com/favicon.ico"
            className="w-5 h-5 mr-3"
          />
          <span>{translations.loginWithGoogle[props.lang]}</span>
        </button>
      )}

      {props.isLoggedIn && (
        <>
          <div className="mt-5">
            <button
              onClick={() => (window as any).switchScreen("editProfile")}
              className="bg-gray-100 p-4 rounded-lg w-full text-left mt-2.5"
            >
              {translations.editProfile[props.lang]}
            </button>
            <button
              onClick={() => (window as any).switchScreen("notifications")}
              className="bg-gray-100 p-4 rounded-lg w-full text-left mt-2.5"
            >
              {translations.notifications[props.lang]}
            </button>
            <button
              onClick={() => (window as any).switchScreen("privacy")}
              className="bg-gray-100 p-4 rounded-lg w-full text-left mt-2.5"
            >
              {translations.privacy[props.lang]}
            </button>
          </div>
          <p className="mt-8 mb-2 font-bold text-gray-600 uppercase text-sm">
            {translations.language[props.lang]}
          </p>
          <button
            onClick={() => props.setLang("en")}
            className="bg-gray-100 p-4 rounded-lg w-full text-left mt-2.5"
          >
            English
          </button>
          <button
            onClick={() => props.setLang("pa")}
            className="bg-gray-100 p-4 rounded-lg w-full text-left mt-2.5"
          >
            ਪੰਜਾਬੀ (Punjabi)
          </button>
          <button
            onClick={() => props.setLang("hi")}
            className="bg-gray-100 p-4 rounded-lg w-full text-left mt-2.5"
          >
            हिन्दी (Hindi)
          </button>

          <button
            onClick={props.onLogout}
            className="bg-red-100 p-4 rounded-lg w-full mt-8 text-red-600"
          >
            {translations.logout[props.lang]}
          </button>
        </>
      )}
    </div>
  );
}

function EditProfileScreen({
  lang,
  user,
  onSave,
}: {
  lang: Lang;
  user: { displayName?: string | null } | null;
  onSave: (name: string) => void;
}) {
  const [name, setName] = useState(user?.displayName || "");
  return (
    <div className="flex flex-col" style={{ height: "calc(100% - 70px)" }}>
      <div className="flex items-center p-5 bg-white shadow-sm flex-shrink-0 z-20">
        <button onClick={() => (window as any).switchScreen("settings")}>
          <ArrowLeft />
        </button>
        <h1 className="text-xl font-bold ml-4">
          {translations.editProfileTitle[lang]}
        </h1>
      </div>
      <form
        className="p-5"
        onSubmit={(e) => {
          e.preventDefault();
          onSave(name);
          (window as any).switchScreen("settings");
        }}
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {translations.fullName[lang]}
          </label>
          <input
            className="bg-white rounded-lg p-4 border border-gray-200 text-base w-full shadow-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white font-bold p-4 rounded-lg w-full mt-4"
        >
          {translations.save[lang]}
        </button>
      </form>
    </div>
  );
}

function NotificationsScreen({ lang, state, setState }: any) {
  return (
    <div className="flex flex-col" style={{ height: "calc(100% - 70px)" }}>
      <div className="flex items-center p-5 bg-white shadow-sm flex-shrink-0 z-20">
        <button onClick={() => (window as any).switchScreen("settings")}>
          <ArrowLeft />
        </button>
        <h1 className="text-xl font-bold ml-4">
          {translations.notifications[lang]}
        </h1>
      </div>
      <div className="p-5">
        <div className="bg-white rounded-xl p-4 flex justify-between items-center border border-gray-200 shadow-sm">
          <div>
            <p className="font-bold text-gray-800">
              {translations.enableNotifications[lang]}
            </p>
          </div>
          <Toggle
            value={state.notifications.all}
            onChange={() =>
              setState((s: any) => ({
                ...s,
                notifications: {
                  ...s.notifications,
                  all: !s.notifications.all,
                },
              }))
            }
          />
        </div>

        <div
          className={
            state.notifications.all
              ? "mt-4"
              : "mt-4 opacity-50 pointer-events-none"
          }
        >
          <div className="bg-white rounded-xl p-4 flex justify-between items-center border border-gray-200 shadow-sm mb-2.5">
            <div>
              <p className="font-bold text-gray-800">
                {translations.etaAlerts[lang]}
              </p>
              <p className="text-xs text-gray-500">
                {translations.etaAlertsDesc[lang]}
              </p>
            </div>
            <Toggle
              value={state.notifications.etaAlerts}
              onChange={() =>
                setState((s: any) => ({
                  ...s,
                  notifications: {
                    ...s.notifications,
                    etaAlerts: !s.notifications.etaAlerts,
                  },
                }))
              }
            />
          </div>
          <div className="bg-white rounded-xl p-4 flex justify-between items-center border border-gray-200 shadow-sm">
            <div>
              <p className="font-bold text-gray-800">
                {translations.promotions[lang]}
              </p>
              <p className="text-xs text-gray-500">
                {translations.promotionsDesc[lang]}
              </p>
            </div>
            <Toggle
              value={state.notifications.promotions}
              onChange={() =>
                setState((s: any) => ({
                  ...s,
                  notifications: {
                    ...s.notifications,
                    promotions: !s.notifications.promotions,
                  },
                }))
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function PrivacyScreen({ lang, state, setState }: any) {
  return (
    <div className="flex flex-col" style={{ height: "calc(100% - 70px)" }}>
      <div className="flex items-center p-5 bg-white shadow-sm flex-shrink-0 z-20">
        <button onClick={() => (window as any).switchScreen("settings")}>
          <ArrowLeft />
        </button>
        <h1 className="text-xl font-bold ml-4">{translations.privacy[lang]}</h1>
      </div>
      <div className="p-5">
        <div className="bg-white rounded-xl p-4 flex justify-between items-center border border-gray-200 shadow-sm">
          <div>
            <p className="font-bold text-gray-800">
              {translations.locationSharing[lang]}
            </p>
            <p className="text-xs text-gray-500">
              {translations.locationSharingDesc[lang]}
            </p>
          </div>
          <Toggle
            value={state.privacy.locationSharing}
            onChange={() =>
              setState((s: any) => ({
                ...s,
                privacy: {
                  ...s.privacy,
                  locationSharing: !s.privacy.locationSharing,
                },
              }))
            }
          />
        </div>
      </div>
    </div>
  );
}

function StopsScreen({
  lang,
  city,
}: {
  lang: Lang;
  city: "Punjab" | "Chennai";
}) {
  const data = city === "Punjab" ? punjabData : chennaiData;
  return (
    <div className="flex flex-col" style={{ height: "calc(100% - 70px)" }}>
      <div className="flex items-center p-5 bg-white shadow-sm flex-shrink-0 z-20">
        <button onClick={() => (window as any).switchScreen("home")}>
          <ArrowLeft />
        </button>
        <h1 className="text-xl font-bold ml-4">
          {translations.nearbyStopsTitle[lang]}
        </h1>
      </div>
      <div className="p-5 overflow-y-auto">
        {data.stops.list.map((stop) => (
          <div
            key={stop.name}
            className="bg-white rounded-xl p-4 flex flex-row items-center border border-gray-200 mb-2.5 shadow-sm"
          >
            <div className="w-11 h-11 rounded-full flex justify-center items-center mr-4 bg-blue-100">
              <BusStop className="text-blue-500" />
            </div>
            <div className="flex-1">
              <p className="text-base font-bold text-gray-900">{stop.name}</p>
              <p className="text-xs text-gray-500">Buses: {stop.buses}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">
                {stop.distance}
              </p>
              <p className="text-xs text-gray-500">
                {translations.distanceAway[lang]}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MapScreen({
  city,
  payload,
  lang,
}: {
  city: "Punjab" | "Chennai";
  payload: any;
  lang: Lang;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const busTimer = useRef<any>(null);

  useEffect(() => {
    const L: any = (window as any).L;
    if (!L) return;
    const data: CityData = city === "Punjab" ? punjabData : chennaiData;
    const route: RouteDef | undefined = data.routes.find(
      (r) => r.id === payload?.routeId,
    );
    if (!route || !containerRef.current) return;

    if (mapRef.current) {
      try {
        mapRef.current.remove();
      } catch {}
      mapRef.current = null;
    }

    const map = L.map(containerRef.current).setView(
      route.mapCenter,
      route.mapZoom,
    );
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const startIcon = L.divIcon({
      html: '<div style="position:relative"><div style="position:absolute;width:24px;height:24px;background:#4ade80;border-radius:9999px;opacity:.5;animation:ping 1s cubic-bezier(0, 0, 0.2, 1) infinite"></div><div style="position:relative;width:16px;height:16px;background:#22c55e;border-radius:9999px;border:2px solid #fff"></div></div>',
    });
    const endIcon = L.divIcon({
      html: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#E74C3C" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
    });
    const busIcon = L.divIcon({
      html: '<div style="padding:4px;background:#fff;border-radius:9999px;box-shadow:0 2px 6px rgba(0,0,0,.2)"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M16 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/></svg></div>',
    });

    L.marker(route.startCoords, { icon: startIcon }).addTo(map);
    L.marker(route.endCoords, { icon: endIcon }).addTo(map);
    const busMarker = L.marker(route.startCoords, { icon: busIcon }).addTo(map);
    L.polyline(route.path, {
      color: "#3498DB",
      dashArray: "8, 8",
      weight: 3,
    }).addTo(map);

    let step = 0;
    busTimer.current && clearInterval(busTimer.current);
    busTimer.current = setInterval(() => {
      step = (step + 1) % route.path.length;
      busMarker.setLatLng(route.path[step]);
    }, 1500);

    mapRef.current = map;
    return () => {
      busTimer.current && clearInterval(busTimer.current);
      try {
        map.remove();
      } catch {}
    };
  }, [city, payload]);

  return (
    <div className="flex flex-col" style={{ height: "calc(100% - 70px)" }}>
      <div className="flex items-center p-5 bg-white shadow-sm flex-shrink-0 z-20">
        <button onClick={() => (window as any).switchScreen("home")}>
          <ArrowLeft />
        </button>
        <h1 className="text-xl font-bold ml-4">
          {translations.liveLocation[lang]}
        </h1>
      </div>
      <div className="flex-grow relative">
        <div ref={containerRef} id="map" className="absolute inset-0 z-10" />
        <div className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-xl shadow-lg border border-gray-200 z-20">
          <div className="flex items-center">
            <div className="w-11 h-11 rounded-full flex justify-center items-center mr-3 bg-blue-100">
              <Bus className="text-blue-500" />
            </div>
            <div className="flex-1">
              <p className="text-lg font-bold text-gray-900">
                {payload?.routeId}
              </p>
              <p className="text-sm text-gray-500">Live</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-green-600">4 min</p>
              <p className="text-sm text-gray-500">ETA</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CityModal({
  lang,
  open,
  onClose,
  onSelect,
}: {
  lang: Lang;
  open: boolean;
  onClose: () => void;
  onSelect: (c: "Chennai" | "Punjab") => void;
}) {
  const cities: ("Chennai" | "Punjab")[] = ["Chennai", "Punjab"];
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="w-4/5 bg-white rounded-lg p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold mb-3">
          {translations.selectCity[lang]}
        </h3>
        {cities.map((c) => (
          <button
            key={c}
            onClick={() => onSelect(c)}
            className="w-full text-left py-3 border-b border-gray-200 last:border-b-0"
          >
            {c}
          </button>
        ))}
        <button
          onClick={onClose}
          className="mt-4 py-3 rounded-lg border border-gray-200 w-full font-semibold"
        >
          {translations.cancel[lang]}
        </button>
      </div>
    </div>
  );
}

function LogoutModal({
  lang,
  open,
  onClose,
  onConfirm,
}: {
  lang: Lang;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="w-4/5 bg-white rounded-lg p-5 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold mb-2">{translations.logout[lang]}</h3>
        <p className="text-sm text-gray-500">{translations.areYouSure[lang]}</p>
        <div className="flex mt-5 gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 p-3 rounded-lg text-center font-semibold"
          >
            {translations.cancel[lang]}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 text-white p-3 rounded-lg text-center font-semibold"
          >
            {translations.logout[lang]}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Main Page ---
export default function Index() {
  const [screen, setScreen] = useState<
    | "home"
    | "favourites"
    | "settings"
    | "notifications"
    | "privacy"
    | "editProfile"
    | "home-with-map"
    | "home-with-stops"
  >("home");
  const [screenPayload, setScreenPayload] = useState<any>(null);
  const [currentCity, setCurrentCity] = useState<"Punjab" | "Chennai">(
    "Punjab",
  );
  const [language, setLanguage] = useState<Lang>("en");
  const [isCityModalOpen, setCityModalOpen] = useState(false);
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites] = useLocalFavorites();
  const [auth, setAuth] = useState<{
    isLoggedIn: boolean;
    user: {
      displayName?: string | null;
      email?: string | null;
      photoURL?: string | null;
    } | null;
  }>({ isLoggedIn: false, user: null });
  const [prefs, setPrefs] = useState({
    notifications: { all: true, etaAlerts: true, promotions: false },
    privacy: { locationSharing: true },
  });

  useEffect(() => {
    (window as any).switchScreen = (name: typeof screen, payload?: any) => {
      if (screen === "home-with-map") {
        // no-op; MapScreen cleans up itself on unmount
      }
      setScreen(name);
      setScreenPayload(payload || null);
    };
  }, [screen]);

  useEffect(() => {
    // Update active tab styling
    const main = screen.startsWith("home")
      ? "home"
      : screen === "favourites"
        ? "favourites"
        : ["settings", "editProfile", "notifications", "privacy"].includes(
              screen,
            )
          ? "settings"
          : screen;
    document
      .querySelectorAll(".nav-button")
      .forEach((el) => el.classList.remove("active"));
    const btn = document.getElementById(`nav-${main}`);
    if (btn) btn.classList.add("active");
  }, [screen]);

  const cityData = currentCity === "Punjab" ? punjabData : chennaiData;
  const greetingName =
    auth.isLoggedIn && auth.user?.displayName
      ? auth.user.displayName.split(" ")[0]
      : null;

  return (
    <div className="min-h-screen bg-gray-200 py-8">
      <div
        className="phone-container mx-auto relative overflow-hidden bg-gradient-to-b from-sky-50 to-white border-8 border-black rounded-[40px] phone-shadow"
        style={{ height: 800, maxWidth: 420 }}
      >
        <div className="h-full flex flex-col" id="main-content">
          {screen === "home" && (
            <HomeScreen
              lang={language}
              isLoggedIn={auth.isLoggedIn}
              userName={greetingName}
              city={currentCity}
              onCityModal={() => setCityModalOpen(true)}
              search={searchQuery}
              setSearch={setSearchQuery}
            />
          )}
          {screen === "favourites" && <FavouritesScreen lang={language} />}
          {screen === "settings" && (
            <SettingsScreen
              lang={language}
              isLoggedIn={auth.isLoggedIn}
              user={auth.user}
              setLang={setLanguage}
              onLogin={() =>
                setAuth({
                  isLoggedIn: true,
                  user: {
                    displayName: "Ragav",
                    email: "user@example.com",
                    photoURL: "",
                  },
                })
              }
              onLogout={() => setLogoutModalOpen(true)}
            />
          )}
          {screen === "notifications" && (
            <NotificationsScreen
              lang={language}
              state={prefs}
              setState={setPrefs}
            />
          )}
          {screen === "privacy" && (
            <PrivacyScreen lang={language} state={prefs} setState={setPrefs} />
          )}
          {screen === "editProfile" && (
            <EditProfileScreen
              lang={language}
              user={auth.user}
              onSave={(name) =>
                setAuth((s) => ({
                  ...s,
                  user: { ...(s.user || {}), displayName: name },
                }))
              }
            />
          )}
          {screen === "home-with-map" && (
            <MapScreen
              city={currentCity}
              payload={screenPayload}
              lang={language}
            />
          )}
          {screen === "home-with-stops" && (
            <StopsScreen lang={language} city={currentCity} />
          )}
        </div>

        {/* Bottom Navigation */}
        <div
          className="nav-bar absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center"
          style={{ height: 70 }}
        >
          <button
            id="nav-home"
            className="nav-button flex flex-col items-center justify-center text-gray-500 p-2 active"
            onClick={() => setScreen("home")}
          >
            <HomeIcon />
            <p className="text-xs mt-1">Home</p>
          </button>
          <button
            id="nav-favourites"
            className="nav-button flex flex-col items-center justify-center text-gray-500 p-2"
            onClick={() => setScreen("favourites")}
          >
            <StarIcon />
            <p className="text-xs mt-1">Favourites</p>
          </button>
          <button
            id="nav-settings"
            className="nav-button flex flex-col items-center justify-center text-gray-500 p-2"
            onClick={() => setScreen("settings")}
          >
            <SettingsIcon />
            <p className="text-xs mt-1">Settings</p>
          </button>
        </div>
      </div>

      {/* Modals */}
      <CityModal
        lang={language}
        open={isCityModalOpen}
        onClose={() => setCityModalOpen(false)}
        onSelect={(c) => {
          setCurrentCity(c);
          setSearchQuery("");
          setCityModalOpen(false);
        }}
      />
      <LogoutModal
        lang={language}
        open={isLogoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={() => {
          setAuth({ isLoggedIn: false, user: null });
          setLogoutModalOpen(false);
        }}
      />

      <style>{`
        .nav-button.active svg { color: #3498DB; }
        .nav-button.active p { color: #3498DB; }
        @keyframes ping { 75%, 100% { transform: scale(2); opacity: 0 } }
      `}</style>
    </div>
  );
}
