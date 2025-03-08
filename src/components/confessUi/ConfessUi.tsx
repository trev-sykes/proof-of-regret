import React, { useState, useEffect } from 'react';
import useAlert from "../../hooks/useAlert";
import CustomAlert from "../alert/Alert";
import useContractWrite from "../../hooks/useContractWrite";
import Swal from 'sweetalert2';
import { useForm } from "../../hooks/useForm";
import styles from "./ConfessUi.module.css";

// Spinner for that loading drip
const Spinner = () => {
    return <div className={styles.spinner}></div>;
};
interface CharacterLimitAlertProps {
    message: any;
}
// Styled alert for character limits
const CharacterLimitAlert: React.FC<CharacterLimitAlertProps> = ({ message }) => {
    return <div className={styles.alert}>{message}</div>;
};

const ConfessionMain: React.FC = () => {
    const { alertStatus, showAlert } = useAlert();
    const { handleConfession } = useContractWrite();
    const { formInputs, handleInputChange } = useForm({ confess: '' });
    const [isConfessing, setIsConfessing] = useState(false);

    // Fade-in effect on mount
    useEffect(() => {
        const container = document.querySelector(`.${styles.container}`);
        if (container) container.classList.add(styles.mounted);
    }, []);

    // Make errors chill for users
    const getUserFriendlyError = (reason: any) => {
        switch (reason) {
            case 'MustSendExactly0_001ETH':
                return 'Send exactly 0.001 ETH to confess.';
            case 'ConfessionAlreadyResolved':
                return 'This confession’s resolved.';
            case 'MaximumForgivesReached':
                return 'You’ve already forgiven this one.';
            default:
                return `Shit went sideways: ${reason}`;
        }
    };

    // Handle the confession flow
    const confess = async () => {
        const confession = formInputs.confess;
        const result = await Swal.fire({
            title: 'Confirm confession',
            text: 'Dropping 0.001 ETH to confess—cool?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Confess',
        });

        if (result.isConfirmed) {
            setIsConfessing(true);
            try {
                showAlert('pending', 'Sending confession');
                await handleConfession(confession);
                handleInputChange('confess')({ target: { value: '' } });
                showAlert('success', 'Confession dropped! You’re good.');
            } catch (err: any) {
                const reason = err.reason || err.message;
                const error = getUserFriendlyError(reason);
                showAlert('error', error);
            } finally {
                setIsConfessing(false);
            }
        }
    };

    const confessionLength = formInputs.confess.length;
    const isValidLength = confessionLength >= 20 && confessionLength <= 280;

    return (
        <section className={styles.container}>
            {alertStatus && alertStatus.isVisible && alertStatus.type != null && (
                <CustomAlert
                    type={alertStatus.type}
                    message={alertStatus.message}
                    onClose={() => showAlert(null, '')}
                />
            )}
            <div className={styles.confessContainer}>
                <div className={styles.inputContainer}>
                    <label htmlFor="confession" className={styles.label}>
                        Confess Your Soul
                    </label>
                    <textarea
                        id="confession"
                        value={formInputs.confess}
                        onChange={handleInputChange('confess')}
                        placeholder="Drop your deepest regret..."
                        className={styles.textarea}
                        aria-label="Your confession goes here"
                    />
                    <div className={`${styles.characterCount} ${confessionLength < 20 ? styles.tooShort :
                        confessionLength > 280 ? styles.tooLong :
                            styles.valid
                        }`}>
                        {confessionLength}/280
                    </div>
                    {formInputs.confess && confessionLength < 20 && (
                        <CharacterLimitAlert message="20 characters minimum!" />
                    )}
                </div>
                <button
                    type="button"
                    onClick={confess}
                    disabled={!formInputs.confess || !isValidLength || isConfessing}
                    className={`${styles.button} ${!formInputs.confess || !isValidLength || isConfessing ? styles.disabled : styles.active
                        }`}
                >
                    {isConfessing ? <Spinner /> : 'Confess'}
                </button>
            </div>
        </section>
    );
};

export default ConfessionMain;