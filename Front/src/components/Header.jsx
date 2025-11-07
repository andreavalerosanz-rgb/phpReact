import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '../hooks/useTranslation'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t, currentLanguage, changeLanguage, getAvailableLanguages, updateCount } = useTranslation()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLanguageChange = (e) => {
    changeLanguage(e.target.value);
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary" to="/">
          {t('common.brand')}
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={toggleMenu}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/">{t('common.home')}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/servicios">{t('common.services')}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/precios">{t('common.prices')}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/contacto">{t('common.contact')}</Link>
            </li>
          </ul>
          
          <div className="d-flex gap-2 align-items-center">
            {/* Selector de idioma */}
            <select 
              className="form-select form-select-sm me-2" 
              style={{ width: 'auto' }}
              value={currentLanguage}
              onChange={handleLanguageChange}
            >
              {getAvailableLanguages().map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
            
            <Link 
              to="/login" 
              className="btn btn-outline-primary"
            >
              {t('common.login')}
            </Link>
            <Link 
              to="/registro" 
              className="btn btn-primary"
            >
              {t('common.register')}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Header