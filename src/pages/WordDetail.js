import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWordContext } from '../contexts/WordContext';

const WordDetail = () => {
  const { word: wordParam } = useParams();
  const navigate = useNavigate();
  const { words, learnWord, progress } = useWordContext();
  const [word, setWord] = useState(null);

  useEffect(() => {
    if (words.length > 0 && wordParam) {
      const foundWord = words.find(w => w.word === wordParam);
      setWord(foundWord);
    }
  }, [words, wordParam]);

  const speak = (text) => {
    if('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP';
        speechSynthesis.speak(utterance);
    } else {
        alert('您的浏览器不支持语音朗读功能。');
    }
  };

  if (!word) {
    return <div>加载中或未找到词汇...</div>;
  }

  const isLearned = !!progress[word.word];

  const typeColorClass = {
    verb: 'bg-primary',
    noun: 'bg-success',
    adjective: 'bg-warning'
  };

  return (
    <div>
      <button className="btn btn-secondary mb-4" onClick={() => navigate(-1)}>← 返回</button>
      <div className="card">
        <div className="card-header d-flex flex-column flex-md-row justify-content-between align-items-center p-4">
          <div className="d-flex align-items-center mb-3 mb-md-0">
            <h2 className="mb-0 me-3">{word.word} ({word.reading})</h2>
            <button className="btn btn-sm btn-outline-primary rounded-circle" onClick={() => speak(word.reading)} style={{ width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <i className="bi bi-volume-up-fill"></i>
            </button>
          </div>
          <div className="d-flex flex-wrap justify-content-center">
            <button className="btn btn-success me-2 mb-2 mb-md-0" onClick={() => learnWord(word)} disabled={isLearned}>
              {isLearned ? '已在学习计划中' : '添加到学习计划'}
            </button>
            <a href={`https://jisho.org/search/${word.word}`} target="_blank" rel="noopener noreferrer" className="btn btn-info mb-2 mb-md-0">在Jisho.org上查看</a>
          </div>
        </div>
        <div className="card-body p-4">
          <p className="lead mb-3">{word.meaning}</p>
          <span className={`badge ${typeColorClass[word.type] || 'bg-secondary'}`}>{word.type}</span>
          {word.group && word.type !== 'noun' && <span className="badge bg-info ms-2">{word.group}</span>}
          
          <hr className="my-4" />

          {(word.type === "verb" || word.type === "adjective") && (
            <div className="accordion" id="formsAccordion">
              <div className="accordion-item">
                <h2 className="accordion-header" id="formsHeading">
                  <button className="accordion-button fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#collapseForms" aria-expanded="true" aria-controls="collapseForms">
                    {word.type === "verb" ? "动词变形" : "形容词变形"}
                  </button>
                </h2>
                <div id="collapseForms" className="accordion-collapse collapse show" aria-labelledby="formsHeading" data-bs-parent="#formsAccordion">
                  <div className="accordion-body p-0">
                    {Object.keys(word.forms).length > 0 ? (
                      <table className="table table-hover mb-0">
                        <tbody>
                          {Object.entries(word.forms).map(([formName, formValue]) => (
                            <tr key={formName}>
                              <td className="fw-bold">{formName.replace(/_form/g, '').replace(/_/g, ' ')}</td>
                              <td>{formValue} <button className="btn btn-sm btn-outline-secondary ms-2" onClick={() => speak(formValue)}><i className="bi bi-volume-up-fill"></i></button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="p-3">暂无变形信息。</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="accordion mt-4" id="examplesAccordion">
            <div className="accordion-item">
              <h2 className="accordion-header" id="examplesHeading">
                <button className="accordion-button fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExamples" aria-expanded="true" aria-controls="collapseExamples">
                  例句
                </button>
              </h2>
              <div id="collapseExamples" className="accordion-collapse collapse show" aria-labelledby="examplesHeading" data-bs-parent="#examplesAccordion">
                <div className="accordion-body">
                  {word.examples.length > 0 ? (
                    word.examples.map((ex, index) => (
                      <div key={index} className="mb-3 p-2 border rounded bg-light">
                        <p className="mb-1"><strong>{ex.japanese}</strong> <button className="btn btn-sm btn-outline-secondary ms-2" onClick={() => speak(ex.japanese)}><i className="bi bi-volume-up-fill"></i></button></p>
                        <p className="text-muted mb-1">{ex.reading}</p>
                        <p className="mb-0">{ex.translation}</p>
                      </div>
                    ))
                  ) : (
                    <p>暂无例句信息。</p>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WordDetail;