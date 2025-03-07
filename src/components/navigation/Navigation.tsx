import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { LogIn, LogOut, Home, FileText, ChevronLeft } from 'lucide-react';
import Blockies from 'react-blockies';
import { usePathnameStore } from '../../store/usePathnameStore';
import styles from './Navigation.module.css';
import useContractWrite from '../../hooks/useContractWrite';

const Navigation: React.FC = () => {
    const [docsHovered, setDocsHovered] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { currentPath, previousPath, setPaths } = usePathnameStore();
    const [isConnected, setIsConnected] = useState(false);
    const { getSigner, signerAddress, disconnect } = useContractWrite();

    useEffect(() => {
        if (signerAddress) {
            setIsConnected(true);
        } else {
            setIsConnected(false);
        }
    }, [signerAddress]);

    const handleSignin = async () => {
        try {
            await getSigner();
        } catch (error) {
            console.error("Failed to connect wallet:", error);
        }
    };

    const handleDisconnect = () => {
        disconnect();
    };

    // Update paths when location changes
    useEffect(() => {
        setPaths(location.pathname);
    }, [location, setPaths]);

    const handleDocsHover = (hovered: boolean) => {
        setDocsHovered(hovered);
    };

    const handleGoBack = () => {
        navigate(previousPath || '/');
    };

    return (
        <nav className={styles.navigation}>
            <div className={styles.leftContainer}>
                {currentPath !== '/' && (
                    <Link to="/" className={styles.homeButton}>
                        <Home size={18} />
                        <span>Home</span>
                    </Link>
                )}
                {currentPath === '/docs' && (
                    <ChevronLeft
                        className={styles.back}
                        onClick={handleGoBack}
                        size={24}
                    />
                )}
            </div>

            <div className={styles.rightContainer}>
                <div
                    className={styles.documentLinkContainer}
                    onMouseEnter={() => handleDocsHover(true)}
                    onMouseLeave={() => handleDocsHover(false)}
                >
                    <Link to="/docs" className={styles.documentButton}>
                        <FileText size={18} />
                        <span>Docs</span>
                    </Link>
                </div>

                <div
                    className={styles.underline}
                    style={{
                        transform: docsHovered
                            ? 'translateY(-25px) translateX(-70px)'
                            : 'translateY(-25px) translateX(0)'
                    }}
                />

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
    );
};

export default Navigation;