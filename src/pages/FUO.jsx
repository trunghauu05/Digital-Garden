import { Link } from 'react-router-dom';

const fuoData = Array.from({ length: 9 }, (_, i) => ({
  ky: i + 1,
}));

export default function FUO() {
  return (
    <div className="card shadow-sm">
      <div className="card-header bg-dark text-white">
        <h3 className="mb-0">FUO - Ky 1 den Ky 9</h3>
      </div>

      <div className="card-body">
        <p className="text-muted mb-4">
          Bam vao tung ky de xem danh sach mon hoc. Ban co the cap nhat mon hoc sau.
        </p>

        <ul className="list-group list-group-flush">
          {fuoData.map((item) => (
            <li className="list-group-item px-0" key={item.ky}>
              <Link className="text-decoration-none fw-semibold" to={`/fuo/ky/${item.ky}`}>
                Ky {item.ky}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
