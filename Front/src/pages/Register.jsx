import Header from '../components/Header'
import Footer from '../components/Footer'
import { SignupForm } from '../components/signup-form'

const Register = () => {
    return (
        <div>
            <Header />

            {/* Center content vertically but leave space for header/footer */}
            <main className="flex items-center justify-center py-4!">
                <SignupForm />
            </main>


            <Footer />
        </div>
    )
}

export default Register
