import React, { useState, useEffect } from 'react';
import { districts } from '../data/districts';
import '../styles/SurveyPage.css';
import '../styles/ThankYou.css';


function SurveyPage() {
  const [audioSamples] = useState([
    { 
      id: 1, 
      title: 'Audio Sample 1', 
      file: './assets/wavs/audio6.wav',
      transcription: 'स्वास्थ्य र चिकित्सा क्षेत्रमा सरकारी नीतिहरूको प्रभावकारिता र दीर्घकालिक लाभहरूको मूल्याङ्कन गर्न अभियान्त्रिक पद्धति आवश्यक छ।'
    },
    { 
      id: 2,
      title: 'Audio Sample 2', 
      file: './assets/wavs/audio3.wav',
      transcription: 'सार्वजनिक नीति र सामाजिक विकासका पक्षमा प्रभावकारी योजनाहरूको आवश्यकता अझै महत्त्वपूर्ण बनेको छ।'
    },
    { 
      id: 3, 
      title: 'Audio Sample 3', 
      file: './assets/wavs/audio4.wav',
      transcription: 'राष्ट्रिय परीक्षा बोर्डका कर्मचारीले विद्यालय शिक्षा सम्बन्धी विधेयकमा व्यवस्थामा असन्तुष्टि जनाउँदै आन्दोलन सुरु गरेका छन् ।'
    },
    { 
      id: 4, 
      title: 'Audio Sample 4', 
      file: './assets/wavs/audio5.wav',
      transcription: 'विश्वव्यापी अन्तर्विरोधात्मक संघर्षहरूको बहुआयामिक पुनर्निर्माणले संवेदनशील राजनीतिक परिवर्तनको जटिल प्रक्रियालाई अन्तर्निहित गर्दछ।'
    },
    { 
      id: 5, 
      title: 'Audio Sample 5', 
      isComparison: true,
      groundTruthFile: './assets/wavs/groundTruth.mp3',
      generatedFile: './assets/wavs/generated.mp3',
      transcription: 'जनताको अधिकार र स्वतन्त्रता सुनिश्चित गर्नका लागि प्रभावकारी कानुनी संरचनाहरूको विकास आवश्यक छ, जसले जनतामा विश्वास र सरकारप्रतिको सकारात्मक धारणा स्थापना गर्न सहयोग गर्नेछ।',
      comparisonQuestion: 'How similar is the generated audio to original audio in terms of voice, tone, and style of the speaker?'
    },
    // for fun test
     {
      id: 6,
      title: 'Audio Sample 6',
      file: './assets/wavs/forfun.wav',
      isDistortionCheck: true,
      transcription: 'तीनवटै तहका सरकारमा रहेको कांग्रेसले चार दिनसम्म बसेको केन्द्रीय कार्यसमिति बैठकमा सदस्यहरुले राखेका धारणाका आधारमा मुलुकको आर्थिक अवस्था कमजोर रहेका बेला सरकारले फजुल खर्च कम गर्नुपर्ने र आर्थिक मितव्ययिता अपनाउनुपर्ने विषय आफ्ना जनप्रतिनिधिहरुलाई स्मरण गराएको हो ।'
     }
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

  // Modified to handle ground truth and generated audio
  const handleComparisonListened = (sampleId, type) => {
    setListenedTo((prev) => {
      // If both audios have been listened to, mark the sample as listened
      if (type === 'groundTruth' && prev[`${sampleId}-generated`]) {
        return { ...prev, [sampleId]: true, [`${sampleId}-${type}`]: true };
      } else if (type === 'generated' && prev[`${sampleId}-groundTruth`]) {
        return { ...prev, [sampleId]: true, [`${sampleId}-${type}`]: true };
      } else {
        return { ...prev, [`${sampleId}-${type}`]: true };
      }
    });
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
          sample4: ratings[4] || '',
          sample5: ratings[5] || '',
          sample6: ratings[6] || '',
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
      await fetch(`${import.meta.env.VITE_SHEET_URL}`, {
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
          For the comparison sample, please rate how similar the generated audio is to the original human speech.
          Your input will help us refine and enhance the speech synthesis technology for better user experience. Thank you for your time and support!
        </p>
      </header>

      <ProgressBar progress={progress} />

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div id="audioSamples">
            {audioSamples.map((sample, index) => (
              sample.isComparison ? (
                <ComparisonRatingForm
                  key={sample.id}
                  sample={sample}
                  rating={ratings[sample.id]}
                  listened={listenedTo[sample.id]}
                  onRate={(value) => handleRating(sample.id, value)}
                  onListen={(type) => handleComparisonListened(sample.id, type)}
                  groundTruthListened={listenedTo[`${sample.id}-groundTruth`]}
                  generatedListened={listenedTo[`${sample.id}-generated`]}
                  animationDelay={index * 0.1}
                />
              ) : (
                <RatingForm
                  key={sample.id}
                  sample={sample}
                  rating={ratings[sample.id]}
                  listened={listenedTo[sample.id]}
                  onRate={(value) => handleRating(sample.id, value)}
                  onListen={() => handleListened(sample.id)}
                  animationDelay={index * 0.1}
                />
              )
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

// Update RatingForm component - REMOVE ALL INLINE STYLES
function RatingForm({ sample, rating, listened, onRate, onListen, animationDelay }) {
  const handleAudioEnded = () => {
    onListen();
  };

  const cardStyle = animationDelay ? 
    { animationDelay: `${animationDelay}s` } : {};

  return (
    <div className={`audio-sample ${sample.isDistortionCheck ? 'distortion-sample' : ''}`} style={cardStyle}>
      <div className="sample-header">
        <div className="sample-title">{sample.title}</div>
        <div className="sample-status">
          {listened && <span className="status-listened">Listened</span>}
        </div>
      </div>

      {sample.transcription && (
        <div className="transcription-container">
          <p className="transcription-text">{sample.transcription}</p>
        </div>
      )}

      <div className="audio-player">
        <audio 
          controls 
          id={`audio${sample.id}`} 
          onEnded={handleAudioEnded}
        >
          <source src={sample.file} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      </div>

      <div className="rating-container">
        {
          sample.isDistortionCheck ?
          <h3 className="rating-question">Do you hear any distortions or artifacts? If yes, select how many words sounded incorrect or unclear?</h3>
          :
          <h3 className="rating-question">How natural and human-like does this audio sound to you?</h3>
        }

        {
          sample.isDistortionCheck ?
          <div className="rating-label">
            <span>No Distortions</span>
            <span>10+ Distortions</span>
          </div>
          :
          <div className="rating-label">
            <span>Robotic</span>
            <span>Natural</span>
          </div>
        }

        <div className="rating-buttons">
          {
            sample.isDistortionCheck ?
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
              <button
                key={value}
                type="button"
                className={`rating-btn ${rating === value ? 'selected' : ''}`}
                onClick={() => onRate(value)}
              >
                {value}
              </button>
            ))
            :
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
              <button
                key={value}
                type="button"
                className={`rating-btn ${rating === value ? 'selected' : ''}`}
                onClick={() => onRate(value)}
              >
                {value}
              </button>
            ))
          }
        </div>
      </div>
    </div>
  );
}

// New component for the comparison rating - REMOVE ALL INLINE STYLES
function ComparisonRatingForm({ sample, rating, listened, onRate, onListen, groundTruthListened, generatedListened, animationDelay }) {
  const handleGroundTruthEnded = () => {
    onListen('groundTruth');
  };

  const handleGeneratedEnded = () => {
    onListen('generated');
  };

  const cardStyle = animationDelay ? 
    { animationDelay: `${animationDelay}s` } : {};

  return (
    <div className="audio-sample comparison-sample" style={cardStyle}>
      <div className="sample-header">
        <div className="sample-title">{sample.title}</div>
        <div className="sample-status">
          {listened && <span className="status-listened">Both Listened</span>}
        </div>
      </div>

      {sample.transcription && (
        <div className="transcription-container">
          <p className="transcription-text">{sample.transcription}</p>
        </div>
      )}

      <div className="comparison-audio-container">
        <div className="audio-comparison-section">
          <h4>Original Human Voice (Ground Truth)</h4>
          <div className="audio-player">
            <audio controls id={`groundTruth-${sample.id}`} onEnded={handleGroundTruthEnded}>
              <source src={sample.groundTruthFile} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
            {groundTruthListened && <span className="audio-listened-badge">✓ Listened</span>}
          </div>
        </div>

        <div className="audio-comparison-section">
          <h4>AI-Generated Voice</h4>
          <div className="audio-player">
            <audio controls id={`generated-${sample.id}`} onEnded={handleGeneratedEnded}>
              <source src={sample.generatedFile} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
            {generatedListened && <span className="audio-listened-badge">✓ Listened</span>}
          </div>
        </div>
      </div>

      <div className="rating-container">
        <h3 className="rating-question">{sample.comparisonQuestion}</h3>
        
        <div className="rating-label">
          <span>Very Different</span>
          <span>Identical</span>
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

// Update UserInfoForm - REMOVE INLINE STYLES
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
      <h2 className="user-info-title">Personal Information</h2>
      <p className="user-info-description">Please provide your details to help us with our research.</p>
      <p className="user-info-note">*Your details won't be shared with anyone!</p>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name" className="form-label">Full Name</label>
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
          <label htmlFor="age" className="form-label">Age</label>
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
          <label htmlFor="gender" className="form-label">Gender</label>
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
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="district" className="form-label">District</label>
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

// Update ProgressBar - REMOVE INLINE STYLES
function ProgressBar({ progress }) {
  return (
    <div className="progress-bar">
      <div className="progress" style={{ width: `${progress}%` }}></div>
    </div>
  );
}

// Update SubmitSection - Enhanced red submit button
function SubmitSection({ isLoading, error }) {
  return (
    <div className="submit-container">
      <button 
        type="submit" 
        className="btn btn-primary red-button" 
        disabled={isLoading}
      >
        {isLoading ? 'Submitting...' : 'Submit Evaluation'}
      </button>

      {error && <div className="form-status error">{error}</div>}
    </div>
  );
}

// Update ThankYou - Enhanced thank you page with proper gradient definitions for SVG
function ThankYou() {
  return (
    <div className="container thank-you-container">
      <div className="thank-you-card">
        <h1 className="thank-you-title">Thank You!</h1>
        
        <div className="thank-you-svg">
          <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--nepali-blue)" />
                <stop offset="100%" stopColor="var(--nepali-red)" />
              </linearGradient>
            </defs>
            <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
            <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
        </div>
        
        <div className="thank-you-message">
          <p className="message-text">Your feedback has been successfully recorded.</p>
          <p className="message-text">Your participation helps us improve our Nepali text-to-speech technology.</p>
          <p className="message-text nepali-thanks">धन्यवाद!</p>
        </div>
        
        <div className="decorative-elements">
          <div className="decoration decoration-1"></div>
          <div className="decoration decoration-2"></div>
          <div className="decoration decoration-3"></div>
        </div>
      </div>
    </div>
  );
}

export default SurveyPage;
