import { useState, useEffect } from 'react';
interface CountdownProps {
    endTimestamp: any;
}
const Countdown: React.FC<CountdownProps> = ({ endTimestamp }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        // Convert timestamp to milliseconds
        const endDate: any = new Date(Number(endTimestamp) * 1000);

        const updateCountdown = () => {
            const now: any = new Date();
            const difference = endDate - now;

            if (difference <= 0) {
                setTimeLeft('Event Ended');
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        };

        // Update immediately
        updateCountdown();

        // Update every second
        const timer = setInterval(updateCountdown, 1000);

        // Cleanup interval on component unmount
        return () => clearInterval(timer);
    }, [endTimestamp]);

    return (
        <h3>{timeLeft}</h3>
    );
};

export default Countdown;