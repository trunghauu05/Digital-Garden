import { Link } from 'react-router-dom';

export default function Notes() {
  return (
    <div className="card shadow-sm">
      <div className="card-header bg-primary text-white">
        <h3 className="mb-0">📚 Danh mục tài liệu</h3>
      </div>
      <div className="card-body">
        <p className="card-text mb-4">Chọn một bài học dưới đây để bắt đầu ôn tập nhé:</p>


        <ul className="list-group">
          <li className="list-group-item d-flex justify-content-between align-items-center p-3">
            <div>
              <h5 className="mb-1 text-primary">Bài 1: Giới thiệu về React</h5>
              <small className="text-muted">Khái niệm cốt lõi: Component, JSX, State...</small>
            </div>
            {/* Nút bấm chuyển sang trang Bài 1 */}
            <Link to="/note/bai-1" className="btn btn-outline-primary">Đọc bài</Link>
          </li>

          <li className="list-group-item d-flex justify-content-between align-items-center p-3">
            <div>
              <h5 className="mb-1 text-primary">Bài 2: React State và Effect</h5>
              <small className="text-muted">Làm cho web trở nên thông minh.</small>
            </div>
            <Link to="/note/bai-2" className="btn btn-outline-primary">Đọc bài 2</Link>
          </li>

        </ul>
      </div>
    </div>
  );
}