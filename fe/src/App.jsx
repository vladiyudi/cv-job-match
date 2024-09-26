import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { CVInput } from './components/CVInput';
import { JobInput } from './components/JobInput';
import EditableCV from './components/EditableCV';
import './styles.css';

const apiEndpoint = import.meta.env.VITE_LOCAL;

const App = () => {
  const [cv, setCV] = useState('');
  const [job, setJob] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rewrittenCV, setRewrittenCV] = useState('');
  const editableCVRef = useRef(null);

  useEffect(() => {
    if (rewrittenCV) {
      editableCVRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [rewrittenCV]);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${apiEndpoint}/matchJobCv`, { cv, job });
      console.log('response.data.rewrittenCV', response.data);
      setRewrittenCV(response.data.rewrittenCV);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while processing your request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">CV Job Matcher</h1>
      <div className="button-container">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="match-button"
        >
          {isLoading ? 'Processing...' : 'Match CV to Job'}
        </button>
      </div>
      <div className="input-container-wrapper">
        <CVInput cv={cv} setCV={setCV} />
        <JobInput job={job} setJob={setJob} />
      </div>
      <div className="editable-cv-wrapper" ref={editableCVRef}>
        <h2 className="section-title">CV Editor (A4 Format)</h2>
        <EditableCV initialCV={rewrittenCV} apiEndpoint={apiEndpoint} />
      </div>
    </div>
  );
};

export default App;