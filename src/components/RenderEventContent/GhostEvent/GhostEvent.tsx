import React from 'react';
import { Text } from '@mbkit/typography';

import styles from './GhostEvent.module.scss';

interface Props {
  timeText: string;
}

export const GhostEvent: React.FC<Props> = ({ timeText }) => {
  return (
    <button
      type="button"
      tabIndex={0}
      className={styles.ghostAppointment}
      data-testid={'ghostAppointment'}
    >
      <Text>Ghost Appointment</Text>
      <Text>{timeText}</Text>
    </button>
  );
};
