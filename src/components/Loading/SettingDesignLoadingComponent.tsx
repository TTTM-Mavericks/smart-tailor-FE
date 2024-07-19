import React from 'react';
import styles from './LoadingStyle.module.scss';

const SettingDesignLoadingComponent: React.FC = () => {
  return (
    <div className={styles.container1}>
    <svg
      className={styles.tshirt}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* T-Shirt Body */}
      <path
        d="M50 10 L80 10 L90 40 Q100 10 110 40 L120 10 L150 10 L160 60 L140 80 L140 180 L60 180 L60 80 L40 60 Z"
        fill="#D3D3D3"
        stroke="gray"
        strokeWidth="2"
      />
      {/* Sleeves */}
      <path
        d="M50 10 Q45 30 50 50 L70 50 Q75 30 70 10 Z"
        fill="#D3D3D3"
        stroke="gray"
        strokeWidth="2"
      />
      <path
        d="M150 10 Q155 30 150 50 L130 50 Q125 30 130 10 Z"
        fill="#D3D3D3"
        stroke="gray"
        strokeWidth="2"
      />
      {/* Neckline */}
      <path
        d="M90 40 Q100 20 110 40 Z"
        fill="#FFFFFF"
        stroke="gray"
        strokeWidth="2"
      />
      {/* Animated line */}
      <path
        className={styles.animatedLine}
        d="M50 10 L80 10 L90 40 Q100 10 110 40 L120 10 L150 10 L160 60 L140 80 L140 180 L60 180 L60 80 L40 60 Z"
        fill="none"
        stroke="blue"
        strokeWidth="2"
        strokeDasharray="10,10"
      />
    </svg>
    <div className={styles.text}>Setting</div>
  </div>
  );
};

export default SettingDesignLoadingComponent;
