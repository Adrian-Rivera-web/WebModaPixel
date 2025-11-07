import "../assets/css/styles.css";

export default function Blogs() {
  const blogs = [
    {
      id: 1,
      titulo: "Tendencias 2025: Colores y estilos que dominarán el año",
      imagen: "/src/assets/img/blog1.jpg",
      descripcion:
        "Descubre los tonos pastel, las texturas suaves y la moda sustentable que marcarán la temporada 2025. ModaPixel te trae la guía definitiva.",
    },
    {
      id: 2,
      titulo: "5 consejos para combinar tu outfit diario",
      imagen: "/src/assets/img/blog2.jpg",
      descripcion:
        "Aprende a combinar prendas básicas para lograr un estilo único sin gastar de más. ¡La clave está en los accesorios!",
    },
    {
      id: 3,
      titulo: "Moda chilena: el auge de los diseñadores locales",
      imagen: "/src/assets/img/blog3.jpg",
      descripcion:
        "Cada vez más marcas chilenas apuestan por la innovación y el diseño ético. Conoce las nuevas propuestas que están marcando tendencia.",
    },
  ];

  return (
    <main className="blogs-container">
      <h2>Últimos Blogs y Noticias</h2>
      <section className="blogs-grid">
        {blogs.map((b) => (
          <article key={b.id} className="blog-card">
            <img src={b.imagen} alt={b.titulo} className="blog-img" />
            <h3>{b.titulo}</h3>
            <p>{b.descripcion}</p>
            <button className="btn-leer">Leer más</button>
          </article>
        ))}
      </section>
    </main>
  );
}
