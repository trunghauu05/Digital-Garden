import { Link, useParams } from 'react-router-dom';
import { fuoSubjectsBySemester } from '../data/fuoSubjects';

export default function FUOSubjectExams() {
  const { ky, subject } = useParams();
  const kyNumber = Number(ky);
  const subjects = fuoSubjectsBySemester[kyNumber] ?? [];

  if (!subjects.includes(subject)) {
    return (
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="text-danger">Khong tim thay mon hoc</h3>
          <Link to={`/fuo/ky/${kyNumber}`} className="btn btn-outline-primary mt-2">
            Quay lai Ky {kyNumber}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm fuo-semester-card">
      <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center border-0">
        <h3 className="mb-0">{subject} - Ky {kyNumber}</h3>
        <Link to={`/fuo/ky/${kyNumber}`} className="btn btn-sm btn-light">
          Quay lai danh sach mon
        </Link>
      </div>

      <div className="card-body">
        <p className="text-muted mb-4">Chon loai de can xem:</p>

        <div className="exam-type-grid">
          {['FE', 'PE'].map((variant) => (
            <Link
              key={variant}
              to={`/fuo/ky/${kyNumber}/${subject}/${variant}`}
              className="exam-type-card"
            >
              <span className="exam-type-label">{variant}</span>
              <span className="exam-type-hint">Mo kho de {variant}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
