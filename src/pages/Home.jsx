export default function Home() {
  return (
    <section className="home-hero mb-4 bg-light rounded-3 shadow-sm p-4 p-md-5">
      <div className="container-fluid py-2 py-md-4">
        <h1 className="home-title fw-bold mb-3">🏠 Trang Chu</h1>
        <p className="home-lead mb-4">
          Chao mung den voi he thong luu tru tai lieu hoc tap. Giao dien da duoc toi uu de de dung tren man hinh dien thoai.
        </p>
        <div className="d-grid d-sm-inline-block">
          <button className="btn btn-primary btn-lg" type="button">Kham pha ngay</button>
        </div>
      </div>
    </section>
  );
}