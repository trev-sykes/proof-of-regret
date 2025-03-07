import { useState, useEffect } from "react"

export default function useAlert() {
    const [alertStatus, setAlertStatus] = useState({
        type: null,
        message: '',
        isVisible: false
    });
    useEffect(() => {
        // Set timeout to hide screen shortly after showing alert
        const timeout = setTimeout(() => {
            if (alertStatus.isVisible && alertStatus.type != 'pending') {
                setAlertStatus(prev => ({ ...prev, isVisible: false }));
            }
        }, 5000);

        return () => clearTimeout(timeout);

    }, [alertStatus.isVisible, alertStatus.type]);
    // Makes CustomAlert component visible for a short duration
    // Triggers our use effect by updating the isVisible value pair

    const showAlert = (type: any, message: string) => {
        if (type == null) {
            setAlertStatus({
                type,
                message,
                isVisible: false
            });
        } else {
            setAlertStatus({
                type,
                message,
                isVisible: true
            });

        }
    }
    return { alertStatus, showAlert }
}