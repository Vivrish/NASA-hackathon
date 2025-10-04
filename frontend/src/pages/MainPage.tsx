import { useEffect, useRef, useState, type JSX } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import Alarm from "../components/Alarm";
import L from "leaflet";
import type {
  WildfireLocation,
} from "../types/WildfireLocations";
import fetchWildfireLocations from "../api/api";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

export default function MainPage(): JSX.Element {

  const DefaultIcon = L.icon({
    iconUrl: markerIconPng,
    shadowUrl: markerShadowPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
  
  L.Marker.prototype.options.icon = DefaultIcon;
  function handleClick(id: number) {
    if (markerRefs.current) {
      markerRefs.current[id].openPopup();
    }
  }

  const [fireLocations, setFireLocations] = useState<WildfireLocation[]>([]);
  const markerRefs = useRef<Record<number, L.Marker>>({});

  useEffect(() => {
    async function load() {
      const res = await fetchWildfireLocations();
      console.log(res);
      setFireLocations(res.locations);
    }
    load();
  }, []);

  return (
    <div className="w-screen h-screen flex">
      <div className="w-3/4 h-full">
        <MapContainer
          center={[51.505, -0.09]}
          zoom={13}
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {fireLocations.map((location) => (
            <Marker
              position={[location.lat, location.lng]}
              ref={(ref) => {
                if (ref) markerRefs.current[location.id] = ref;
              }}
            >
              <Popup>
                Moderate smoke clouds are moving to the north. Take action
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <div className="w-1/4 h-full bg-gray-700">
        {fireLocations.map((location) => (
          <Alarm
            onClick={() => handleClick(location.id)}
            message={`Wildfire detected at ${location.lat} ${location.lng} on ${location.appearedAt}`}
          />
        ))}
      </div>
    </div>
  );
}
