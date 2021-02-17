import React from 'react';

import styles from './FullLoading.module.scss';

export const FullLoading = () => {
  return (
    <div className={styles.fullLoading}>
      <div>
        <div className={styles.bounceball}></div>
        <div className={styles.text}>NOW LOADING</div>
      </div>
    </div>
  );
};
