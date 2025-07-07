import React from 'react';

interface CaretRightIconProps {
  className?: string;
  color?: string;
}

const CaretRightIcon: React.FC<CaretRightIconProps> = ({ className = '', color = 'currentColor' }) => {
  return (
    <svg
      className={className}
      fill={color}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M9 18l6-6-6-6v12z" />
    </svg>
  );
};

export default CaretRightIcon;