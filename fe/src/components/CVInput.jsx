import React from 'react';

export const CVInput = ({ cv, setCV }) => {
  return (
    <div className="input-container">
      <label htmlFor="cv" className="input-label">
        CV Content
      </label>
      <div className="input-wrapper">
        <textarea
          id="cv"
          value={cv}
          onChange={(e) => setCV(e.target.value)}
          placeholder="Enter your CV here..."
          className="input-textarea"
          required
        />
      </div>
    </div>
  );
};