import {LoginForm} from '../components/login-form'
import Header from '../components/Header'
import Footer from '../components/Footer'

const Login = () => {
  return (
    <div className='login'>
      <Header />
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      <div className="w-full max-w-sm">
        <LoginForm />
        </div>
    </div>
         <Footer />
    </div> 
    )
}

export default Login