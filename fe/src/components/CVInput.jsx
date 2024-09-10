import React from 'react';

export const CVInput = ({ cv, setCV }) => {
  return (
    <div className="relative">
      <label htmlFor="cv" className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">
        CV
      </label>
      <textarea
        id="cv"
        value={cv}
        onChange={(e) => setCV(e.target.value)}
        placeholder="Enter your CV here..."
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
        rows="5"
        required
      />
    </div>
  );
};