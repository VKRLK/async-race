// src/components/CarSvg/CarSvg.tsx

type CarSvgProps = {
  color: string;
};

const CarSvg = ({ color }: CarSvgProps) => (
  <svg
    width="60"
    height="41"
    viewBox="0 0 60 34"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid meet"
    style={{ color }}
  >
    <rect x="11" y="4" width="8" height="2" rx="1" fill="#222" />
    <rect x="41" y="4" width="8" height="2" rx="1" fill="#222" />

    <rect x="11" y="28" width="8" height="2" rx="1" fill="#222" />
    <rect x="41" y="28" width="8" height="2" rx="1" fill="#222" />

    <rect x="5" y="6" width="50" height="22" rx="4" fill="currentColor" />

    <circle cx="51" cy="10" r="2" fill="white" />
    <circle cx="51" cy="24" r="2" fill="white" />

    <rect x="7" y="9" width="2" height="4" rx="0.5" fill="red" />
    <rect x="7" y="21" width="2" height="4" rx="0.5" fill="red" />

    <rect x="14" y="12" width="6" height="10" rx="1.5" fill="#cce8ff" />

    <rect x="39.4" y="11" width="7.2" height="12" rx="1.5" fill="#cce8ff" />

    <rect x="19.9" y="9.5" width="19.5" height="0.3" rx="0.15" fill="white" />
    <rect x="19.9" y="24" width="19.5" height="0.3" rx="0.15" fill="white" />
  </svg>
);

export default CarSvg;
