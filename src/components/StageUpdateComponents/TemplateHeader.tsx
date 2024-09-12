import React from 'react';

interface TemplateHeaderProps {
  templateName: string;
}

const TemplateHeader: React.FC<TemplateHeaderProps> = ({ templateName }) => (
  <div className="p-10">
    <h1 className="text-center text-xl font-semibold">
      Template Name: {templateName}
    </h1>
  </div>
);

export default TemplateHeader;
