import React from 'react'
import { useTranslation } from '../hooks/useTranslation'

const Features = () => {
  const { t, updateCount } = useTranslation()
  
  const features = [
    {
      icon: 'bi bi-alarm',
      title: t('features.punctuality'),
      description: t('features.punctualityDesc')
    },
    {
      icon: 'bi bi-currency-dollar',
      title: t('features.prices'),
      description: t('features.pricesDesc')
    },
    {
      icon: 'bi bi-car-front',
      title: t('features.vehicles'),
      description: t('features.vehiclesDesc')
    },
    {
      icon: 'bi bi-phone',
      title: t('features.booking'),
      description: t('features.bookingDesc')
    }
  ]

  return (
    <section className="py-5">
      <div className="container">
        <div className="row text-center mb-5">
          <div className="col">
            <h2 className="display-5 fw-bold text-dark-slate-gray mb-3">{t('features.title')}</h2>
            <p className="lead text-dim-gray">{t('features.subtitle')}</p>
          </div>
        </div>
        
        <div className="row g-4">
          {features.map((feature, index) => (
            <div key={index} className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 card-hover bg-ivory">
                <div className="card-body text-center p-4">
                  <div className="feature-icon mb-3" style={{ fontSize: '3rem' }}>
                    <i className={feature.icon}></i>
                  </div>
                  <h5 className="card-title fw-bold text-dark-slate-gray">{feature.title}</h5>
                  <p className="card-text text-dim-gray">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features