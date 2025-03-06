import React from 'react';

const ResearchDescription = () => {
  return (
    <div className="research-description">
      <div className="highlight-text">
        <p>
          Our research focuses on developing a comprehensive
          <span className="research-focus"> Text-to-Speech (TTS) system </span>
          specifically designed for under-resourced languages. We begin by establishing a
          <span className="methodology-highlight"> robust pipeline </span>
          that addresses the unique challenges of low-resource scenarios.
        </p>
      </div>

      <div className="pipeline-stages">
        <div className="pipeline-stage">
          <h3 className="stage-title">Grapheme-to-Phoneme (G2P) Conversion</h3>
          <p className="stage-description">
            We've implemented both pre-built and custom-developed G2P techniques,
            specifically optimized for handling the complexities of under-resourced
            language phonetics.
          </p>
        </div>

        <div className="pipeline-stage">
          <h3 className="stage-title">Advanced Preprocessing</h3>
          <p className="stage-description">
            Our preprocessing pipeline incorporates various experimental approaches,
            combining established methods with innovative techniques tailored for
            low-resource scenarios.
          </p>
        </div>

        <div className="pipeline-stage">
          <h3 className="stage-title">TTS Model Development</h3>
          <p className="stage-description">
            We've developed three distinct TTS models, each exploring different aspects
            of speech synthesis. This includes experimental work with longer sequences
            and specialized architectures for under-resourced languages.
          </p>
        </div>

        <div className="pipeline-stage">
          <h3 className="stage-title">Subjective Evaluation</h3>
          <p className="stage-description">
            Through comprehensive surveys, we're conducting thorough subjective
            evaluations of our TTS outputs, including an experimental model designed
            to test the boundaries of synthesis capabilities.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResearchDescription;