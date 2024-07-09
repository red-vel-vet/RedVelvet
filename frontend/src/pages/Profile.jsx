import React, { useState, useEffect } from 'react';
import api from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';
import '../styles/Form.css';

function Profile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [editable, setEditable] = useState({ first_name: true, last_name: true });

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
                    <label>Birthdate</label>
                    <input
                        className="form-input"
                        type="date"
                        name="dob"
                        value={profile.dob || ''}
                        onChange={handleChange}
                        placeholder="Date of Birth"
                        disabled
                    />
                    {errors.dob && <p className="error-text">{errors.dob}</p>}
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
                <div className="form-group">
                    <label>About You</label>
                    <textarea
                        className="form-input"
                        name="about_you"
                        value={profile.about_you || ''}
                        onChange={handleChange}
                        placeholder="Describe yourself in a few sentences. What are your passions, interests, and what excites you most about life?"
                    />
                </div>
                <div className="form-group">
                    <label>Relationship Status</label>
                    <textarea
                        className="form-input"
                        name="relationship_status"
                        value={profile.relationship_status || ''}
                        onChange={handleChange}
                        placeholder="If you are single, tell us how you feel about that. If you are in a committed relationship, tell us about it."
                    />
                </div>
                <div className="form-group">
                    <label>Professional Background</label>
                    <textarea
                        className="form-input"
                        name="personal_background"
                        value={profile.personal_background || ''}
                        onChange={handleChange}
                        placeholder="Share more details about your professional life, education, and any significant experiences or milestones that have shaped who you are today."
                    />
                </div>
                <div className="form-group">
                    <label>Experience with Erotic Parties and Events</label>
                    <textarea
                        className="form-input"
                        name="experience"
                        value={profile.experience || ''}
                        onChange={handleChange}
                        placeholder="Have you been to erotic parties or sex-positive events before? What did you like or dislike about them?"
                    />
                </div>
                <div className="form-group">
                    <label>Community Contribution</label>
                    <textarea
                        className="form-input"
                        name="community_contribution"
                        value={profile.community_contribution || ''}
                        onChange={handleChange}
                        placeholder="Why are you interested in joining, and what positive traits will you bring to the community?"
                    />
                </div>
                <div className="form-group">
                    <label>Philosophy and Views on Sexuality</label>
                    <textarea
                        className="form-input"
                        name="philosophy_views"
                        value={profile.philosophy_views || ''}
                        onChange={handleChange}
                        placeholder="What is your philosophy on sex, and what role does sexuality play in your life?"
                    />
                </div>
                <div className="form-group">
                    <label>Fantasy and Preferences</label>
                    <textarea
                        className="form-input"
                        name="fantasy_preferences"
                        value={profile.fantasy_preferences || ''}
                        onChange={handleChange}
                        placeholder="Describe your ideal night at an erotic party and what most turns you on."
                    />
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