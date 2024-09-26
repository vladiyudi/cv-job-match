import React, { useState, useEffect, useRef } from 'react';

export const CVInput = ({ cv, setCV }) => {
  const textareaRef = useRef(null);
  const [height, setHeight] = useState('100vh');

  useEffect(() => {
    const updateHeight = () => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        setHeight(`${textareaRef.current.scrollHeight}px`);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);

    return () => window.removeEventListener('resize', updateHeight);
  }, [cv]);

  return (
    <div className="h-full flex flex-col">
      <label htmlFor="cv" className="text-lg font-medium text-gray-700 mb-2">
        CV Content
      </label>
      <div className="flex-grow relative overflow-hidden" style={{ width: '210mm', minHeight: height }}>
        <textarea
          ref={textareaRef}
          id="cv"
          value={cv}
          onChange={(e) => {
            setCV(e.target.value);
          }}
          onInput={(e) => {
            e.target.style.height = 'auto';
            e.target.style.height = `${e.target.scrollHeight}px`;
            setHeight(`${e.target.scrollHeight}px`);
          }}
          placeholder="Enter your CV here..."
          className="absolute inset-0 w-full h-full p-4 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          style={{ fontSize: '12pt', lineHeight: '1.15', resize: 'none', overflowY: 'hidden' }}
          required
        />
      </div>
    </div>
  );
};