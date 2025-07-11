import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const WordDetailDisplay = ({ word }) => {
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    setTabValue(0); // Reset tab when word changes
  }, [word]);

  const handleTabChange = (index) => {
    setTabValue(index);
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      window.speechSynthesis.speak(utterance);
    } else {
      alert('您的浏览器不支持语音朗读功能。');
    }
  };

  if (!word) {
    return (
      <div className="text-center text-gray-500 p-8">
        请从左侧列表中选择一个词汇查看详情。
      </div>
    );
  }

  const hasForms = word.forms && Object.keys(word.forms).length > 0;
  const hasExamples = word.examples && word.examples.length > 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 min-h-[calc(100vh-250px)] flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h2 className="text-5xl font-bold text-gray-900">{word.word}</h2>
                <button className="text-gray-500 hover:text-indigo-600" onClick={() => speak(word.reading)}>
                  <span className="material-icons text-3xl">volume_up</span>
                </button>
              </div>
              <p className="text-gray-600 text-lg">{word.meaning}</p>
            </div>
            <button className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg">
              <span className="material-icons text-base">edit</span>
              Edit
            </button>
          </div>

          <div className="mb-8">
            <h3 className="text-base font-semibold text-gray-800 mb-3">Pronunciation</h3>
            <div className="flex gap-2">
              <button className="bg-indigo-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium" onClick={() => speak(word.reading)}>Standard</button>
              {/* <button className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-300">Slow</button> */}
            </div>
          </div>
        </div>

        <div>
          {hasExamples ? (
            <div className="mb-8">
              <h3 className="text-base font-semibold text-gray-800 mb-3">Examples</h3>
              <div className="space-y-4">
                {word.examples.map((ex, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-lg text-gray-900 mb-1">{ex.japanese}</p>
                    <p className="text-sm text-gray-600">{ex.translation}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mb-8 text-gray-500">
              <h3 className="text-base font-semibold text-gray-800 mb-3">Examples</h3>
              <p>No examples found.</p>
            </div>
          )}

          {hasForms ? (
            <div className="mb-8">
              <h3 className="text-base font-semibold text-gray-800 mb-3">Verb Conjugation</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 rounded-l-lg" scope="col">Form</th>
                      <th className="px-6 py-3" scope="col">Positive</th>
                      <th className="px-6 py-3 rounded-r-lg" scope="col">Negative</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(word.forms).map(([name, form]) => (
                      <tr key={name} className="bg-white border-b">
                        <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap" scope="row">{name.replace(/_/g, ' ')}</th>
                        <td className="px-6 py-4">{form.positive}</td>
                        <td className="px-6 py-4">{form.negative}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="mb-8 text-gray-500">
              <h3 className="text-base font-semibold text-gray-800 mb-3">Verb Conjugation</h3>
              <p>No conjugations found.</p>
            </div>
          )}

          {/* Related Grammar - Placeholder for now */}
          {/* <div>
            <h3 className="text-base font-semibold text-gray-800 mb-3">Related Grammar</h3>
            <div className="flex gap-2">
              <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">ます</span>
              <span className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">ません</span>
            </div>
          </div> */}
        </div>
      </div>
    </motion.div>
  );
};

export default WordDetailDisplay;
