import React from 'react';
import { Button } from '@mbkit/button';
import { IconCreditCardHand } from '@mbkit/icon';
import { Heading, Text } from '@mbkit/typography';

import styles from './PaymentMethods.module.scss';

export const PaymentMethods = () => {
  const handleNotWorkingButtons = (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    ev.preventDefault();

    console.log('Button is not working yet');
  };

  return (
    <div className={styles.paymentMethods}>
      <div>
        <IconCreditCardHand />
      </div>
      <div>
        <Heading as="h4">Visa **** 2222</Heading>
        <Text as="span">Auto updating on Dev 20</Text>
      </div>
      <div>
        <Button
          variant="simpleText"
          className={styles.paymentMethodsButton}
          onClick={handleNotWorkingButtons}
        >
          Edit
        </Button>
      </div>
    </div>
  );
};
