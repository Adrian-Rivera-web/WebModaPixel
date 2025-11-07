import "../assets/css/styles.css";

export default function Nosotros() {
  return (
    <main className="nosotros-container">
      <section className="nosotros-info">
        <h2>Sobre Nosotros</h2>
        <p>
          <strong>ModaPixel</strong> nació con la idea de ofrecer ropa moderna y
          accesible para todos. Nuestro compromiso es brindar productos de calidad
          con diseños únicos, pensados para quienes buscan estilo y comodidad.
        </p>

        <p>
          Trabajamos con marcas locales y materiales sustentables, cuidando cada
          detalle en la confección. Creemos en la moda responsable, la inclusión y
          el respeto por el medio ambiente 🌱.
        </p>

        <h3>Nuestra Misión</h3>
        <p>
          Inspirar confianza y estilo a nuestros clientes, entregando productos de
          calidad que reflejen su personalidad.
        </p>

        <h3>Visión</h3>
        <p>
          Ser una tienda líder en innovación y moda digital en Chile, promoviendo el
          comercio justo y el desarrollo local.
        </p>
      </section>

      <section className="nosotros-imagen">
        <img
          src="/src/assets/img/zapatillas.jpg"
          alt="Nuestro equipo ModaPixel"
          className="imagen-nosotros"
        />
      </section>
    </main>
  );
}
