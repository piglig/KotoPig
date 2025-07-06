import React from 'react';
import { useWordContext } from '../contexts/WordContext';
import { useNavigate } from 'react-router-dom';

const ProgressView = () => {
  const { progress } = useWordContext();
  const navigate = useNavigate();

  const totalLearned = Object.keys(progress).length;
  // Simple streak calculation (can be improved)
  const calculateStreak = () => {
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dates = Object.values(progress).map(p => new Date(p.lastReviewed));
    dates.sort((a, b) => b - a);

    let lastDate = today;
    for (let i = 0; i < dates.length; i++) {
      const d = new Date(dates[i]);
      d.setHours(0, 0, 0, 0);
      if (lastDate.getTime() === d.getTime()) {
        if (streak === 0) streak = 1;
        lastDate.setDate(lastDate.getDate() - 1);
      } else if (lastDate.getTime() - d.getTime() === 24 * 60 * 60 * 1000) {
        streak++;
        lastDate = d;
      } else {
        break;
      }
    }
    return streak;
  };

  return (
    <div className="card shadow-lg p-5 mx-auto rounded-4" style={{ maxWidth: '600px' }}>
      <div className="card-body text-center">
        <h3 className="card-title mb-5">我的学习进度</h3>
        <div className="row text-center mt-4">
          <div className="col-md-6">
            <div className="p-4 bg-light rounded-3 mb-3">
              <h4>{totalLearned}</h4>
              <p className="text-muted mb-0">已学习词汇</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="p-4 bg-light rounded-3 mb-3">
              <h4>{calculateStreak()} 天</h4>
              <p className="text-muted mb-0">当前连击</p>
            </div>
          </div>
        </div>
        <div className="text-center mt-5">
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/')}>返回主页</button>
        </div>
      </div>
    </div>
  );
};

export default ProgressView;