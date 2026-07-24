export default function AssemblyAnimation() {
  return <svg className="assembly-map" viewBox="0 0 1000 760" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <g className="assembly-guides">
      <circle cx="740" cy="345" r="240" />
      <circle cx="740" cy="345" r="176" />
      <circle cx="740" cy="345" r="102" />
      <path d="M400 345H990M740 30V690" />
      <path d="M570 175L910 515M910 175L570 515" />
    </g>
    <g className="assembly-drawing">
      <path pathLength="1" d="M740 104L921 238L852 455L628 455L559 238Z" />
      <path pathLength="1" d="M740 104L740 345L921 238M740 345L852 455M740 345L628 455M740 345L559 238" />
      <path pathLength="1" d="M740 104L852 455M921 238L628 455M559 238L921 238" />
    </g>
    <g className="assembly-nodes">
      <circle cx="740" cy="104" r="4" /><circle cx="921" cy="238" r="4" /><circle cx="852" cy="455" r="4" /><circle cx="628" cy="455" r="4" /><circle cx="559" cy="238" r="4" /><circle cx="740" cy="345" r="5" />
    </g>
    <g className="assembly-measurements">
      <path d="M532 502H950M532 495V509M950 495V509" />
      <text x="716" y="525">BUILD FIELD / 418.00</text>
      <path d="M962 96V472M955 96H969M955 472H969" />
      <text x="977" y="300" transform="rotate(90 977 300)">ELEVATION / 376.00</text>
    </g>
  </svg>;
}
