import React from 'react';
import { ClipLoader } from 'react-spinners';
import styles from './Offline.module.css';

const OfflineComponent: React.FC = () => {
    return (
        <div className={styles.offlineContainer}>
            <div className={styles.spinnerContainer}>
                <ClipLoader color="#f44336" size={50} />
            </div>
            <h2 className={styles.offlineMessage}>You are currently offline</h2>
            <p className={styles.offlineSubMessage}>Please check your internet connection and try again.</p>
        </div>
    );
};

export default OfflineComponent;