import Header from '../components/Header'
import Footer from '../components/Footer'
import { CalendarReservas } from '../components/CalendarReservas'

const Calendario = () => {
    return (
        <div className='calendario min-h-screen flex flex-col'>
            <Header />
            <div className="flex flex-1 items-center justify-center p-6 md:p-10 bg-gray-50">
                <div className="w-full max-w-7xl">
                    <CalendarReservas />
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Calendario