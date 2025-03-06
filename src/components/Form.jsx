import { useState } from 'react';
import { submitToGoogleSheet } from '../services/googleSheetsService';
// ...existing code...

export default function Form() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
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
      await submitToGoogleSheet(formData);
      setFormData({
        name: '',
        email: '',
        message: '',
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
    <form onSubmit={handleSubmit} className="form-section p-6 space-y-6">
      <div className="form-field-group">
        <label htmlFor="name" className="form-field-label text-survey-primary-dark">Full Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="form-field-input"
        />
      </div>
      
      <div className="form-field-group">
        <label htmlFor="email" className="form-field-label text-survey-primary-dark">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="form-field-input"
        />
      </div>
      
      <div className="form-field-group">
        <label htmlFor="message" className="form-field-label text-survey-primary-dark">Message</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows="4"
          required
          className="form-field-input min-h-[120px] resize-y"
        ></textarea>
      </div>
      
      <div className="form-actions">
        <button
          type="submit"
          disabled={isSubmitting}
          className="form-submit-button"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
      
      {submitStatus && (
        <div 
          className={`form-status ${submitStatus.type === 'success' ? 'success' : 'error'}`}
        >
          {submitStatus.message}
        </div>
      )}
    </form>
  );
}
