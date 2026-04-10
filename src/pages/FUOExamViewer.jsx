import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fuoExamDataBySubject } from '../data/fuoExamData';

const ANSWER_PATTERN = /^[A-F](\s*,\s*[A-F])*$/i;

const normalizeChoices = (choices) => {
  const unique = [...new Set(choices.map((choice) => String(choice).trim().toUpperCase()))]
    .filter((choice) => /^[A-F]$/.test(choice));

  return unique.sort();
};

const parseCorrectChoices = (answer) => {
  if (typeof answer !== 'string') {
    return [];
  }

  const trimmed = answer.trim();
  if (!ANSWER_PATTERN.test(trimmed)) {
    return [];
  }

  return normalizeChoices(trimmed.split(','));
};

const isSameChoiceSet = (left, right) => {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((choice, index) => choice === right[index]);
};

export default function FUOExamViewer() {
  const { ky, subject, variant, examId } = useParams();
  const exams = fuoExamDataBySubject[subject]?.[variant] ?? [];
  const exam = exams.find((item) => item.id === examId);

  const questionItems = useMemo(() => {
    if (!exam) {
      return [];
    }

    if (Array.isArray(exam.questionItems) && exam.questionItems.length > 0) {
      return exam.questionItems;
    }

    return exam.imageUrls.map((src, index) => ({
      questionNumber: index + 1,
      imageUrl: src,
      answer: null,
    }));
  }, [exam]);

  const [viewerState, setViewerState] = useState(() => ({
    examId,
    currentIndex: 0,
  }));
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTestMode, setIsTestMode] = useState(false);
  const [testSelections, setTestSelections] = useState({});
  const [testResult, setTestResult] = useState(null);
  const imagePanelRef = useRef(null);

  const currentIndex = viewerState.examId === examId ? viewerState.currentIndex : 0;

  const updateCurrentIndex = useCallback((updater) => {
    setViewerState((prev) => {
      const baseIndex = prev.examId === examId ? prev.currentIndex : 0;
      const nextIndex = typeof updater === 'function' ? updater(baseIndex) : updater;

      return {
        examId,
        currentIndex: nextIndex,
      };
    });
  }, [examId]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (questionItems.length === 0) {
        return;
      }

      if (event.key === 'ArrowLeft') {
        updateCurrentIndex((prev) => Math.max(0, prev - 1));
      }

      if (event.key === 'ArrowRight') {
        updateCurrentIndex((prev) => Math.min(questionItems.length - 1, prev + 1));
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [questionItems.length, updateCurrentIndex]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === imagePanelRef.current);
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    const panel = imagePanelRef.current;

    if (!panel) {
      return;
    }

    if (document.fullscreenElement === panel) {
      await document.exitFullscreen();
      return;
    }

    await panel.requestFullscreen();
  };

  const currentQuestionNumber = questionItems[currentIndex]?.questionNumber;
  const selectedChoices = testSelections[currentQuestionNumber] ?? [];
  const currentQuestionResult = testResult?.questionResults?.[currentIndex] ?? null;

  const toggleChoice = (choice) => {
    if (!currentQuestionNumber) {
      return;
    }

    setTestSelections((prev) => {
      const current = prev[currentQuestionNumber] ?? [];
      const next = current.includes(choice)
        ? current.filter((item) => item !== choice)
        : [...current, choice];

      return {
        ...prev,
        [currentQuestionNumber]: next,
      };
    });
  };

  const checkTestResult = () => {
    const questionResults = questionItems.map((item) => {
      const correctChoices = parseCorrectChoices(item.answer);
      const selectedChoicesForQuestion = normalizeChoices(testSelections[item.questionNumber] ?? []);

      if (correctChoices.length === 0) {
        return {
          questionNumber: item.questionNumber,
          isGraded: false,
          isCorrect: false,
          selectedAnswer: selectedChoicesForQuestion.join(',') || null,
          correctAnswer: null,
        };
      }

      return {
        questionNumber: item.questionNumber,
        isGraded: true,
        isCorrect: isSameChoiceSet(selectedChoicesForQuestion, correctChoices),
        selectedAnswer: selectedChoicesForQuestion.join(',') || null,
        correctAnswer: correctChoices.join(','),
      };
    });

    const summary = questionResults.reduce((acc, item) => {
      if (!item.isGraded) {
        acc.ungraded += 1;
        return acc;
      }

      if (!item.selectedAnswer) {
        acc.unanswered += 1;
      }

      if (item.isCorrect) {
        acc.correct += 1;
      } else {
        acc.wrong += 1;
      }

      return acc;
    }, {
      correct: 0,
      wrong: 0,
      unanswered: 0,
      ungraded: 0,
    });

    setTestResult({
      ...summary,
      gradedTotal: summary.correct + summary.wrong,
      questionTotal: questionItems.length,
      questionResults,
    });
  };

  if (!exam) {
    return (
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="text-danger">Khong tim thay de</h3>
          <Link to={`/fuo/ky/${ky}/${subject}/${variant}`} className="btn btn-outline-primary mt-2">
            Quay lai kho de
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm fuo-semester-card">
      <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center border-0">
        <h3 className="mb-0">{exam.title}</h3>
        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className={`btn btn-sm ${isTestMode ? 'btn-warning' : 'btn-outline-warning'}`}
            onClick={() => {
              setIsTestMode((prev) => {
                const nextValue = !prev;
                if (!nextValue) {
                  setTestSelections({});
                }

                return nextValue;
              });
              setTestResult(null);
            }}
          >
            {isTestMode ? 'Thoat lam kiem tra' : 'Lam kiem tra'}
          </button>

          <Link to={`/fuo/ky/${ky}/${subject}/${variant}`} className="btn btn-sm btn-light">
            Quay lai kho de
          </Link>
        </div>
      </div>

      <div className="card-body">
        {questionItems.length === 0 ? (
          <div className="alert alert-info mb-0">
            Chua co anh cau hoi. Ban chi can them duong dan anh vao imageUrls trong fuoExamData.js.
          </div>
        ) : (
          <div className="fuo-question-viewer">
            <div className="fuo-question-image-panel" ref={imagePanelRef}>
              <div className="fuo-image-tools">
                <button
                  type="button"
                  className="fuo-fullscreen-button"
                  onClick={toggleFullscreen}
                  aria-label={isFullscreen ? 'Thoat toan man hinh' : 'Phong to toan man hinh'}
                >
                  {isFullscreen ? 'Thoat full' : 'Full man hinh'}
                </button>
              </div>

              <button
                type="button"
                className="fuo-nav-button left"
                onClick={() => updateCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                aria-label="Cau truoc"
              >
                {'<'}
              </button>

              <img
                src={questionItems[currentIndex].imageUrl}
                alt={`${subject} ${exam.title} ${variant} cau ${questionItems[currentIndex].questionNumber}`}
                className="fuo-question-image"
              />

              <button
                type="button"
                className="fuo-nav-button right"
                onClick={() => updateCurrentIndex((prev) => Math.min(questionItems.length - 1, prev + 1))}
                disabled={currentIndex === questionItems.length - 1}
                aria-label="Cau sau"
              >
                {'>'}
              </button>
            </div>

            {isTestMode ? (
              <aside className="fuo-answer-panel fuo-test-panel">
                <div className="fuo-answer-label">Che do</div>
                <h4 className="fuo-answer-code">Lam kiem tra</h4>

                <div className="fuo-answer-box">
                  <div className="fuo-answer-question">Cau {String(questionItems[currentIndex].questionNumber).padStart(2, '0')}</div>
                  <div className="fuo-test-choice-grid">
                    {['A', 'B', 'C', 'D', 'E', 'F'].map((choice) => (
                      <label key={choice} className="fuo-test-choice-item">
                        <input
                          type="checkbox"
                          checked={selectedChoices.includes(choice)}
                          onChange={() => toggleChoice(choice)}
                        />
                        <span>{choice}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="fuo-answer-progress">
                  {currentIndex + 1}/{questionItems.length}
                </div>

                <button type="button" className="btn btn-sm btn-info mt-2" onClick={checkTestResult}>
                  Kiem tra bai lam
                </button>

                {testResult ? (
                  <div className="fuo-test-result-box mt-2">
                    <div className="fuo-test-result-title">Ket qua</div>
                    <div className="fuo-test-result-row">Dung: {testResult.correct}</div>
                    <div className="fuo-test-result-row">Sai: {testResult.wrong}</div>
                    <div className="fuo-test-result-row">Chua chon: {testResult.unanswered}</div>
                    <div className="fuo-test-result-row">Tong cau da cham: {testResult.gradedTotal}</div>
                    {testResult.ungraded > 0 ? (
                      <div className="fuo-test-result-note">
                        Co {testResult.ungraded} cau chua co dap an ro rang nen khong cham.
                      </div>
                    ) : null}

                    <div className="fuo-test-question-grid">
                      {testResult.questionResults.map((item, index) => (
                        <button
                          key={item.questionNumber}
                          type="button"
                          className={`fuo-test-question-item ${item.isGraded ? (item.isCorrect ? 'is-correct' : 'is-wrong') : 'is-ungraded'} ${index === currentIndex ? 'is-active' : ''}`}
                          onClick={() => updateCurrentIndex(index)}
                        >
                          {item.questionNumber}
                        </button>
                      ))}
                    </div>

                    <div className="fuo-test-current-answer">
                      <div className="fuo-test-current-answer-title">
                        Dap an cau {String(questionItems[currentIndex].questionNumber).padStart(2, '0')}
                      </div>
                      <div className="fuo-test-current-answer-value">
                        {currentQuestionResult?.correctAnswer ?? 'Chua co dap an ro rang'}
                      </div>
                    </div>
                  </div>
                ) : null}
              </aside>
            ) : (
              <aside className="fuo-answer-panel">
                <div className="fuo-answer-label">Ma de</div>
                <h4 className="fuo-answer-code">{exam.code ?? exam.title}</h4>

                <div className="fuo-answer-box">
                  <div className="fuo-answer-question">Cau {String(questionItems[currentIndex].questionNumber).padStart(2, '0')}</div>
                  <div className="fuo-answer-value">{questionItems[currentIndex].answer ?? 'Chua co dap an ro rang'}</div>
                  {questionItems[currentIndex].answerNote ? (
                    <p className="fuo-answer-note mb-0">{questionItems[currentIndex].answerNote}</p>
                  ) : null}
                </div>

                <div className="fuo-answer-progress">
                  {currentIndex + 1}/{questionItems.length}
                </div>
              </aside>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
