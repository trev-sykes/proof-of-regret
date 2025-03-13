import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { LogIn, LogOut, Home, FileText, ChevronLeft } from 'lucide-react';
import Blockies from 'react-blockies';
import { usePathnameStore } from '../../store/usePathnameStore';
import styles from './Navigation.module.css';
import useContractWrite from '../../hooks/useContractWrite';
import useAlert from '../../hooks/useAlert';
import Alert from '../alert/Alert';
import WalletSelector from '../walletSelector/WalletSelector';

const Navigation: React.FC = () => {
    const { alertStatus, showAlert } = useAlert();
    const navigate = useNavigate();
    const location = useLocation();
    const { currentPath, previousPath, setPaths } = usePathnameStore();
    const [isConnected, setIsConnected] = useState(false);
    const [isWalletSelectorOpen, setIsWalletSelectorOpen] = useState(false);
    const { signerAddress, disconnect, connectToMetaMaskWithEIP6963 } = useContractWrite();

    useEffect(() => {
        if (signerAddress) {
            setIsConnected(true);
        } else {
            setIsConnected(false);
        }
    }, [signerAddress]);

    const handleSignin = () => {
        // Open wallet selector instead of directly connecting
        setIsWalletSelectorOpen(true);
    };
    const handleWalletSelect = async (walletType: string) => {
        setIsWalletSelectorOpen(false);
        try {
            await connectToMetaMaskWithEIP6963();
        } catch (error: any) {
            let errorMessage = `Failed to connect ${walletType}.`;

            // Add more context based on the error
            if (error.message?.includes("not installed") || error.message?.includes("not available")) {
                errorMessage += " This wallet is not installed or available.";
                if (walletType === 'metamask') {
                    errorMessage += " Try downloading MetaMask.";
                } else if (walletType === 'uniwallet') {
                    errorMessage += " Try installing UniWallet.";
                }
            }

            showAlert('error', errorMessage);
            console.error(`Failed to connect ${walletType}:`, error);
        }
    };
    const handleDisconnect = () => {
        disconnect();
    };

    // Update paths when location changes
    useEffect(() => {
        setPaths(location.pathname);
    }, [location, setPaths]);



    return (
        <>
            <nav className={styles.navigation}>
                {alertStatus.isVisible && (
                    <Alert type={alertStatus.type} message={alertStatus.message} onClose={() => showAlert(null, '')} />
                )}
                <div className={styles.leftContainer}>
                    {currentPath !== '/' && currentPath !== '/docs' && (
                        <Link to="/" className={styles.homeButton}>
                            <Home size={18} />
                            <span>Home</span>
                        </Link>
                    )}
                    {currentPath === '/docs' && (
                        <div
                            className={styles.documentButton}
                            onClick={() => navigate(previousPath && previousPath !== '/docs' ? previousPath : '/')}
                        >
                            <ChevronLeft
                                className={styles.back}
                                size={18}
                            />
                            <span>Back</span>
                        </div>
                    )}
                </div>

                <div className={styles.rightContainer}>
                    <div
                        className={styles.documentLinkContainer}

                    >
                        <Link to="/docs" className={styles.documentButton}>
                            <FileText size={18} />
                            <span>Docs</span>
                        </Link>
                    </div>
                    <div className={styles.connectButtonContainer}>
                        {!isConnected ? (
                            <div className={styles.connectButton} onClick={handleSignin}>
                                <LogIn size={18} />
                                <span>Connect</span>
                            </div>
                        ) : (
                            <div className={styles.walletInfo}>
                                <Blockies
                                    className={styles.blockies}
                                    seed={signerAddress || ''}
                                    size={7}
                                    scale={3}
                                />
                                <span className={styles.address}>
                                    {typeof signerAddress === 'string' &&
                                        `${signerAddress.substring(0, 6)}...${signerAddress.substring(signerAddress.length - 4)}`}
                                </span>
                                <div className={styles.disconnectButton} onClick={handleDisconnect}>
                                    <LogOut size={18} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
            <WalletSelector
                isOpen={isWalletSelectorOpen}
                onClose={() => setIsWalletSelectorOpen(false)}
                onSelectWallet={handleWalletSelect}
            />
        </>
    );
};

export default Navigation;