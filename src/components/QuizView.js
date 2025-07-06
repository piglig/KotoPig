import React, { useState, useEffect } from 'react';
import { useWordContext } from '../contexts/WordContext';
import { useNavigate } from 'react-router-dom';

const QuizView = () => {
  const { getWordsToReview, updateReviewProgress } = useWordContext();
  const navigate = useNavigate();

  const wordsToReview = getWordsToReview();

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentForm, setCurrentForm] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [word, setWord] = useState(null);

  useEffect(() => {
    if (wordsToReview.length > 0) {
      const currentWord = wordsToReview[currentWordIndex];
      setWord(currentWord);
      selectRandomForm(currentWord);
    }
  }, [wordsToReview, currentWordIndex]);

  const selectRandomForm = (word) => {
    const forms = Object.keys(word.forms);
    if (forms.length === 0) {
      // If no forms, skip this word or handle appropriately
      handleNext();
      return;
    }
    const randomForm = forms[Math.floor(Math.random() * forms.length)];
    setCurrentForm(randomForm);
  };

  const speak = (text) => {
    if('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP';
        speechSynthesis.speak(utterance);
    } else {
        alert('您的浏览器不支持语音朗读功能。');
    }
  };

  const handleCheckAnswer = () => {
    const correctAnswer = word.forms[currentForm];
    const correct = userAnswer.trim() === correctAnswer;
    setIsCorrect(correct);
    updateReviewProgress(word, correct);
  };

  const handleNext = () => {
    setIsCorrect(null);
    setUserAnswer('');
    if (currentWordIndex < wordsToReview.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    } else {
      navigate('/'); // All words reviewed, go back to home
    }
  };

  if (wordsToReview.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="lead">🎉 太棒了! 今天没有需要复习的词汇。</p>
        <button className="btn btn-primary btn-lg" onClick={() => navigate('/')}>返回主页</button>
      </div>
    );
  }

  if (!word) return null; // Loading state

  return (
    <div className="card shadow-lg p-5 mx-auto rounded-4" style={{ maxWidth: '600px' }}>
      <div className="card-body text-center">
        <h3 className="card-title mb-5">复习时间！ ({currentWordIndex + 1}/{wordsToReview.length})</h3>
        <p className="lead mb-4">
          请输入 <strong>{word.word}</strong> ({word.reading}) 
          <button className="btn btn-sm btn-outline-primary ms-2 rounded-circle" onClick={() => speak(word.reading)} style={{ width: '36px', height: '36px', display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}>
            <i className="bi bi-volume-up-fill"></i>
          </button>
          的 <strong>{currentForm.replace(/_form/g, '').replace(/_/g, ' ')}</strong>
        </p>
        
        <div className="input-group my-4 justify-content-center">
          <input 
            type="text" 
            className={`form-control form-control-lg ${isCorrect === true ? 'is-valid' : isCorrect === false ? 'is-invalid' : ''}`}
            value={userAnswer} 
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && isCorrect === null && handleCheckAnswer()}
            disabled={isCorrect !== null}
            autoFocus
            style={{ maxWidth: '300px' }}
          />
          <button className="btn btn-primary btn-lg" onClick={handleCheckAnswer} disabled={isCorrect !== null}>检查</button>
        </div>

        {isCorrect === false && (
          <div className="alert alert-danger mt-4 d-flex align-items-center justify-content-center py-3" style={{ fontSize: '1.1rem' }}>
            <i className="bi bi-x-circle-fill me-2"></i>
            正确答案是: <strong>{word.forms[currentForm]}</strong>
          </div>
        )}
        {isCorrect === true && (
          <div className="alert alert-success mt-4 d-flex align-items-center justify-content-center py-3" style={{ fontSize: '1.1rem' }}>
            <i className="bi bi-check-circle-fill me-2"></i>
            回答正确！
          </div>
        )}

        {isCorrect !== null && (
          <button className="btn btn-info btn-lg mt-5" onClick={handleNext}>
            {currentWordIndex < wordsToReview.length - 1 ? '下一个 →' : '完成复习 🎉'}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizView;