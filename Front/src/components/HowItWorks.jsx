import React from 'react'
import { useTranslation } from '../hooks/useTranslation'

const HowItWorks = () => {
  const { t, updateCount } = useTranslation()
  
  const steps = [
    {
      number: '1',
      title: t('howItWorks.step1'),
      description: t('howItWorks.step1Desc')
    },
    {
      number: '2',
      title: t('howItWorks.step2'),
      description: t('howItWorks.step2Desc')
    },
    {
      number: '3',
      title: t('howItWorks.step3'),
      description: t('howItWorks.step3Desc')
    },
    {
      number: '4',
      title: t('howItWorks.step4'),
      description: t('howItWorks.step4Desc')
    }
  ]

  return (
    <section className="py-5 bg-white">
      <div className="container">
        <div className="row text-center mb-5">
          <div className="col">
            <h2 className="display-5 fw-bold text-dark-slate-gray mb-3">{t('howItWorks.title')}</h2>
            <p className="lead text-dim-gray">{t('howItWorks.subtitle')}</p>
          </div>
        </div>
        
        <div className="row">
          {steps.map((step, index) => (
            <div key={index} className="col-md-6 col-lg-3 mb-4">
              <div className="text-center">
                <div className="step-circle">
                  {step.number}
                </div>
                <h5 className="fw-bold text-dark-slate-gray mb-2">{step.title}</h5>
                <p className="text-dim-gray">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks