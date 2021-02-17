import React from 'react';

import styles from './Avatar.module.scss';

export const Avatar = () => {
  return (
    <div
      style={{
        backgroundImage:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6x8Z5NOds-eazL-iIr9PHGEuzLbxGcgqihQ&usqp=CAU',
      }}
      className={styles.avatar}
    ></div>
  );
};
