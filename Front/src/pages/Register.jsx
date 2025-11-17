import Header from '../components/Header'
import Footer from '../components/Footer'
import { SignupForm } from '../components/signup-form'

const Register = () => {
    return (
        <div className="min-h-screen w-full  mx-auto flex flex-col justify-between overflow-x-hidden ">
            <Header />

            {/* Center content vertically but leave space for header/footer */}
            <main className="flex-1 flex items-center justify-center py-4">
                <div className="w-full max-w-[25rem]">
                    <SignupForm />
                </div>
            </main>

            <Footer />
        </div>
    )   
}

export default Register
