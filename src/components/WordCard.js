import React from 'react';

const WordCard = ({ word, onSelect, isLearned }) => {
  const typeColorClass = {
    verb: 'border-primary',
    noun: 'border-success',
    adjective: 'border-warning'
  };

  const badgeBgClass = {
    verb: 'bg-primary',
    noun: 'bg-success',
    adjective: 'bg-warning'
  };

  return (
    <div className={`card h-100 ${typeColorClass[word.type] || 'border-secondary'} ${isLearned ? 'bg-light' : ''}`} style={{cursor: 'pointer', borderWidth: '2px'}} onClick={() => onSelect(word)}>
      <div className="card-body d-flex flex-column">
        <h5 className="card-title mb-1">
          {word.word} ({word.reading})
          {isLearned && <span className="badge bg-success ms-2">已学习</span>}
        </h5>
        <h6 className="card-subtitle mb-2 text-muted flex-grow-1">{word.meaning}</h6>
        <div className="mt-auto">
          <span className={`badge ${badgeBgClass[word.type] || 'bg-secondary'}`}>{word.type}</span>
          {word.group && word.type !== 'noun' && <span className="badge bg-info ms-2">{word.group}</span>}
        </div>
      </div>
    </div>
  );
};

export default WordCard;