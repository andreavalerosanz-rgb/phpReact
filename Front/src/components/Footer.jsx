import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '../hooks/useTranslation'

const Footer = () => {
  const { t, updateCount } = useTranslation()

  return (
    <footer className="bg-dark-slate-gray text-ivory py-4">
      <div className="container">
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