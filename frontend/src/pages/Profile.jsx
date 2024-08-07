import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';
import '../styles/Form.css';

function Profile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [editable, setEditable] = useState({ first_name: true, last_name: true });
    const navigate = useNavigate(); // Use navigate for redirection

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/api/user/profile/');
                setProfile(response.data);
                setEditable({
                    first_name: !response.data.first_name,
                    last_name: !response.data.last_name,
                });
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setProfile({
            ...profile,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);
        try {
            const response = await api.put('/api/user/profile/', profile);
            setProfile(response.data);
            setEditable({
                first_name: !response.data.first_name,
                last_name: !response.data.last_name,
            });
            alert('Profile updated successfully');
            navigate('/user/quiz'); // Redirect to Quiz page
        } catch (error) {
            if (error.response && error.response.data) {
                setErrors(error.response.data);
            } else {
                console.error(error);
            }
        } finally {
            setLoading(false);
        }
    };

    const calculateAge = (dob) => {
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const getGeneration = (dob) => {
        const year = new Date(dob).getFullYear();
        if (year <= 1924) return 'Greatest Generation';
        if (year >= 1925 && year <= 1945) return 'Silent Generation';
        if (year >= 1946 && year <= 1964) return 'Baby Boomer';
        if (year >= 1965 && year <= 1976) return 'Gen X';
        if (year >= 1977 && year <= 1983) return 'Xennial';
        if (year >= 1984 && year <= 1994) return 'Millennial';
        if (year >= 1995 && year <= 2012) return 'Gen Z';
        return 'Gen Alpha';
    };

    const getAgeRange = (age) => {
        return `${Math.floor(age / 10) * 10}s`;
    };

    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    const age = calculateAge(profile.dob);
    const generation = getGeneration(profile.dob);
    const ageRange = getAgeRange(age);

    return (
        <div className="scrollable-container">
            <form onSubmit={handleSubmit} className="form-container-scrollable">
                <p className="form-title">PROFILE</p>
                <div className="form-group">
                    <input
                        className="form-input"
                        type="text"
                        name="first_name"
                        value={profile.first_name || ''}
                        onChange={handleChange}
                        placeholder="First Name"
                        disabled={!editable.first_name}
                    />
                    {errors.first_name && <p className="error-text">{errors.first_name}</p>}
                </div>
                <div className="form-group">
                    <input
                        className="form-input"
                        type="text"
                        name="last_name"
                        value={profile.last_name || ''}
                        onChange={handleChange}
                        placeholder="Last Name"
                        disabled={!editable.last_name}
                    />
                    {errors.last_name && <p className="error-text">{errors.last_name}</p>}
                </div>
                <div className="form-group">
                    <label>Age Display</label>
                    <select
                        className="form-input"
                        name="age_display"
                        value={profile.age_display}
                        onChange={handleChange}
                    >
                        <option value="NUMBER">{age}</option>
                        <option value="GENERATION">{generation}</option>
                        <option value="RANGE">{ageRange}</option>
                        <option value="NONE">None</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Gender</label>
                    <select
                        className="form-input"
                        name="gender"
                        value={profile.gender}
                        onChange={handleChange}
                    >
                        <option value="CIS_M">CIS M</option>
                        <option value="CIS_F">CIS F</option>
                        <option value="TRANS_M">Trans M</option>
                        <option value="TRANS_F">Trans F</option>
                        <option value="NON_BINARY">Non-Binary</option>
                        <option value="OTHER">Other</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Sexual Preference</label>
                    <select
                        className="form-input"
                        name="sexuality"
                        value={profile.sexuality}
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
                </div>
                <div className="button-container">
                    <Button className="button submit" type="submit">
                        Save
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default Profile;