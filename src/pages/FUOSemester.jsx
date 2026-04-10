import { Link, useParams } from 'react-router-dom';
import { fuoSubjectsBySemester } from '../data/fuoSubjects';

const semesterColors = {
  1: '#4fd1c5',
  2: '#ff6b6b',
  3: '#5cc8ff',
  4: '#f9c74f',
  5: '#63d471',
  6: '#d8e35f',
  7: '#7ab7ff',
  8: '#8e84ff',
  9: '#ff7f96',
};

export default function FUOSemester() {
  const { ky } = useParams();
  const kyNumber = Number(ky);
  const subjects = fuoSubjectsBySemester[kyNumber];

  if (!subjects) {
    return (
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="text-danger">Khong tim thay ky hoc</h3>
          <Link to="/fuo" className="btn btn-outline-primary mt-2">
            Quay lai FUO
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm fuo-semester-card">
      <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center border-0">
        <h3 className="mb-0">Ky {kyNumber}</h3>
        <Link to="/fuo" className="btn btn-sm btn-light">
          Ve trang FUO
        </Link>
      </div>

      <div className="card-body">
        <div className="d-flex align-items-start gap-3 flex-wrap">
          <div
            className="semester-badge"
            style={{ '--semester-badge-color': semesterColors[kyNumber] ?? '#4fd1c5' }}
          >
            {kyNumber}
          </div>

          <div className="flex-grow-1 semester-content">
            <h4 className="semester-title mb-3">Ky {kyNumber}</h4>

            {subjects.length === 0 ? (
              <div className="alert alert-info mb-0">
                Ban chua them mon hoc cho Ky {kyNumber}. Hay cap nhat mang du lieu sau.
              </div>
            ) : (
              <div className="subject-grid">
                {subjects.map((subject) => (
                  <Link
                    key={subject}
                    to={`/fuo/ky/${kyNumber}/${subject}`}
                    className="subject-item subject-link"
                  >
                    <span className="subject-icon">📁</span>
                    <span className="subject-code">{subject}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
