import React from 'react';
import PropTypes from 'prop-types';
import { Heading } from '@mbkit/typography';

export const ResourceContent = ({ resource }) => {
  const { title, extendedProps } = resource;
  const { image } = extendedProps;

  return (
    <div className="flex items-center py-2">
      <div>
        <img src={image} alt={title} className="w-8 rounded-full mr-3" />
      </div>
      <Heading as="h5">{title}</Heading>
    </div>
  );
};

ResourceContent.propTypes = {
  resource: PropTypes.object,
};

export default ResourceContent;
