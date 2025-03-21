import React, { useState, useEffect } from 'react';
import useAlert from '../../hooks/useAlert';
import CustomAlert from '../alert/Alert';
import useContractWrite from '../../hooks/useContractWrite';
import Swal from 'sweetalert2';
import { useForm } from '../../hooks/useForm';
import styles from './ConfessUi.module.css';

// Spinner for loading flair
const Spinner = () => <div className={styles.spinner}></div>;

// Character limit alert
interface CharacterLimitAlertProps { message: string; }
const CharacterLimitAlert: React.FC<CharacterLimitAlertProps> = ({ message }) => (
    <div className={styles.alert}>{message}</div>
);

const ConfessionMain: React.FC = () => {
    const { alertStatus, showAlert } = useAlert();
    const { handleConfession } = useContractWrite();
    const { formInputs, handleInputChange } = useForm({ confess: '', tweetUrl: '' });
    const [isConfessing, setIsConfessing] = useState(false);

    // Fade-in on mount
    useEffect(() => {
        const container = document.querySelector(`.${styles.container}`);
        if (container) container.classList.add(styles.mounted);
    }, []);

    // User-friendly error messages
    const getUserFriendlyError = (reason: string) => {
        switch (reason) {
            case 'WrongConfessionAmount': return 'Send exactly 0.001 ETH to confess.';
            case 'ConfessionTooLong': return 'Keep it under 280 characters.';
            case 'AlreadyResolved': return 'This one’s done, fam.';
            case 'MaxForgivesReached': return 'You’ve already forgiven this.';
            default: return `Oops, something broke: ${reason}`;
        }
    };

    // Confession handler with X integration
    const confess = async () => {
        const { confess } = formInputs;
        const result = await Swal.fire({
            title: 'Confirm Your Confession',
            html: 'Dropping 0.001 ETH and linking your X post—ready?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Confess',
            cancelButtonText: 'Nah',
        });

        if (result.isConfirmed) {
            setIsConfessing(true);
            try {
                showAlert('pending', 'Posting confession...');
                await handleConfession(confess); // Pass tweetUrl to contract
                handleInputChange('confess')({ target: { value: '' } });
                handleInputChange('tweetUrl')({ target: { value: '' } });
                showAlert('success', 'Confession live on-chain! Check it out.');
            } catch (err: any) {
                const reason = err.reason || err.message || 'Unknown error';
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
            {alertStatus?.isVisible && alertStatus.type && (
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
                        placeholder="Drop your regret here..."
                        className={styles.textarea}
                        aria-label="Your confession"
                    />
                    <div className={`${styles.characterCount} ${confessionLength < 20 ? styles.tooShort :
                        confessionLength > 280 ? styles.tooLong :
                            styles.valid
                        }`}>
                        {confessionLength}/280
                    </div>
                    {formInputs.confess && confessionLength < 20 && (
                        <CharacterLimitAlert message="Minimum 20 characters!" />
                    )}
                    {formInputs.tweetUrl && (
                        <CharacterLimitAlert message="Invalid X URL—needs to be a post!" />
                    )}
                </div>
                <button
                    type="button"
                    onClick={confess}
                    disabled={!isValidLength || isConfessing}
                    className={`${styles.button} ${!isValidLength || isConfessing ? styles.disabled : styles.active
                        }`}
                >
                    {isConfessing ? <Spinner /> : 'Confess'}
                </button>
            </div>
        </section>
    );
};

export default ConfessionMain;