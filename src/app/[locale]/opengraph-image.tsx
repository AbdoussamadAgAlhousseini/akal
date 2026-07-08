import {ImageResponse} from 'next/og';

export const alt = 'AKAL — Indigenous Peoples of the World';
export const size = {width: 1200, height: 630};
export const contentType = 'image/png';

const TAGLINE: Record<string, string> = {
  en: 'Indigenous Peoples of the World',
  fr: 'Peuples autochtones du monde',
  es: 'Pueblos indígenas del mundo'
};

const EYEBROW: Record<string, string> = {
  en: 'Documenting · Connecting · Advocating',
  fr: 'Documenter · Relier · Plaider',
  es: 'Documentar · Conectar · Defender'
};

/**
 * Dynamic social-share image (1200×630) rendered per locale. Uses the AKAL
 * palette; kept to Latin text for reliable font rendering in the OG renderer.
 */
export default function Image({params}: {params: {locale: string}}) {
  const locale = params.locale;
  const tagline = TAGLINE[locale] ?? TAGLINE.en;
  const eyebrow = EYEBROW[locale] ?? EYEBROW.en;

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '90px',
          background: '#1F2A5E',
          color: '#ffffff'
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 26,
            letterSpacing: 6,
            textTransform: 'uppercase',
            color: '#E9C46A'
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 150,
            fontWeight: 700,
            letterSpacing: 12,
            marginTop: 12,
            color: '#E9C46A'
          }}
        >
          AKAL
        </div>
        <div style={{display: 'flex', fontSize: 52, marginTop: 8, color: '#ffffff'}}>
          {tagline}
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 60,
            fontSize: 28,
            color: '#C9CEE6'
          }}
        >
          EN · FR · ES
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 24,
            width: 220,
            height: 8,
            background: '#B45E23'
          }}
        />
      </div>
    ),
    {...size}
  );
}
