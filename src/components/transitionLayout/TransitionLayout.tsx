import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../loading/Loading";

interface LoadingStyleProps {
    transition: string;
    background: string;
}

const TransitionLayout = ({ children }: { children: React.ReactNode }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [contentOpacity, setContentOpacity] = useState(0);
    const [nextLocation, setNextLocation] = useState<string | null>(null);
    const navigate = useNavigate();

    const loadingStyle: LoadingStyleProps = {
        transition: 'background .5s ease',
        background: 'linear-gradient(to left, rgba(0, 0, 0, .25) 100%, rgba(100, 100, 100, .25))',
    };

    useEffect(() => {
        // Only lock scroll during initial load
        if (isLoading) {
            document.body.style.overflow = 'hidden';
        }

        const timer = setTimeout(() => {
            setIsLoading(false);
            setContentOpacity(1);
            document.body.style.overflow = 'auto'; // Restore scroll after load
        }, 500);

        // Cleanup: ensure scroll is restored
        return () => {
            clearTimeout(timer);
            document.body.style.overflow = 'auto';
        };
    }, [isLoading]);

    useEffect(() => {
        if (nextLocation && contentOpacity === 0) {
            const navigationTimer = setTimeout(() => {
                navigate(nextLocation);
                setNextLocation(null);
                setTimeout(() => {
                    setIsLoading(false);
                    setContentOpacity(1);
                }, 50);
            }, 250);

            return () => clearTimeout(navigationTimer);
        }
    }, [nextLocation, contentOpacity, navigate]);

    // Remove global scroll listeners unless you need them for transitions
    // const handleScroll = (e: Event) => e.preventDefault();

    return (
        <div style={{
            position: 'relative',
            minHeight: '100vh', // Ensure full height for scrolling children
            display: 'flex',
            flexDirection: 'column',
        }}>
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: isLoading ? 1 : 0,
                    transition: 'opacity 250ms ease',
                    pointerEvents: isLoading ? 'auto' : 'none',
                    zIndex: 10,
                }}
            >
                <Loading loadingStyle={loadingStyle} />
            </div>
            <div
                style={{
                    opacity: contentOpacity,
                    transition: 'opacity 250ms ease',
                    flex: 1, // Allow this to grow and support scrolling children
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh', // Ensure it takes full height
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default TransitionLayout;