import { useRef, type JSX } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import Alarm from "../components/Alarm";
import L from "leaflet";
import type { WildfireLocationsResponse } from "../types/WildfireLocations";

export default function MainPage(): JSX.Element {
  const fireLocations = useRef<WildfireLocationsResponse>({
    locations: [
      { id: 1, lat: 51.505, lng: -0.09, appearedAt: "2025-10-04" },
      { id: 2, lat: 52.505, lng: -0.09, appearedAt: "2025-10-04" },
      { id: 3, lat: 51.505, lng: 1, appearedAt: "2025-10-04" },
    ],
  });
  const markerRefs = useRef<Record<number, L.Marker>>({});

  function handleClick(id: number) {
    if (markerRefs.current) {
      markerRefs.current[id].openPopup();
    }
  }
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
          {fireLocations.current.locations.map((location) => (
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
        {fireLocations.current.locations.map((location) => (
          <Alarm
            onClick={() => handleClick(location.id)}
            message={`Wildfire detected at ${location.lat} ${location.lng} on ${location.appearedAt}`}
          />
        ))}
      </div>
    </div>
  );
}
