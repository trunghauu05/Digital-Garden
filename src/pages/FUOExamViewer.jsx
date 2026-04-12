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

const IMAGE_ZOOM_LEVELS = [1, 1.6, 2.4];

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
  const [isPseudoFullscreen, setIsPseudoFullscreen] = useState(false);
  const [isTestMode, setIsTestMode] = useState(false);
  const [testSelections, setTestSelections] = useState({});
  const [testResult, setTestResult] = useState(null);
  const [isImageDragging, setIsImageDragging] = useState(false);
  const [imageZoomState, setImageZoomState] = useState({
    imageKey: null,
    step: 0,
    origin: { x: 50, y: 50 },
    offset: { x: 0, y: 0 },
  });
  const imagePanelRef = useRef(null);
  const dragStateRef = useRef({
    active: false,
    imageKey: null,
    startX: 0,
    startY: 0,
    baseOffsetX: 0,
    baseOffsetY: 0,
    touchIdentifier: null,
    moved: false,
  });

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

      if (event.key === 'Escape' && isPseudoFullscreen) {
        setIsPseudoFullscreen(false);
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
  }, [isPseudoFullscreen, questionItems.length, updateCurrentIndex]);

  useEffect(() => {
    const onFullscreenChange = () => {
      const fullscreenElement = document.fullscreenElement ?? document.webkitFullscreenElement;
      setIsFullscreen(fullscreenElement === imagePanelRef.current);
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (!isPseudoFullscreen) {
      return undefined;
    }

    document.body.classList.add('fuo-pseudo-fullscreen-active');

    return () => {
      document.body.classList.remove('fuo-pseudo-fullscreen-active');
    };
  }, [isPseudoFullscreen]);

  const toggleFullscreen = async () => {
    const panel = imagePanelRef.current;

    if (!panel) {
      return;
    }

    if (isPseudoFullscreen) {
      setIsPseudoFullscreen(false);
      return;
    }

    const fullscreenElement = document.fullscreenElement ?? document.webkitFullscreenElement;
    const requestFullscreen = panel.requestFullscreen?.bind(panel)
      ?? panel.webkitRequestFullscreen?.bind(panel);
    const exitFullscreen = document.exitFullscreen?.bind(document)
      ?? document.webkitExitFullscreen?.bind(document);

    if (!requestFullscreen || !exitFullscreen) {
      setIsPseudoFullscreen(true);
      return;
    }

    try {
      if (fullscreenElement === panel) {
        await exitFullscreen();
      } else {
        await requestFullscreen();
      }
    } catch {
      setIsPseudoFullscreen(true);
    }
  };

  const currentQuestionNumber = questionItems[currentIndex]?.questionNumber;
  const selectedChoices = testSelections[currentQuestionNumber] ?? [];
  const currentQuestionResult = testResult?.questionResults?.[currentIndex] ?? null;
  const currentImageKey = `${examId}-${currentIndex}`;
  const currentImageZoomStep = imageZoomState.imageKey === currentImageKey ? imageZoomState.step : 0;
  const currentZoomOrigin = imageZoomState.imageKey === currentImageKey
    ? imageZoomState.origin
    : { x: 50, y: 50 };
  const currentImageOffset = imageZoomState.imageKey === currentImageKey
    ? imageZoomState.offset
    : { x: 0, y: 0 };
  const currentImageZoom = IMAGE_ZOOM_LEVELS[currentImageZoomStep];
  const isViewerFullscreen = isFullscreen || isPseudoFullscreen;

  useEffect(() => {
    if (!isImageDragging) {
      return undefined;
    }

    const updateOffsetFromPoint = (clientX, clientY) => {
      const dragState = dragStateRef.current;

      if (!dragState.active || dragState.imageKey !== currentImageKey) {
        return;
      }

      const deltaX = clientX - dragState.startX;
      const deltaY = clientY - dragState.startY;

      if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
        dragStateRef.current.moved = true;
      }

      setImageZoomState((prev) => {
        if (prev.imageKey !== currentImageKey) {
          return prev;
        }

        return {
          ...prev,
          offset: {
            x: dragState.baseOffsetX + deltaX,
            y: dragState.baseOffsetY + deltaY,
          },
        };
      });
    };

    const handleMouseMove = (event) => {
      updateOffsetFromPoint(event.clientX, event.clientY);
    };

    const handleTouchMove = (event) => {
      const dragState = dragStateRef.current;
      const activeTouch = Array.from(event.touches).find((touch) => touch.identifier === dragState.touchIdentifier);

      if (!activeTouch) {
        return;
      }

      event.preventDefault();
      updateOffsetFromPoint(activeTouch.clientX, activeTouch.clientY);
    };

    const stopDragging = () => {
      dragStateRef.current.active = false;
      dragStateRef.current.touchIdentifier = null;
      setIsImageDragging(false);
    };

    const handleMouseUp = () => {
      stopDragging();
    };

    const handleTouchEnd = () => {
      stopDragging();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [isImageDragging, currentImageKey]);

  const handleImageClick = (event) => {
    if (dragStateRef.current.moved) {
      dragStateRef.current.moved = false;
      return;
    }

    const imageRect = event.currentTarget.getBoundingClientRect();
    const nextZoomStep = (currentImageZoomStep + 1) % IMAGE_ZOOM_LEVELS.length;
    let nextOrigin = { x: 50, y: 50 };

    if (imageRect.width > 0 && imageRect.height > 0) {
      const x = Math.min(100, Math.max(0, ((event.clientX - imageRect.left) / imageRect.width) * 100));
      const y = Math.min(100, Math.max(0, ((event.clientY - imageRect.top) / imageRect.height) * 100));
      nextOrigin = { x, y };
    }

    setImageZoomState({
      imageKey: currentImageKey,
      step: nextZoomStep,
      origin: nextOrigin,
      offset: { x: 0, y: 0 },
    });
  };

  const handleImageMouseDown = (event) => {
    if (currentImageZoomStep === 0 || event.button !== 0) {
      return;
    }

    event.preventDefault();
    dragStateRef.current = {
      active: true,
      imageKey: currentImageKey,
      startX: event.clientX,
      startY: event.clientY,
      baseOffsetX: currentImageOffset.x,
      baseOffsetY: currentImageOffset.y,
      touchIdentifier: null,
      moved: false,
    };
    setIsImageDragging(true);
  };

  const handleImageTouchStart = (event) => {
    if (currentImageZoomStep === 0 || event.touches.length !== 1) {
      return;
    }

    const touch = event.touches[0];
    event.preventDefault();
    dragStateRef.current = {
      active: true,
      imageKey: currentImageKey,
      startX: touch.clientX,
      startY: touch.clientY,
      baseOffsetX: currentImageOffset.x,
      baseOffsetY: currentImageOffset.y,
      touchIdentifier: touch.identifier,
      moved: false,
    };
    setIsImageDragging(true);
  };

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
            <div className={`fuo-question-image-panel ${isPseudoFullscreen ? 'is-pseudo-fullscreen' : ''}`} ref={imagePanelRef}>
              <div className="fuo-image-tools">
                <button
                  type="button"
                  className="fuo-fullscreen-button"
                  onClick={toggleFullscreen}
                  aria-label={isViewerFullscreen ? 'Thoat toan man hinh' : 'Phong to toan man hinh'}
                >
                  {isViewerFullscreen ? 'Thoat full' : 'Full man hinh'}
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
                className={`fuo-question-image ${currentImageZoomStep > 0 ? 'is-zoomed' : ''}`}
                style={{
                  transform: `translate(${currentImageOffset.x}px, ${currentImageOffset.y}px) scale(${currentImageZoom})`,
                  transformOrigin: `${currentZoomOrigin.x}% ${currentZoomOrigin.y}%`,
                  transition: isImageDragging ? 'none' : undefined,
                }}
                onClick={handleImageClick}
                onMouseDown={handleImageMouseDown}
                onTouchStart={handleImageTouchStart}
                onDragStart={(event) => event.preventDefault()}
                draggable={false}
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
