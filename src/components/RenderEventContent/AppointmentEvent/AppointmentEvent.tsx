import React from 'react';
import { Text } from '@mbkit/typography';
import { IconCheckMark } from '@mbkit/icon';

import styles from './AppointmentEvent.module.scss';

interface Props {
  customerName: string;
  distance?: number;
  status: number;
  timeText: string;
  title: string;
}

export const AppointmentEvent: React.FC<Props> = ({ customerName, status, timeText, title }) => {
  return (
    <button type="button" tabIndex={0} className={styles.appointmentEvent}>
      <div className={styles.appointmentEventTopRow}>
        <Text className={styles.appointmentEventText}>{timeText}</Text>
        <div className={styles.appointmentEventUpperRight}>
          {status === 2 && (
            <div className={`${styles.appointmentEventIcon} icon-container`}>
              <IconCheckMark height="20" width="20" />
            </div>
          )}
          <Text className={styles.appointmentEventText}>{customerName}</Text>
        </div>
      </div>
      <div className={styles.appointmentEventBottomRow}>
        <Text className={styles.appointmentEventText}>{title}</Text>
      </div>
    </button>
  );
};
