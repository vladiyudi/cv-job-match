import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const EditableCV = ({ initialCV, apiEndpoint }) => {

  const [editedCV, setEditedCV] = useState(initialCV);
  const [isLoading, setIsLoading] = useState(false);
  const iframeRef = useRef(null);

  const A4_WIDTH = '210mm';
  const A4_HEIGHT = '297mm';

  useEffect(() => {
    if (iframeRef.current) {
      const iframeDocument = iframeRef.current.contentDocument;
      iframeDocument.open();
      iframeDocument.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                font-size: 12pt;
                line-height: 1.15;
                margin: 0;
                padding: 20mm;
                width: 170mm;
                height: 257mm;
                box-sizing: border-box;
                overflow-y: auto;
              }
              @page {
                size: A4;
                margin: 0;
              }
              @media print {
                body {
                  width: 210mm;
                  height: 297mm;
                }
              }
            </style>
          </head>
          <body contenteditable="true">${editedCV}</body>
        </html>
      `);
      iframeDocument.close();
      
      iframeDocument.designMode = 'on';
    }
  }, [editedCV]);

  useEffect(() => {
    setEditedCV(initialCV);
  }, [initialCV]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updatedContent = iframeRef.current.contentDocument.body.innerHTML;
      setEditedCV(updatedContent);

      const response = await axios.post(
        `${apiEndpoint}/generatePdf`,
        { cvHTML: updatedContent },
        {
          responseType: 'blob',
          headers: {
            'Accept': 'application/pdf'
          }
        }
      );

      if (response.headers['content-type'] === 'application/pdf') {
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'generated_cv.pdf');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        alert('Your CV has been generated and downloaded as a PDF.');
      } else {
        alert('An error occurred while generating the PDF.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while processing your request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div 
        style={{ 
          width: A4_WIDTH, 
          height: A4_HEIGHT, 
          overflow: 'hidden',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          margin: '20px 0'
        }}
      >
        <iframe
          ref={iframeRef}
          title="CV Editor"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
          }}
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Generating PDF...' : 'Generate PDF from Edited CV'}
      </button>
    </div>
  );
};

export default EditableCV;