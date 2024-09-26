import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const EditableCV = ({ initialCV, apiEndpoint }) => {
  const [editedCV, setEditedCV] = useState(initialCV);
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);
  const [height, setHeight] = useState('297mm'); // A4 height

  useEffect(() => {
    const updateHeight = () => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${Math.max(textareaRef.current.scrollHeight, 297 * 3.7795275591)}px`;
        setHeight(`${Math.max(textareaRef.current.scrollHeight, 297 * 3.7795275591)}px`);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);

    return () => window.removeEventListener('resize', updateHeight);
  }, [editedCV]);

  useEffect(() => {
    console.log('initialCV', initialCV);
    setEditedCV(initialCV);
  }, [initialCV]);

  // const handleChange = (e) => {
  //   const newValue = e.target.value;
  //   // Preserve HTML structure by only allowing changes to text content
  //   const updatedHTML = preserveHTMLStructure(editedCV, newValue);
  //   setEditedCV(updatedHTML);
  // };

  const handleChange = (content, delta, source, editor) => {
    setEditedCV(editor.getHTML());
};

  // const preserveHTMLStructure = (originalHTML, newHTML) => {
  //   const parser = new DOMParser();
  //   const originalDoc = parser.parseFromString(originalHTML, 'text/html');
  //   const newDoc = parser.parseFromString(newHTML, 'text/html');

  //   const updateTextContent = (originalNode, newNode) => {
  //     if (originalNode.nodeType === Node.TEXT_NODE) {
  //       originalNode.textContent = newNode.textContent;
  //     } else if (originalNode.nodeType === Node.ELEMENT_NODE) {
  //       for (let i = 0; i < originalNode.childNodes.length; i++) {
  //         if (i < newNode.childNodes.length) {
  //           updateTextContent(originalNode.childNodes[i], newNode.childNodes[i]);
  //         }
  //       }
  //     }
  //   };

  //   updateTextContent(originalDoc.body, newDoc.body);
  //   return originalDoc.documentElement.outerHTML;
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${apiEndpoint}/generatePdf`, 
        console.log('editedCV', editedCV),
        { cvHTML: editedCV },
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
    <div className="h-full flex flex-col">
      <div className="flex-grow relative overflow-hidden" style={{ width: '210mm', minHeight: height }}>
        {/* <textarea
          ref={textareaRef}
          className="absolute inset-0 w-full h-full p-4 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={editedCV}
          onChange={handleChange}
          style={{ 
            fontSize: '12pt', 
            lineHeight: '1.15', 
            resize: 'none', 
            overflowY: 'auto',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word'
          }}
        /> */}
            <div style={{ border: '1px solid #ccc', padding: '20px', marginBottom: '20px' }}>
            <ReactQuill
            value={editedCV}
            onChange={handleChange}
            style={{
                height: '100vh',
                marginBottom: '20px',
            }}
        />
        </div>
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