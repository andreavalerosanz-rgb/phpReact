import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '../hooks/useTranslation'

const Footer = () => {
  const { t, updateCount } = useTranslation()

  return (
    <footer className="bg-dark-slate-gray text-ivory py-4">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3">
            <h5 className="fw-bold">{t('common.brand')}</h5>
            <p className="text-muted">
              {t('footer.description')}
            </p>
          </div>
          <div className="col-md-4 mb-3">
            <h6 className="fw-bold">{t('footer.quickLinks')}</h6>
            <ul className="list-unstyled">
              <li><Link to="/servicios" className="text-muted text-decoration-none">{t('common.services')}</Link></li>
              <li><Link to="/precios" className="text-muted text-decoration-none">{t('common.prices')}</Link></li>
              <li><Link to="/contacto" className="text-muted text-decoration-none">{t('common.contact')}</Link></li>
            </ul>
          </div>
          <div className="col-md-4 mb-3">
            <h6 className="fw-bold">{t('footer.contact')}</h6>
            <ul className="list-unstyled text-muted">
              <li>📞 +34 600 123 456</li>
              <li>✉️ info@islatransfers.com</li>
              <li>📍 Aeropuerto de la Isla</li>
            </ul>
          </div>
        </div>
        <hr className="my-3" />
        <div className="row">
          <div className="col text-center text-muted">
            <small dangerouslySetInnerHTML={{ __html: t('footer.rights') }} />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer