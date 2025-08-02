
import React from 'react';
import Card from './ui/Card';

interface InteractiveModuleProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  initialInstructions?: string;
}

const InteractiveModule: React.FC<InteractiveModuleProps> = ({ title, icon, children, initialInstructions }) => {
  return (
    <Card title={title} titleIcon={icon} className="min-h-[300px]">
      {initialInstructions && (
        <p className="mb-6 text-neutral-600 bg-primary-light p-4 rounded-md border border-primary">
          {initialInstructions}
        </p>
      )}
      {children}
    </Card>
  );
};

export default InteractiveModule;
