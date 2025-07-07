import React from 'react';

const WordCard = ({ word, onSelect, isLearned }) => {
  const typeColorClass = {
    verb: 'bg-primary',
    noun: 'bg-success',
    adjective: 'bg-warning'
  };

  const handlePlayAudio = (e) => {
    e.stopPropagation(); // Prevent card click from navigating
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word.reading);
      utterance.lang = 'ja-JP'; // Set language to Japanese
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn('Speech synthesis not supported in this browser.');
    }
  };

  return (
    <div
      className={`card h-100 shadow-sm border-0 rounded-3 ${isLearned ? 'card-learned' : ''}`}
      style={{ cursor: 'pointer', transition: 'all 0.3s ease-in-out' }}
      onClick={() => onSelect(word)}
    >
      <div className="card-body d-flex flex-column p-4">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title mb-0 text-dark fw-bold fs-4">
            {word.word} <span className="text-muted fw-normal fs-6">({word.reading})</span>
            <button className="btn btn-sm btn-outline-primary ms-2" onClick={handlePlayAudio}>
              <i className="bi bi-volume-up-fill"></i>
            </button>
          </h5>
          {isLearned && (
            <span className="badge bg-success-subtle text-success rounded-pill px-3 py-2 d-flex align-items-center">
              <i className="bi bi-check-circle-fill me-1"></i> 已学习
            </span>
          )}
        </div>
        <p className="card-text text-muted flex-grow-1 mb-3 fs-6">{word.meaning}</p>
        <div className="mt-auto d-flex flex-wrap gap-2">
          <span className={`badge ${typeColorClass[word.type] || 'bg-secondary'} fs-6 px-3 py-2 rounded-pill`}>{word.type}</span>
          {word.group && word.type !== 'noun' && (
            <span className="badge bg-info-subtle text-info fs-6 px-3 py-2 rounded-pill">{word.group}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default WordCard;