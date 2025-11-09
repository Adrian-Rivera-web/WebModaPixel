import "../assets/css/styles.css";

export default function Nosotros() {
  return (
    <main className="nosotros-container">
      <section className="nosotros-info">
        <h2 className="titulo-nosotros"> Sobre Nosotros</h2>

        <p>
          En <strong>ModaPixel</strong> creemos que la moda debe ser moderna, inclusiva y sostenible. 
          Desde nuestros inicios, buscamos ofrecer ropa accesible con diseños únicos, 
          pensados para quienes valoran el estilo y la comodidad sin comprometer el medio ambiente .
        </p>

        <p>
          Trabajamos con <strong>marcas locales</strong> y materiales ecológicos, apoyando el comercio justo 
          y la producción responsable. Cada prenda que ofrecemos está diseñada con pasión, creatividad 
          y un toque de innovación digital .
        </p>

        <h3 className="subtitulo-nosotros">Nuestra Misión</h3>
        <p>
          Inspirar confianza y estilo a nuestros clientes, ofreciendo productos de calidad 
          que reflejen su personalidad y promuevan una moda más consciente.
        </p>

        <h3 className="subtitulo-nosotros">Nuestra Visión</h3>
        <p>
          Ser una tienda líder en moda digital y sostenible en Chile, 
          impulsando la creatividad, la inclusión y el desarrollo de nuevas tendencias.
        </p>

        <h3 className="subtitulo-nosotros">Valores</h3>
        <ul className="valores-lista">
          <li> Sostenibilidad y respeto ambiental</li>
          <li> Compromiso con la comunidad local</li>
          <li> Innovación y diseño digital</li>
          <li> Pasión por la moda y el bienestar</li>
        </ul>
      </section>

      <section className="nosotros-imagen">
        <img
          src="/src/assets/img/nosotros.jpg"
          alt="Equipo de ModaPixel trabajando en nuevos diseños"
          className="imagen-nosotros"
        />
      </section>
    </main>
  );
}
