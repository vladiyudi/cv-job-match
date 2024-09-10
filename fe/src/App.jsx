import React, { useState } from 'react';
import axios from 'axios';
import { CVInput } from './components/CVInput';
import { JobInput } from './components/JobInput';

const App = () => {
  const [cv, setCV] = useState('');
  const [job, setJob] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const server = "https://your-service-name-47779369171.me-west1.run.app/matchJobCv"
  const local = "http://localhost:8080/matchJobCv"

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
        const response = await axios.post(local, 
            { cv, job },
            { 
                responseType: 'blob',
                headers: {
                    'Accept': 'application/pdf'
                }
            }
        );

        // Check if the response is actually a PDF
        if (response.headers['content-type'] === 'application/pdf') {
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'matched_cv.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            alert('Your matched CV has been downloaded.');
        } else {
            // If it's not a PDF, it might be an error message
            const reader = new FileReader();
            reader.onload = function() {
                const errorMessage = JSON.parse(reader.result);
                console.error('Server error:', errorMessage);
                alert(`An error occurred: ${errorMessage.error || 'Unknown error'}`);
            };
            reader.readAsText(response.data);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while processing your request.');
    } finally {
        setIsLoading(false);
    }
};

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">CV Job Matcher</h1>
            </div>
            <div className="divide-y divide-gray-200">
              <form onSubmit={handleSubmit} className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <CVInput cv={cv} setCV={setCV} />
                <JobInput job={job} setJob={setJob} />
                <div className="relative">
                  <button type="submit" disabled={isLoading} className="bg-cyan-500 text-white rounded-md px-4 py-2">
                    {isLoading ? 'Generating PDF...' : 'Generate PDF'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;