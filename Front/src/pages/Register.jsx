import Header from '../components/Header'
import Footer from '../components/Footer'
import { SignupForm } from '../components/signup-form'

const Register = () => {
    return (
        <div className='registro'>
            <Header />
            <div className="flex min-h-[80vh] w-full items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-sm">
            <SignupForm />
            </div>
            </div>
            <Footer />
        </div>

    )
}

export default Register