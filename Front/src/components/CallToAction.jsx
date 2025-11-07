import React from "react";
import { useTranslation } from '../hooks/useTranslation'

const CallToAction = () => {
  const { t, updateCount } = useTranslation()
  
  const handleAction = () => {
    alert("Redirigiendo al registro...");
  };

  return (
    <section className="py-5 bg-dark-slate-gray text-ivory">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-8">
            <h3 className="fw-bold mb-2">{t('cta.title')}</h3>
            <p className="mb-0 text-sage">
              {t('cta.description')}
            </p>
          </div>
          <div className="col-lg-4 text-lg">
            <button
              className="btn btn-warning btn-lg fw-bold px-4"
              onClick={handleAction}
            >
              {t('cta.button')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;