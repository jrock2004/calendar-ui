import React from 'react';
import {ResourceApi} from '@fullcalendar/resource-common';
import { Heading } from '@mbkit/typography';

import styles from './ResourceContent.module.scss'

interface Props {
  resource: ResourceApi;
}

export const ResourceContent: React.FC<Props> = ({ resource }) => {
  const { title, extendedProps } = resource;
  const { image } = extendedProps;

  return (
    <div className={styles.resourceContent}>
      <div>
        <img src={image} alt={title} className={styles.resourceImage} />
      </div>
      <Heading as="h5">{title}</Heading>
    </div>
  );
};
