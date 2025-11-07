import React from 'react'
import { useTranslation } from '../hooks/useTranslation'

const Hero = () => {
  const { t, updateCount } = useTranslation()
  
  const handleAction = (action) => {
    alert(`Acción: ${action}`);
  }

  return (
    <section className="hero-section text-ivory py-5 fade-in">
      <div className="container">
        <div className="row align-items-center min-vh-50">
          <div className="col-lg-6">
            <h1 className="display-4 fw-bold mb-4 text-shadow">
              {t('hero.title')} <br />
              <span className="text-warning">{t('hero.subtitle')}</span>
            </h1>
            <p className="lead mb-4 fs-5">
              {t('hero.description')}
            </p>
            <div className="d-flex gap-3 flex-wrap">
              <button 
                className="btn btn-warning btn-lg fw-bold px-4"
                onClick={() => handleAction('reservar')}
              >
                {t('hero.reserveNow')}
              </button>
              <button 
                className="btn btn-outline-light btn-lg px-4"
                onClick={() => handleAction('conocer-mas')}
              >
                {t('hero.learnMore')}
              </button>
            </div>
          </div>
          <div className="col-lg-6 text-center">
            <div className="p-4 fade-in">
              <img 
                src="/avion.png" 
                alt="Traslado al aeropuerto" 
                className="img-fluid rounded"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero