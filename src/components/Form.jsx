import { useState } from 'react';
import { submitToGoogleSheet } from '../services/googleSheetsService';
// ...existing code...

export default function Form() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    // Add other fields as needed
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // Submit to Google Sheet
      await submitToGoogleSheet(formData);
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        message: '',
        // Reset other fields as needed
      });
      
      setSubmitStatus({ type: 'success', message: 'Thank you! Your response has been recorded.' });
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus({ type: 'error', message: 'There was an error submitting your response. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Form fields */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-nepali-red focus:border-nepali-red"
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-nepali-red focus:border-nepali-red"
        />
      </div>
      
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows="4"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-nepali-red focus:border-nepali-red"
        ></textarea>
      </div>
      
      {/* Style any rating elements here if they exist */}
      {/* For example, if there are any rating inputs: */}
      <div className="rating-input-container">
        {/* Apply Nepali red styling to any rating elements */}
        <style jsx>{`
          .rating-input button {
            border-color: var(--nepali-red);
            color: var(--nepali-red);
          }
          .rating-input button.selected {
            background-color: var(--nepali-red);
            color: white;
          }
        `}</style>
      </div>
      
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-nepali-red hover:bg-nepali-maroon focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nepali-red disabled:opacity-50"
          style={{ backgroundColor: 'var(--nepali-red)' }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
      
      {/* Status message */}
      {submitStatus && (
        <div className={`mt-4 p-3 rounded ${submitStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-nepali-red bg-opacity-10 text-nepali-red'}`}>
          {submitStatus.message}
        </div>
      )}
    </form>
  );
}
