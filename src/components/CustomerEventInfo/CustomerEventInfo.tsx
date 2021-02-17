import React from 'react';
import { Heading, Text } from '@mbkit/typography';

import styles from './CustomerEventInfo.module.scss';
import { IServices } from '../../interfaces/interfaces';

import { Avatar } from '../Avatar/Avatar';

interface Props {
  customerName: string;
  service: IServices;
}

export const CustomerEventInfo: React.FC<Props> = ({ customerName, service }) => {
  return (
    <div className={styles.customerEventInfo}>
      <Avatar />
      <div className={styles.customerEventInfoMain}>
        <span className={styles.customerEventInfoTime}>7:30 - 8:30</span>
        {service && service.name && (
          <>
            <Heading as="h3">{service.name}</Heading>
            <div>
              <Text as="span">
                with <span className={styles.customerEventInfoName}>{customerName}</span>
              </Text>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
