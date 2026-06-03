import React from 'react';

interface OniCharacterProps {
  equippedItems: string[];
}

export const OniCharacter: React.FC<OniCharacterProps> = ({ equippedItems = [] }) => {
  const hasScarf = equippedItems.includes('item-scarf');
  const hasCrown = equippedItems.includes('item-crown');
  const hasGlasses = equippedItems.includes('item-glasses');

  return (
    <div className="oni-avatar-wrapper">
      <svg width="70" height="70" viewBox="0 0 100 100" className="oni-svg">
        {/* Shadow */}
        <ellipse cx="50" cy="88" rx="26" ry="5" fill="rgba(62, 56, 53, 0.08)" />

        {/* Main Body */}
        <circle cx="50" cy="55" r="30" fill="#FFEAE5" stroke="#FFA28B" strokeWidth="2.5" />

        {/* Cute blushing cheeks */}
        <circle cx="35" cy="62" r="4.5" fill="#FF8D78" opacity="0.4" />
        <circle cx="65" cy="62" r="4.5" fill="#FF8D78" opacity="0.4" />

        {/* Eyes */}
        <circle cx="38" cy="53" r="3" fill="#3E3835" />
        <circle cx="62" cy="53" r="3" fill="#3E3835" />
        {/* Eye highlights */}
        <circle cx="39.5" cy="51.5" r="0.8" fill="#FFFFFF" />
        <circle cx="63.5" cy="51.5" r="0.8" fill="#FFFFFF" />

        {/* Smiling Mouth */}
        <path d="M 46 62 Q 50 66 54 62" fill="none" stroke="#3E3835" strokeWidth="2" strokeLinecap="round" />

        {/* Smart Glasses */}
        {hasGlasses && (
          <g className="accessory-glasses">
            {/* Left rim */}
            <rect x="25" y="45" width="18" height="13" rx="3" fill="none" stroke="#5C4D3C" strokeWidth="2" />
            {/* Right rim */}
            <rect x="57" y="45" width="18" height="13" rx="3" fill="none" stroke="#5C4D3C" strokeWidth="2" />
            {/* Bridge */}
            <path d="M 43 51 L 57 51" stroke="#5C4D3C" strokeWidth="2" strokeLinecap="round" />
            {/* Sides */}
            <path d="M 25 49 H 19" stroke="#5C4D3C" strokeWidth="1.2" />
            <path d="M 75 49 H 81" stroke="#5C4D3C" strokeWidth="1.2" />
          </g>
        )}

        {/* Red Scarf */}
        {hasScarf && (
          <g className="accessory-scarf">
            {/* Neck scarf ring */}
            <path d="M 26 73 Q 50 83 74 73 C 71 65 50 65 29 65 Q 26 69 26 73 Z" fill="#FF5A5A" stroke="#C83B3B" strokeWidth="1.5" />
            {/* Scarf knot */}
            <circle cx="64" cy="74" r="6" fill="#FF5A5A" stroke="#C83B3B" strokeWidth="1.5" />
            {/* Scarf hanging tail */}
            <path d="M 62 78 C 64 88 67 93 66 95 C 64 96 59 91 58 80 Z" fill="#DE4545" stroke="#C83B3B" strokeWidth="1" />
          </g>
        )}

        {/* Master Crown */}
        {hasCrown && (
          <g className="accessory-crown" transform="translate(0, -6)">
            {/* Crown silhouette */}
            <path d="M 33 32 L 36 17 L 44 24 L 50 14 L 56 24 L 64 17 L 67 32 Z" fill="#FFD25A" stroke="#E29B00" strokeWidth="1.8" strokeLinejoin="round" />
            {/* Headband base */}
            <rect x="33" y="30" width="34" height="3" rx="0.5" fill="#E29B00" />
            {/* Little gemstone dots */}
            <circle cx="36" cy="17" r="1.5" fill="#FF5A5A" />
            <circle cx="50" cy="14" r="1.5" fill="#B5A5F5" />
            <circle cx="64" cy="17" r="1.5" fill="#FF5A5A" />
          </g>
        )}
      </svg>
    </div>
  );
};
