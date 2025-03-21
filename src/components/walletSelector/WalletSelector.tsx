import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { BeatLoader } from 'react-spinners';
import styles from './WalletSelector.module.css';
import useWalletStore from "../../store/useWalletStore";

interface WalletSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectWallet: (walletType: string) => void;
}

const WalletSelector: React.FC<WalletSelectorProps> = ({ isOpen, onClose, onSelectWallet }) => {
    const { detectWallets, availableWallets } = useWalletStore();

    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            const handleGetWallets = async () => {
                try {
                    const wallets = await detectWallets();
                    console.log("Wallets: ", wallets);
                } catch (err: any) {
                    console.error(`Error getting wallets `, err.message);
                }
            }
            if (availableWallets.length == 0) {
                handleGetWallets();
                setTimeout(() => {
                    setLoading(false);
                }, 2000);
            } else {
                setLoading(false);
            }

        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2>Connect Wallet</h2>
                    <button onClick={onClose} className={styles.closeButton}>
                        <X size={24} />
                    </button>
                </div>

                {loading ? (
                    <div className={styles.loadingContainer}>
                        <div className={styles.loading}>Loading wallets...</div>
                        <BeatLoader />
                    </div>
                ) : (
                    <>
                        {availableWallets.length > 0 && (
                            <>
                                <h3 className={styles.sectionTitle}>Installed Wallets</h3>
                                <div className={styles.walletList}>
                                    {availableWallets.map((wallet: any) => {

                                        const { info } = wallet;
                                        return (
                                            <button
                                                key={info.uuid}
                                                className={styles.walletOption}
                                                onClick={() => onSelectWallet(info.name)}
                                            >
                                                <img className={styles.walletIcon} src={info ? info.icon : ''} alt="wallet" />
                                                <span className={styles.walletName}>{info.name}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default WalletSelector;
