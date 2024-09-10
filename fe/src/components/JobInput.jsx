import React from 'react';

export const JobInput = ({ job, setJob }) => {
  return (
    <div className="relative">
      <label htmlFor="job" className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">
        Job Description
      </label>
      <textarea
        id="job"
        value={job}
        onChange={(e) => setJob(e.target.value)}
        placeholder="Enter the job description here..."
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
        rows="5"
        required
      />
    </div>
  );
};