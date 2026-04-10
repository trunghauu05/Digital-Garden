import { Link, useParams, useSearchParams } from 'react-router-dom';
import { fuoSubjectsBySemester } from '../data/fuoSubjects';
import { fuoExamDataBySubject } from '../data/fuoExamData';

const PAGE_SIZE = 15;

export default function FUOSubjectVariantExams() {
  const { ky, subject, variant } = useParams();
  const [searchParams] = useSearchParams();
  const kyNumber = Number(ky);
  const subjects = fuoSubjectsBySemester[kyNumber] ?? [];
  const exams = fuoExamDataBySubject[subject]?.[variant] ?? [];

  const currentPage = Math.max(1, Number(searchParams.get('page') || '1'));
  const totalPages = Math.max(1, Math.ceil(exams.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const paginatedExams = exams.slice(startIndex, startIndex + PAGE_SIZE);


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

  if (!['FE', 'PE'].includes(variant)) {
    return (
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="text-danger">Khong tim thay loai de</h3>
          <Link to={`/fuo/ky/${kyNumber}/${subject}`} className="btn btn-outline-primary mt-2">
            Quay lai chon FE/PE
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm fuo-semester-card">
      <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center border-0">
        <h3 className="mb-0">{subject} - {variant}</h3>
        <Link to={`/fuo/ky/${kyNumber}/${subject}`} className="btn btn-sm btn-light">
          Quay lai chon FE/PE
        </Link>
      </div>

      <div className="card-body">
        {exams.length === 0 ? (
          <div className="alert alert-info mb-0">
            Chua co danh sach de cho mon nay. Ban co the them de vao fuoExamData.js sau.
          </div>
        ) : (
          <>
            <div className="subject-exam-list">
              {paginatedExams.map((exam) => (
                <Link
                  key={exam.id}
                  to={`/fuo/ky/${kyNumber}/${subject}/${variant}/${exam.id}`}
                  className="subject-exam-link"
                >
                  {exam.title}
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="fuo-pagination mt-4">
                <Link
                  className={`fuo-page-link ${safePage === 1 ? 'disabled' : ''}`}
                  to={`/fuo/ky/${kyNumber}/${subject}/${variant}?page=${Math.max(1, safePage - 1)}`}
                  aria-disabled={safePage === 1}
                >
                  ‹ Truoc
                </Link>

                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <Link
                      key={pageNumber}
                      to={`/fuo/ky/${kyNumber}/${subject}/${variant}?page=${pageNumber}`}
                      className={`fuo-page-link ${pageNumber === safePage ? 'active' : ''}`}
                    >
                      {pageNumber}
                    </Link>
                  );
                })}

                <Link
                  className={`fuo-page-link ${safePage === totalPages ? 'disabled' : ''}`}
                  to={`/fuo/ky/${kyNumber}/${subject}/${variant}?page=${Math.min(totalPages, safePage + 1)}`}
                  aria-disabled={safePage === totalPages}
                >
                  Sau ›
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
