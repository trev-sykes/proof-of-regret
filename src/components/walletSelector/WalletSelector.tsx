// WalletSelector.tsx
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import styles from './WalletSelector.module.css';
import { detectWallets, WalletInfo } from '../../utils/walletUtils';

interface WalletSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectWallet: (walletType: string) => void;
}

const WalletSelector: React.FC<WalletSelectorProps> = ({ isOpen, onClose, onSelectWallet }) => {
    const [availableWallets, setAvailableWallets] = useState<WalletInfo[]>([]);

    useEffect(() => {
        if (isOpen) {
            // Only detect wallets when the modal is opened
            const wallets = detectWallets();
            setAvailableWallets(wallets);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Group wallets by installed status
    const installedWallets = availableWallets.filter(wallet => wallet.installed);
    const otherWallets = availableWallets.filter(wallet => !wallet.installed);

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2>Connect Wallet</h2>
                    <button onClick={onClose} className={styles.closeButton}>
                        <X size={24} />
                    </button>
                </div>

                {installedWallets.length > 0 && (
                    <>
                        <h3 className={styles.sectionTitle}>Installed Wallets</h3>
                        <div className={styles.walletList}>
                            {installedWallets.map(wallet => (
                                <button
                                    key={wallet.id}
                                    className={styles.walletOption}
                                    onClick={() => onSelectWallet(wallet.id)}
                                >
                                    <span className={styles.walletIcon}>{wallet.icon}</span>
                                    <span className={styles.walletName}>{wallet.name}</span>
                                </button>
                            ))}
                        </div>
                    </>
                )}

                {otherWallets.length > 0 && (
                    <>
                        <h3 className={styles.sectionTitle}>Other Options</h3>
                        <div className={styles.walletList}>
                            {otherWallets.map(wallet => (
                                <button
                                    key={wallet.id}
                                    className={`${styles.walletOption} ${styles.notInstalled}`}
                                    onClick={() => onSelectWallet(wallet.id)}
                                >
                                    <span className={styles.walletIcon}>{wallet.icon}</span>
                                    <span className={styles.walletName}>{wallet.name}</span>
                                    <span className={styles.installLabel}>Not supported</span>
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default WalletSelector;