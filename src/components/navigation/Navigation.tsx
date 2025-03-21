import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { LogIn, LogOut, Home, FileText, ChevronLeft } from 'lucide-react';
import Blockies from 'react-blockies';
import logo from "../../assets/logo.png";
import { usePathnameStore } from '../../store/usePathnameStore';
import styles from './Navigation.module.css';
import useAlert from '../../hooks/useAlert';
import Alert from '../alert/Alert';
import WalletSelector from '../walletSelector/WalletSelector';
import useWalletStore from '../../store/useWalletStore';
import useProviderStore from '../../store/useProviderAndSIgnerStore';

const Navigation: React.FC = () => {
    const { availableWallets, activeWallet, detectWallets, setWallet } = useWalletStore();
    const { signer, signerAddress, connectProvider, connectSigner, disconnect } = useProviderStore();
    const { alertStatus, showAlert } = useAlert();
    const navigate = useNavigate();
    const location = useLocation();
    const { currentPath, previousPath, setPaths } = usePathnameStore();
    const [isWalletSelectorOpen, setIsWalletSelectorOpen] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    // Track connection status
    useEffect(() => {
        const checkSigner = async () => {
            if (signer) {
                const address = await signer.getAddress();
                setIsConnected(!!address);
            } else {
                setIsConnected(false);
            }
        };
        checkSigner();
    }, [signer]);

    // Handle wallet selection
    const handleWalletSelect = async (walletName: string) => {
        try {
            await detectWallets();
            await setWallet(walletName);
            await connectProvider(); // First connect provider
            await connectSigner(); // Then connect signer
            setIsWalletSelectorOpen(false);
        } catch (error: any) {
            showAlert('error', `Failed to connect: ${error.message}`);
        }
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

                {/* Left Section: Logo, Home Button, and Back Button */}
                <div className={styles.leftContainer}>
                    <img className={styles.logo} src={logo} alt="logo" />

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
                            <ChevronLeft className={styles.back} size={18} />
                            <span>Back</span>
                        </div>
                    )}
                </div>

                {/* Right Section: Docs Link & Wallet Connection */}
                <div className={styles.rightContainer}>
                    <Link to="/docs" className={styles.documentButton}>
                        <FileText size={18} />
                        <span>Docs</span>
                    </Link>

                    <div className={styles.connectButtonContainer}>
                        {!isConnected ? (
                            <div className={styles.connectButton} onClick={() => setIsWalletSelectorOpen(true)}>
                                <LogIn size={18} />
                                <span>Connect</span>
                            </div>
                        ) : (
                            <WalletInfo
                                activeWallet={activeWallet}
                                availableWallets={availableWallets}
                                signerAddress={signerAddress}
                                disconnect={disconnect}
                            />
                        )}
                    </div>
                </div>
            </nav>

            {/* Wallet Selector Modal */}
            <WalletSelector
                isOpen={isWalletSelectorOpen}
                onClose={() => setIsWalletSelectorOpen(false)}
                onSelectWallet={handleWalletSelect}
            />
        </>
    );
};

// 🏦 Extracted Wallet Info Component for Readability
const WalletInfo: React.FC<{
    activeWallet: string;
    availableWallets: any[];
    signerAddress: string;
    disconnect: () => void;
}> = ({ activeWallet, availableWallets, signerAddress, disconnect }) => {
    const walletData = availableWallets.find((w) => w.info.name === activeWallet);

    return (
        <>
            {walletData ? (
                <img
                    className={activeWallet === 'Coinbase Wallet' ? styles.coinbaseWalletIcon : styles.foundWalletIcon}
                    src={walletData.info.icon}
                    alt="Wallet Icon"
                />
            ) : (
                "No Wallet Found"
            )}

            <div className={styles.walletInfo}>
                <Blockies className={styles.blockies} seed={signerAddress || ''} size={7} scale={3} />
                <span className={styles.address}>
                    {signerAddress
                        ? `${signerAddress.substring(0, 6)}...${signerAddress.substring(signerAddress.length - 4)}`
                        : "Not connected"}
                </span>
                <div className={styles.disconnectButton} onClick={disconnect}>
                    <LogOut size={18} />
                </div>
            </div>
        </>
    );
};

export default Navigation;
