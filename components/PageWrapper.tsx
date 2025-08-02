import React from 'react';
import { SVGProps } from 'react'; // Import SVGProps

interface PageWrapperProps {
  title: string;
  titleIcon?: React.ReactElement<SVGProps<SVGSVGElement>>; // Updated type for titleIcon
  children: React.ReactNode;
  subtitle?: string;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ title, titleIcon, children, subtitle }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-primary">
        <h1 className="text-3xl font-bold text-neutral-800 flex items-center">
          {titleIcon && <span className="mr-3 text-primary">{React.cloneElement(titleIcon, { className: "w-8 h-8" })}</span>} {/* Removed cast */}
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-neutral-600">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
};

export default PageWrapper;