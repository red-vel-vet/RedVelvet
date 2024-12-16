import React, { useState } from 'react';
import Button from './Button';
import styles from '../styles/EditProfileHeaderModal.module.css';

function EditProfileHeaderModal({ isOpen, onClose, onSave, profileData }) {
    const [formData, setFormData] = useState({
        display_name: profileData.display_name || '',
        dob: profileData.dob || '',
        age_display: profileData.age_display || 'NUMBER',
        gender: profileData.gender || 'CIS_M',
        sexuality: profileData.sexuality || 'STRAIGHT',
    });

    const computeAgeOptions = () => {
        const dob = new Date(formData.dob);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear() - (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate()) ? 1 : 0);
        const generation = (() => {
            const yearBorn = dob.getFullYear();
            if (yearBorn <= 1924) return 'Greatest Generation';
            if (yearBorn <= 1945) return 'Silent Generation';
            if (yearBorn <= 1964) return 'Baby Boomer';
            if (yearBorn <= 1976) return 'Gen X';
            if (yearBorn <= 1983) return 'Xennial';
            if (yearBorn <= 1994) return 'Millennial';
            if (yearBorn <= 2012) return 'Gen Z';
            return 'Gen Alpha';
        })();
        return [age, `${Math.floor(age / 10) * 10}s`, generation];
    };

    const ageOptions = computeAgeOptions();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = () => {
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h2>Edit Profile Details</h2>
                <form>
                    <label>
                        Display Name:
                        <input
                            type="text"
                            name="display_name"
                            value={formData.display_name}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Username:
                        <input
                            type="text"
                            value={profileData.username}
                            disabled
                        />
                    </label>
                    <label>
                        Date of Birth:
                        <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Age Display:
                        <select
                            name="age_display"
                            value={formData.age_display}
                            onChange={handleChange}
                        >
                            {ageOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Gender Identity:
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                        >
                            <option value="CIS_M">Cis Male</option>
                            <option value="CIS_F">Cis Female</option>
                            <option value="TRANS_M">Trans Male</option>
                            <option value="TRANS_F">Trans Female</option>
                            <option value="NON_BINARY">Non-Binary</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </label>
                    <label>
                        Sexual Orientation:
                        <select
                            name="sexuality"
                            value={formData.sexuality}
                            onChange={handleChange}
                        >
                            <option value="STRAIGHT">Straight</option>
                            <option value="HETERO">Heteroflexible</option>
                            <option value="BI_CURIOUS">Bi-curious</option>
                            <option value="BISEXUAL">Bisexual</option>
                            <option value="HOMO">Homoflexible</option>
                            <option value="GAY">Gay/Lesbian</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </label>
                </form>
                <div className={styles.modalButtons}>
                    <Button variant="cancel" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="submit" onClick={handleSave}>
                        Save
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default EditProfileHeaderModal;
