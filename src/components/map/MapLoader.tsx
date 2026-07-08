'use client';

import dynamic from 'next/dynamic';
import type {WorldMapProps} from './WorldMap';

// Leaflet needs `window`, so the map is loaded client-side only (ssr: false).
// This must live in a client component — ssr:false is not allowed from a
// Server Component in Next 14.
const WorldMap = dynamic(() => import('./WorldMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[520px] animate-pulse rounded-md border border-ligne bg-sable-2" />
  )
});

export default function MapLoader(props: WorldMapProps) {
  return <WorldMap {...props} />;
}
