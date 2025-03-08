import { useState, useEffect } from "react";

export const useInternetCheck = () => {
    const [onLine, setOnLine] = useState(navigator.onLine);

    useEffect(() => {
        const updateOnlineStatus = () => {
            setOnLine(navigator.onLine);
        };

        // Add event listeners
        window.addEventListener("online", updateOnlineStatus);
        window.addEventListener("offline", updateOnlineStatus);

        // Cleanup function
        return () => {
            window.removeEventListener("online", updateOnlineStatus);
            window.removeEventListener("offline", updateOnlineStatus);
        };
    }, []);

    return onLine;
};
