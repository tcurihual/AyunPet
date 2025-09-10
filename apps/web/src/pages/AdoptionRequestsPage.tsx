import Header from '../components/Header';
import Footer from '../components/Footer';
import RequestStatusCard from '../components/RequestStatusCard';
import { useAuth } from '../context/AuthContext';
import { useLoading } from '../context/LoadingContext';

const mockUserSentRequests = [
    { 
        petName: 'Firulais', 
        petImage: '/images/pets/firulais.jpg', 
        rating: 4, 
        description: 'Solicitaste la adopción de Firulais, un perrito noble y valiente. La fundación está revisando tu caso.', 
        submitterName: 'Fundacion tilin', 
        submitterAvatar: '/images/avatars/tilin.jpg', 
        date: '26-08-2025', 
        status: 'en_espera' as const 
    },
];

const mockInstitutionReceivedRequests = [
    {
        petName: 'Simba', 
        petImage: '/images/pets/simba.jpg', 
        rating: 5, 
        description: 'Simba ha recibido una solicitud de "El Pepe". La solicitud fue aprobada exitosamente.', 
        submitterName: 'El Pepe', 
        submitterAvatar: '/images/avatars/el-pepe.jpg', 
        date: '12-07-2025', 
        status: 'aceptado' as const 
    },
    { 
        petName: 'Miguel', 
        petImage: '/images/pets/Miguel.webp', 
        rating: 3, 
        description: 'Pana Miguel recibió una solicitud de "Miguel Fernández", la cual fue rechazada por no cumplir los requisitos.',
        submitterName: 'Miguel Fernández',
        submitterAvatar: '/images/avatars/miguel.jpeg', 
        date: '03-09-2025', 
        status: 'rechazado' as const 
    },
];

export default function AdoptionRequestsPage() {
    const { user } = useAuth();
    const { isLoading } = useLoading();

    if (isLoading || !user) {
        return (
            <div className="page-container">
                <Header />
                <main className="requests-page-container">
                    <h1>Cargando solicitudes...</h1>
                </main>
                <Footer />
            </div>
        );
    }
    
    const requestsToShow = user.role === 'normal' ? mockUserSentRequests : mockInstitutionReceivedRequests;
    const pageTitle = user.role === 'normal' ? 'Mis Solicitudes Enviadas' : 'Solicitudes Recibidas';

    return (
        <div className="page-container">
            <Header />
            <main className="requests-page-container">
                <h1 className="text-4xl font-bold text-[#6D3B07] [text-shadow:1px_1px_2px_#FBDBA8]" style={{ fontFamily: 'monospace' }}>
                    {pageTitle}
                </h1>
                <div>
                    {requestsToShow.map((request) => (
                        <RequestStatusCard key={request.petName} {...request} />
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}