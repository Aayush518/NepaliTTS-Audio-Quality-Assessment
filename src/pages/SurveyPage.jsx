import React, { useState, useEffect } from 'react';
import { districts } from '../data/districts';

function SurveyPage() {
  const [audioSamples] = useState([
    { id: 1, title: 'Audio Sample 1', file: './assets/wavs/street_scene_1.wav' },
    { id: 2, title: 'Audio Sample 2', file: './assets/wavs/street_scene_113.wav' },
    { id: 3, title: 'Audio Sample 3', file: './assets/wavs/street_scene_1.wav' },
    // { id: 4, title: 'Audio Sample 4', file: './assets/wavs/street_scene_1.wav' },
    // { id: 5, title: 'Audio Sample 5', file: './assets/wavs/street_scene_1.wav' },
  ]);

  const [ratings, setRatings] = useState({});
  const [listenedTo, setListenedTo] = useState({});
  const [userInfo, setUserInfo] = useState({
    name: '',
    age: '',
    gender: '',
    district: '',
  });
  const [progress, setProgress] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Add a state to track which form fields have been touched/interacted with
  const [touchedFields, setTouchedFields] = useState({
    name: false,
    age: false,
    gender: false,
    district: false,
  });

  // Calculate progress when ratings or listenedTo changes
  useEffect(() => {
    const totalSteps = audioSamples.length * 2; // Listen + Rate for each sample
    let completedSteps = 0;

    audioSamples.forEach((sample) => {
      if (listenedTo[sample.id]) completedSteps++;
      if (ratings[sample.id]) completedSteps++;
    });

    setProgress((completedSteps / totalSteps) * 100);
  }, [ratings, listenedTo, audioSamples]);

  const handleRating = (sampleId, value) => {
    setRatings((prev) => ({ ...prev, [sampleId]: value }));
  };

  const handleListened = (sampleId) => {
    setListenedTo((prev) => ({ ...prev, [sampleId]: true }));
  };

  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    // Check if all samples have been listened to and rated
    for (const sample of audioSamples) {
      if (!listenedTo[sample.id]) {
        setError(
          `Please listen to Audio Sample ${sample.id} before submitting.`
        );
        return false;
      }
      if (!ratings[sample.id]) {
        setError(`Please rate Audio Sample ${sample.id} before submitting.`);
        return false;
      }
    }

    // Check if user info is complete
    if (
      !userInfo.name ||
      !userInfo.age ||
      !userInfo.gender ||
      !userInfo.district
    ) {
      setError('Please fill in all personal information fields.');
      return false;
    }

    setError(null);
    return true;
  };

  const submitToGoogleSheets = async () => {
    try {
      // Construct the data payload
      const formData = {
        ratings: {
          sample1: ratings[1] || '',
          sample2: ratings[2] || '',
          sample3: ratings[3] || '',
          // sample4: ratings[4] || '',
          // sample5: ratings[5] || '',
        },
        userInfo: {
          name: userInfo.name.trim(),
          age: userInfo.age,
          gender: userInfo.gender,
          district: userInfo.district.trim(),
        }
      };
      
      console.log('Submitting data to Google Sheets:', formData);
      
      // Make a POST request to Google Sheets API or App Script endpoint
      await fetch('https://script.google.com/macros/s/AKfycbwiW8RHvUQpEdTGmHb0d2NKNfY_eZOVkFYdei8hac8CCrBNA7B7PuGpBXlFCD7ApdWz_A/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      // With no-cors mode, we can't read the response, so assume success if no error is thrown
      return { success: true, message: 'Submission sent' };
    } catch (error) {
      console.error('Error submitting to Google Sheets:', error);
      return { success: false, message: 'Failed to submit. Please try again.' };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const result = await submitToGoogleSheets();
      console.log('RESULT: ', result)
      if (result.success) {
        setIsSubmitted(true);
      } else {
        setError(
          'There was a problem submitting your feedback. Please try again.'
        );
      }
    } catch (err) {
      setError(
        'There was a problem submitting your feedback. Please try again.'
      );
      console.error('Submission error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return <ThankYou />;
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Audio Quality Assessment</h1>
        <p className="intro">
          Welcome! We are developing a <strong>Nepali text-to-speech (TTS) </strong>system, and your feedback is crucial in making it sound more natural and expressive.  
          <br></br>Please listen to each audio sample carefully and rate its quality on a scale from 1 to 10, where 1 means poor and unnatural, and 10 means highly natural and excellent.  
          Your input will help us refine and enhance the speech synthesis technology for better user experience. Thank you for your time and support!
        </p>
      </header>

      <ProgressBar progress={progress} />

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div id="audioSamples">
            {audioSamples.map((sample, index) => (
              <RatingForm
                key={sample.id}
                sample={sample}
                rating={ratings[sample.id]}
                listened={listenedTo[sample.id]}
                onRate={(value) => handleRating(sample.id, value)}
                onListen={() => handleListened(sample.id)}
                animationDelay={index * 0.1} // Add staggered animation delay
              />
            ))}
          </div>

          <UserInfoForm 
            userInfo={userInfo} 
            onChange={handleUserInfoChange} 
            touchedFields={touchedFields}
            setTouchedFields={setTouchedFields}
          />

          <SubmitSection isLoading={isLoading} error={error} />
        </form>
      </div>

      <footer className="footer">
      <p className="copyright">© {new Date().getFullYear()} Nepali TTS Project</p>
      </footer>
    </div>
  );
}

// Define all the same supporting components
function RatingForm({ sample, rating, listened, onRate, onListen, animationDelay }) {
  const handleAudioEnded = () => {
    onListen();
  };

  const cardStyle = animationDelay ? 
    { animationDelay: `${animationDelay}s` } : {};

  return (
    <div className="audio-sample" style={cardStyle}>
      <div className="sample-header">
        <div className="sample-title">{sample.title}</div>
        <div className="sample-status">
          {listened && <span className="status-listened">Listened</span>}
        </div>
      </div>

      <div className="audio-player">
        <audio controls id={`audio${sample.id}`} onEnded={handleAudioEnded}>
          <source src={sample.file} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      </div>

      <div className="rating-container">
        <div className="rating-label">
          <span>Poor quality</span>
          <span>Excellent quality</span>
        </div>

        <div className="rating-buttons">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
            <button
              key={value}
              type="button"
              className={`rating-btn ${rating === value ? 'selected' : ''}`}
              onClick={() => onRate(value)}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function UserInfoForm({ userInfo, onChange, touchedFields, setTouchedFields }) {
  // Handler for name field - allow only letters and spaces
  const handleNameChange = (e) => {
    const value = e.target.value.replace(/[^A-Za-z\s]/g, '');
    const event = { ...e, target: { ...e.target, name: 'name', value } };
    onChange(event);
    // Mark this field as touched
    if (!touchedFields.name) {
      setTouchedFields(prev => ({ ...prev, name: true }));
    }
  };

  // Handler for age field - enforce numeric constraints
  const handleAgeChange = (e) => {
    const value = e.target.value;
    // Allow only numbers and enforce min/max through the input attributes
    const event = { ...e, target: { ...e.target, name: 'age', value } };
    onChange(event);
    // Mark this field as touched
    if (!touchedFields.age) {
      setTouchedFields(prev => ({ ...prev, age: true }));
    }
  };
  
  // Mark field as touched when it loses focus (blur event)
  const handleBlur = (e) => {
    const { name } = e.target;
    if (!touchedFields[name]) {
      setTouchedFields(prev => ({ ...prev, [name]: true }));
    }
  };
  
  // Handle select change and mark as touched
  const handleSelectChange = (e) => {
    onChange(e);
    const { name } = e.target;
    if (!touchedFields[name]) {
      setTouchedFields(prev => ({ ...prev, [name]: true }));
    }
  };
  
  // Get validation styling class based on field touch state and value
  const getFieldClass = (fieldName, value) => {
    if (!touchedFields[fieldName]) return "";
    return value ? "valid-field" : "invalid-field";
  };

  return (
    <div className="user-info">
      <h2>Personal Information</h2>
      <p>Please provide your details to help us with our research.</p>
      <p>*Your details won't be shared with anyone!</p>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={userInfo.name}
            onChange={handleNameChange}
            onBlur={handleBlur}
            placeholder="Enter your full name"
            required
            autoComplete="name"
            className={getFieldClass('name', userInfo.name)}
          />
          <small>Please enter alphabetic characters only</small>
        </div>

        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            name="age"
            min="18"
            max="100"
            value={userInfo.age}
            onChange={handleAgeChange}
            onBlur={handleBlur}
            placeholder="18-100"
            required
            autoComplete="off"
            className={getFieldClass('age', userInfo.age)}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            name="gender"
            value={userInfo.gender}
            onChange={handleSelectChange}
            onBlur={handleBlur}
            required
            className={`${userInfo.gender ? 'selected' : ''} ${getFieldClass('gender', userInfo.gender)}`}
          >
            <option value="" disabled>Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            {/* <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option> */}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="district">District</label>
          <select
            id="district"
            name="district"
            value={userInfo.district}
            onChange={handleSelectChange}
            onBlur={handleBlur}
            required
            className={`${userInfo.district ? 'selected' : ''} ${getFieldClass('district', userInfo.district)}`}
          >
            <option value="" disabled>Select District</option>
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ progress }) {
  return (
    <div className="progress-bar">
      <div className="progress" style={{ width: `${progress}%` }}></div>
    </div>
  );
}

function SubmitSection({ isLoading, error }) {
  return (
    <div className="submit-container">
      <button type="submit" className="btn btn-primary" disabled={isLoading}>
        {isLoading ? 'Submitting...' : 'Submit Feedback'}
      </button>

      {error && <div className="form-status error">{error}</div>}
    </div>
  );
}

function ThankYou() {
  return (
    <div className="container">
      <div className="thank-you-card">
        <h1>Thank You!</h1>
        <div className="thank-you-icon">✓</div>
        <p>Your feedback has been successfully recorded.</p>
        <p>
          Your participation helps us improve our text-to-speech technology.
        </p>
      </div>
    </div>
  );
}

export default SurveyPage;
