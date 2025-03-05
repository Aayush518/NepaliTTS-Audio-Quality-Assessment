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
        <label htmlFor="name" className="block text-sm font-medium text-nepali-blue">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-nepali-blue focus:border-nepali-blue"
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-nepali-teal">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-nepali-teal focus:border-nepali-teal"
        />
      </div>
      
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-nepali-gold">Message</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows="4"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-nepali-gold focus:border-nepali-gold"
        ></textarea>
      </div>
      
      {/* Style any rating elements here if they exist */}
      <div className="rating-input-container">
        {/* Apply varied Nepali color styling to any rating elements */}
        <style jsx>{`
          .rating-input button:nth-of-type(6n+1) {
            border-color: var(--nepali-blue);
            color: var(--nepali-blue);
          }
          .rating-input button:nth-of-type(6n+2) {
            border-color: var(--nepali-teal);
            color: var(--nepali-teal);
          }
          .rating-input button:nth-of-type(6n+3) {
            border-color: var(--nepali-forest);
            color: var(--nepali-forest);
          }
          .rating-input button:nth-of-type(6n+4) {
            border-color: var(--nepali-slate);
            color: var(--nepali-slate);
          }
          .rating-input button:nth-of-type(6n+5) {
            border-color: var(--nepali-gold);
            color: var(--nepali-gold);
          }
          .rating-input button:nth-of-type(6n+6) {
            border-color: var(--nepali-saffron);
            color: var(--nepali-saffron);
          }
          .rating-input button.selected {
            background-color: currentColor;
            color: white;
          }
        `}</style>
      </div>
      
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white disabled:opacity-50 transition-all hover:-translate-y-1"
          style={{ 
            background: "linear-gradient(90deg, var(--nepali-blue), var(--nepali-teal), var(--nepali-forest))",
            boxShadow: "0 4px 6px rgba(0, 56, 147, 0.25)"
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
      
      {/* Status message */}
      {submitStatus && (
        <div className={`mt-4 p-3 rounded ${
          submitStatus.type === 'success' 
            ? 'bg-nepali-teal bg-opacity-10 text-nepali-teal border border-nepali-teal border-opacity-20' 
            : 'bg-nepali-red bg-opacity-10 text-nepali-red border border-nepali-red border-opacity-20'
        }`}>
          {submitStatus.message}
        </div>
      )}
    </form>
  );
}
