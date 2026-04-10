import { Link, useParams } from 'react-router-dom';
import { fuoExamDataBySubject } from '../data/fuoExamData';

export default function FUOExamTypeChoice() {
  const { ky, subject, examId } = useParams();
  const exams = fuoExamDataBySubject[subject] ?? [];
  const exam = exams.find((item) => item.id === examId);

  if (!exam) {
    return (
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="text-danger">Khong tim thay de</h3>
          <Link to={`/fuo/ky/${ky}/${subject}`} className="btn btn-outline-primary mt-2">
            Quay lai danh sach de
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm fuo-semester-card">
      <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center border-0">
        <h3 className="mb-0">{subject} - {exam.title}</h3>
        <Link to={`/fuo/ky/${ky}/${subject}`} className="btn btn-sm btn-light">
          Quay lai danh sach de
        </Link>
      </div>

      <div className="card-body">
        <p className="text-muted mb-4">Chon loai de can xem:</p>

        <div className="exam-type-grid">
          {['FE', 'PE'].map((variant) => {
            const hasVariant = exam.variants?.[variant];
            return (
              <Link
                key={variant}
                to={`/fuo/ky/${ky}/${subject}/${examId}/${variant}`}
                className={`exam-type-card ${hasVariant ? '' : 'exam-type-card-disabled'}`}
              >
                <span className="exam-type-label">{variant}</span>
                <span className="exam-type-hint">
                  {hasVariant ? 'Mo anh cau hoi' : 'Chua co du lieu'}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
