import React, { useState } from 'react';
import axios from 'axios';
import { CVInput } from './components/CVInput';
import { JobInput } from './components/JobInput';
import EditableCV from './components/EditableCV';

const apiEndpoint = import.meta.env.VITE_LOCAL;
const App = () => {
  const [cv, setCV] = useState('');
  const [job, setJob] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rewrittenCV, setRewrittenCV] = useState('');

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${apiEndpoint}/matchJobCv`, { cv, job });
      // The backend now returns HTML
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
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 flex flex-col">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">CV Job Matcher</h1>
      <div className="flex flex-col xl:flex-row space-y-6 xl:space-y-0 xl:space-x-6 mb-6">
        <div className="w-full xl:w-1/2 bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">CV</h2>
          <div className="a4-container" style={{ width: '210mm', margin: '0 auto' }}>
            <CVInput cv={cv} setCV={setCV} />
          </div>
        </div>
        <div className="w-full xl:w-1/2 bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Job Description</h2>
          <div className="a4-container" style={{ width: '210mm', margin: '0 auto' }}>
            <JobInput job={job} setJob={setJob} />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">CV Editor (A4 Format)</h2>
        <div className="a4-container" style={{ width: '210mm', margin: '0 auto' }}>
          <EditableCV initialCV={rewrittenCV} apiEndpoint={apiEndpoint} />
        </div>
      </div>
      <div className="fixed right-4 sm:right-6 bottom-4 sm:bottom-6 z-10">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Processing...' : 'Match CV to Job'}
        </button>
      </div>
    </div>
  );
};

export default App;