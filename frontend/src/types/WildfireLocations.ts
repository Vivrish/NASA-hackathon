export interface WildfireLocationsResponse {
    locations: WildfireLocation[];
}

export interface WildfireLocation {
    id: number;
    lat: number;
    lng: number;
    appearedAt: string; 
}