import React from 'react';

const VerbDetail = ({ word, onBack, onLearnWord, isLearned }) => {

  const speak = (text) => {
    if('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP';
        speechSynthesis.speak(utterance);
    } else {
        alert('您的浏览器不支持语音朗读功能。');
    }
  };

  return (
    <div>
      <button className="btn btn-secondary mb-4" onClick={onBack}>← 返回列表</button>
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
          <h2 className="mb-0">{word.word} ({word.reading}) <button className="btn btn-sm btn-outline-primary" onClick={() => speak(word.reading)}>🔊</button></h2>
          <div className="mt-2 mt-md-0">
            <button className="btn btn-success me-2" onClick={() => onLearnWord(word)} disabled={isLearned}>
              {isLearned ? '已在学习计划中' : '添加到学习计划'}
            </button>
            <a href={`https://jisho.org/search/${word.word}`} target="_blank" rel="noopener noreferrer" className="btn btn-info">在Jisho.org上查看</a>
          </div>
        </div>
        <div className="card-body">
          <p className="lead">{word.meaning}</p>
          <span className={`badge bg-primary`}>{word.type}</span>
          {word.group && <span className="badge bg-info ms-2">{word.group}</span>}
          
          <hr />

          {word.type === "verb" && <h4>动词变形</h4>}
          {word.type === "adjective" && <h4>形容词变形</h4>}
          {word.type !== "noun" && Object.keys(word.forms).length > 0 && (
            <table className="table table-striped">
              <tbody>
                {Object.entries(word.forms).map(([formName, formValue]) => (
                  <tr key={formName}>
                    <td>{formName.replace(/_form/g, '').replace(/_/g, ' ')}</td>
                    <td>{formValue} <button className="btn btn-sm btn-outline-secondary" onClick={() => speak(formValue)}>🔊</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {word.type !== "noun" && Object.keys(word.forms).length === 0 && (
            <p>暂无变形信息。</p>
          )}

          <hr />

          <h4>例句</h4>
          {word.examples.map((ex, index) => (
            <div key={index} className="mb-3">
              <p><strong>{ex.japanese}</strong> <button className="btn btn-sm btn-outline-secondary" onClick={() => speak(ex.japanese)}>🔊</button></p>
              <p className="text-muted">{ex.reading}</p>
              <p>{ex.translation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VerbDetail;