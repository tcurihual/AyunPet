import Header from '../components/Header';
import Footer from '../components/Footer';
import RequestStatusCard from '../components/RequestStatusCard';

const mockRequests = [
    { 
        petName: 'Firulais', 
        petImage: '/images/pets/firulais.jpg', 
        rating: 4, 
        description: 'Firulais es un perrito noble y valiente que lleva más de 7 meses viviendo abandonado en el río Cautín. A pesar de todo, no ha perdido su dulzura ni la esperanza de encontrar un hogar. Fue esterilizado, es obediente, sociable con las personas y tiene un carácter muy dócil.', 
        submitterName: 'Fundacion tilin', 
        submitterAvatar: '/images/avatars/tilin.jpg', 
        date: '26-08-2025', 
        status: 'en_espera' as const 
},
    {
        petName: 'Simba', 
        petImage: '/images/pets/simba.jpg', 
        rating: 5, 
        description: 'Simba es un sociable y amador gatito de solo 10 meses de edad. Es muy curioso y juguetón, ama a las personas. Si deseas adoptar solicita y llena el formulario de pre adopción.', 
        submitterName: 'El Pepe', 
        submitterAvatar: '/images/avatars/el-pepe.jpg', 
        date: '12-07-2025', 
        status: 'aceptado' as const 
},
    { 
        petName: 'Miguel', 
        petImage: '/images/pets/Miguel.webp', 
        rating: 3, 
        description: 'Pana Miguel es un gatito encantador de apenas 10 meses. Tiene una personalidad dulce y sociable, siempre buscando compañía y mimos. Es curioso, juguetón y muy cariñoso, le encanta compartir tiempo con las personas.',
        submitterName: 'Miguel Fernández', 
        submitterAvatar: '/images/avatars/miguel.jpeg', 
        date: '03-09-2025', 
        status: 'rechazado' as const 
},
];

export default function AdoptionRequestsPage() {
    return (
        <div className="page-container">
            <Header />
            <main className="requests-page-container">
                <h1 className="text-4xl font-bold text-[#6D3B07] [text-shadow:1px_1px_2px_#FBDBA8]" style={{ fontFamily: 'monospace' }}>
                    Solicitudes Adopcion
                    </h1>
                <div>
                    {mockRequests.map((request) => (
                        <RequestStatusCard key={request.petName} {...request} />
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}