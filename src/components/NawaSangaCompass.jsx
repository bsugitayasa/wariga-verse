import nawaSangaData from '../data/nawaSangaData.json';

const POSITIONS = [
  { top: '5%', left: '50%', transform: 'translateX(-50%)' },   // Utara (index 6→pos 0)
  { top: '12%', right: '8%' },                                   // Timur Laut (7→1)
  { top: '50%', right: '0%', transform: 'translateY(-50%)' },   // Timur (0→2)
  { bottom: '12%', right: '8%' },                                // Tenggara (1→3)
  { bottom: '5%', left: '50%', transform: 'translateX(-50%)' }, // Selatan (2→4)
  { bottom: '12%', left: '8%' },                                 // Barat Daya (3→5)
  { top: '50%', left: '0%', transform: 'translateY(-50%)' },    // Barat (4→6)
  { top: '12%', left: '8%' },                                    // Barat Laut (5→7)
];

// Map from nawaSangaData index to compass position
const DIR_TO_POS = [2, 3, 4, 5, 6, 7, 0, 1, -1]; // -1 = center

export default function NawaSangaCompass({ activeDirection }) {
  const directions = nawaSangaData.directions;
  const activeIdx = activeDirection
    ? directions.findIndex(d => d.direction === activeDirection.direction)
    : -1;

  return (
    <div className="compass" id="nawa-sanga-compass">
      <div className="compass__ring" />
      <div className="compass__ring compass__ring--inner" />

      {directions.map((dir, idx) => {
        if (idx === 8) return null; // Center handled separately
        const posIdx = DIR_TO_POS[idx];
        if (posIdx < 0) return null;
        const pos = POSITIONS[posIdx];
        const isActive = idx === activeIdx;

        return (
          <div
            key={dir.direction}
            className={`compass__direction ${isActive ? 'compass__direction--active' : ''}`}
            style={{
              ...pos,
              background: isActive ? `${dir.colorHex}22` : undefined,
              borderColor: isActive ? dir.colorHex : undefined,
            }}
            title={`${dir.direction} (${dir.directionSanskrit}) — ${dir.deity}`}
          >
            <span className="text-bali" style={{ fontSize: '1rem' }}>{dir.bijaksaraBali}</span>
            <span className="compass__direction-label">{dir.directionSanskrit}</span>
          </div>
        );
      })}

      {/* Center */}
      <div className="compass__center" style={{
        background: activeIdx === 8
          ? 'linear-gradient(135deg, #A855F7, #7C3AED)'
          : undefined,
      }}>
        <span className="text-bali" style={{ fontSize: '1.1rem' }}>
          {directions[8]?.bijaksaraBali || 'ᬇ'}
        </span>
        <span style={{ fontSize: '0.6rem' }}>Madya</span>
      </div>
    </div>
  );
}
