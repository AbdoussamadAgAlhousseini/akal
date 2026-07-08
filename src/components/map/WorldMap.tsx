'use client';

import {Circle, MapContainer, Popup, TileLayer} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {Link} from '@/i18n/navigation';

export type MapItem = {
  slug: string;
  name: string;
  countries: string;
  coords: [number, number];
  radius: number;
  pastoral: boolean;
};

export type WorldMapProps = {
  items: MapItem[];
  readSheet: string;
};

// Colours from the prototype: ocre = pastoralist peoples, indigo = others.
const COLOR_PASTORAL = '#B45E23';
const COLOR_OTHER = '#1F2A5E';

/**
 * Leaflet world map. Circles are deliberately large/approximate (§7.2 — sacred
 * sites and vulnerable communities are never mapped precisely). Each popup
 * links to the people's fact sheet. Client-only (loaded with ssr:false).
 */
export default function WorldMap({items, readSheet}: WorldMapProps) {
  return (
    <div className="relative z-0 h-[520px] overflow-hidden rounded-md border border-ligne">
      <MapContainer
        center={[15, 10]}
        zoom={2}
        scrollWheelZoom={false}
        style={{height: '100%', width: '100%'}}
      >
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={8}
        />
        {items.map((item) => {
          const color = item.pastoral ? COLOR_PASTORAL : COLOR_OTHER;
          return (
            <Circle
              key={item.slug}
              center={item.coords}
              radius={item.radius}
              pathOptions={{
                color,
                fillColor: color,
                fillOpacity: 0.22,
                weight: 1.5
              }}
            >
              <Popup>
                <div className="font-serif text-[16px] font-semibold text-indigo">
                  {item.name}
                </div>
                <div className="my-1 text-[12px] text-gris">{item.countries}</div>
                <Link
                  href={{pathname: '/peoples/[slug]', params: {slug: item.slug}}}
                  className="text-[13px] font-semibold text-laterite"
                >
                  {readSheet} →
                </Link>
              </Popup>
            </Circle>
          );
        })}
      </MapContainer>
    </div>
  );
}
