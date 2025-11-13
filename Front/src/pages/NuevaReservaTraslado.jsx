import Header from "../components/Header";
import Footer from "../components/Footer";
import FormularioTraslados from "../components/FormularioTraslados";

const NuevaReserva = () => {
    return (
        <>
            <Header />

            <div className="flex-grow container mt-43! mb-43!">
                <FormularioTraslados />
            </div>


            <Footer />
        </>
    );
};

export default NuevaReserva