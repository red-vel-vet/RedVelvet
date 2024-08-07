<div className="form-group">
<label>About You</label>
<textarea
    className="form-input"
    name="about_you"
    value={profile.about_you || ''}
    onChange={handleChange}
    placeholder="What are you hoping to get out of being here?"
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
<label>Experience with Erotic Events</label>
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