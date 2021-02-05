import React from 'react';

export const ResourceContent = ({ resource }) => {
  const { title, extendedProps } = resource;
  const { image } = extendedProps;

  return (
    <div className="flex items-center py-2">
      <div>
        <img src={image} alt={title} className="w-8 rounded-full mr-3" />
      </div>
      <h2>{title}</h2>
    </div>
  );
};

export default ResourceContent;
