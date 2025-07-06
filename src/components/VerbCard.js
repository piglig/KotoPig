import React from 'react';

const VerbCard = ({ word, onSelect, isLearned }) => {
  const typeColor = {
    verb: 'border-primary',
    noun: 'border-success',
    adjective: 'border-warning'
  };

  return (
    <div className={`card h-100 ${typeColor[word.type] || 'border-secondary'} ${isLearned ? 'bg-light' : ''}`} style={{cursor: 'pointer', borderWidth: '2px'}} onClick={() => onSelect(word)}>
      <div className="card-body">
        <h5 className="card-title">{word.word} ({word.reading}) {isLearned && <span className="badge bg-success">已学习</span>}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{word.meaning}</h6>
        <span className={`badge bg-${typeColor[word.type]?.split('-')[1] || 'secondary'}`}>{word.type}</span>
        {word.group && <span className="badge bg-info ms-2">{word.group}</span>}
      </div>
    </div>
  );
};

export default VerbCard;