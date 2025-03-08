import React from 'react';
import styles from './Loading.module.css';

interface LoadingStyleProps {
    transition: string;
    background: string;
}

interface LoadingProps {
    loadingStyle?: LoadingStyleProps;
}

const Loading: React.FC<LoadingProps> = ({ loadingStyle }) => {
    return (
        <div className={styles.loading}>
            <div className={styles.hands} style={loadingStyle}>
            </div>
        </div>
    );
};

export default Loading;