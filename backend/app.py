import threading

from flask import Flask, request, jsonify, Response
from dataclasses import dataclass, asdict
from datetime import datetime, timedelta

app = Flask(__name__)


@dataclass(frozen=True)
class Location:
    lat: float
    lng: float



@dataclass(frozen=True)
class TimedLocation:
    id: int
    lat: float
    lng: float
    appearedAt: datetime

@dataclass(frozen=True)
class TimedLocationDto:
    id: int
    lat: float
    lng: float
    appearedAt: str

@dataclass(frozen=True)
class WildFireLocationsResponse:
    locations: list[TimedLocationDto]

globalIdCounter: int = 0
globalLocations: set[Location] = set()
globalTimedLocations: set[TimedLocation] = set()
lock = threading.Lock()


def produceLocations() -> list[Location]:  # TODO implement by ML guys
    return [Location(51.505, -0.09), Location(52.505, -0.09), Location(51.505, 1)]


def addNewLocations() -> None:
    global globalIdCounter, globalLocations, globalTimedLocations
    currentTime = datetime.now()
    with lock:
        for location in produceLocations():
            if location not in globalLocations:
                globalTimedLocations.add(TimedLocation(globalIdCounter, location.lat, location.lng, currentTime))
                globalLocations.add(location)
                globalIdCounter += 1

def removeOldLocations() -> None:
    currentTime = datetime.now()
    with lock:
        localLocations = globalTimedLocations.copy()
        for location in localLocations:
            if location.appearedAt - currentTime > timedelta(days=1):
                globalTimedLocations.remove(location)
                globalLocations.remove(Location(location.lat, location.lng))

def locationsToSortedArray(locations: set[TimedLocation]) -> list[TimedLocationDto]:
    return [TimedLocationDto(location.id, location.lat, location.lng, location.appearedAt.isoformat()) for location in sorted(list(locations), key=lambda location: location.appearedAt)]


@app.route('/api/wildfire', methods=["GET"])
def getLocations() -> Response:
    addNewLocations()
    removeOldLocations()
    localLocations: set[TimedLocation]
    with lock:
        localLocations = globalTimedLocations
    response = WildFireLocationsResponse(locationsToSortedArray(localLocations))
    print("Sending response:")
    print(asdict(response))
    return jsonify(asdict(response))


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
