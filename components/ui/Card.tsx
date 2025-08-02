
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  titleIcon?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, titleIcon }) => {
  return (
    <div className={`bg-white shadow-lg rounded-xl overflow-hidden ${className}`}>
      {title && (
        <div className="p-4 sm:p-6 border-b border-neutral-200 bg-neutral-50 rounded-t-xl">
          <h3 className="text-lg font-semibold text-neutral-800 flex items-center">
            {titleIcon && <span className="mr-2 text-primary">{titleIcon}</span>}
            {title}
          </h3>
        </div>
      )}
      <div className="p-4 sm:p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;
