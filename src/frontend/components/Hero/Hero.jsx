import styles from './Hero.module.css';

import jethalalBanner from '../../assets/jethalalBanner.png';
import { Link } from 'react-router-dom';
import { useIsMobile } from '../../hooks';

const Hero = () => {
  const isMobile = useIsMobile();

  return (
    <section className='white-bcg'>
      <div className={`container ${styles.hero}`}>
        <article className={styles.content}>
          <h1>Experimenta la Electrónica Redefinida: Libera la Innovación</h1>

          <p>
            Descubre el Futuro de la Electrónica: Libera la Innovación, Sumérgete en 
            Calidad Sin Igual. Experimenta nuestra tecnología de vanguardia y 
            eleva tu día a día con Gada Electronics. Explora lo extraordinario hoy.
          </p>

          <Link to='/products' className={`btn ${styles.btnHero}`}>
            Comprar ahora
          </Link>
        </article>

        {!isMobile && (
          <article className={styles.imageContainer}>
            <img
              src={jethalalBanner}
              alt='jethalal'
              className={styles.banner}
            />
          </article>
        )}
      </div>
    </section>
  );
};

export default Hero;