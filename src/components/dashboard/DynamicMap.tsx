// src/components/dashboard/DynamicMap.tsx
"use client";

import React, { useEffect, useRef } from 'react';
import L, { LatLngExpression, Polyline as LeafletPolyline, Marker as LeafletMarker } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Leaflet's default icons are not easily available in Next.js, so we create them manually.
const defaultIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// A custom icon for the help center
const helpCenterIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});


interface DynamicMapProps {
  start: [number, number];
  end: [number, number];
  pathString: string; // The textual path description
}

const DynamicMap = ({ start, end, pathString }: DynamicMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const polylineRef = useRef<LeafletPolyline | null>(null);
  const markersRef = useRef<LeafletMarker[]>([]);

  useEffect(() => {
    // Ensure this code runs only on the client and the container is available
    if (typeof window !== 'undefined' && mapContainerRef.current) {
      
      // If the map isn't initialized, create it.
      if (!mapRef.current) {
        mapRef.current = L.map(mapContainerRef.current, {
            scrollWheelZoom: false // Disable scroll wheel zoom
        }).setView(start, 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapRef.current);
      }

      const map = mapRef.current;

      // Clear previous markers and polylines
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      if (polylineRef.current) {
        polylineRef.current.remove();
      }

      // Add new markers
      const startMarker = L.marker(start, { icon: defaultIcon }).bindPopup("Your Location").addTo(map);
      const endMarker = L.marker(end, { icon: helpCenterIcon }).bindPopup("Help Center").addTo(map);
      markersRef.current = [startMarker, endMarker];

      // Create a simple polyline between start and end
      // In a real app, you'd decode the `pathString` to draw the exact route
      const latlngs: LatLngExpression[] = [start, end];
      polylineRef.current = L.polyline(latlngs, { color: 'blue' }).addTo(map);

      // Fit map to bounds of the markers
      const bounds = L.latLngBounds(start, end);
      map.fitBounds(bounds.pad(0.1)); // pad adds some margin
    }

    // Cleanup function is NOT run on re-renders, only on unmount.
    // However, in React 18's StrictMode, components mount, unmount, and remount.
    // To prevent the "Map container is already initialized" error, we ensure a full cleanup.
    return () => {
      if (mapRef.current) {
        mapRef.current.remove(); // This is crucial to prevent the error
        mapRef.current = null;
      }
    };
  }, [start, end, pathString]); // Re-run effect if these change

  return <div ref={mapContainerRef} style={{ height: '100%', width: '100%', borderRadius: 'var(--radius)' }} />;
};

export default DynamicMap;
