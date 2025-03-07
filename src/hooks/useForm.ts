import { useState } from 'react';

export function useForm(initialValues: { [key: string]: string }) {
    const [formInputs, setFormInputs] = useState(initialValues);

    const handleInputChange = (field: string) => (e: { target: { value: string } }) => {
        console.log("value", e.target.value);
        const value = e.target.value;
        setFormInputs(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const resetForm = () => setFormInputs(initialValues);

    return { formInputs, handleInputChange, resetForm };
}