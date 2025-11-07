import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useLoading } from '../context/LoadingContext';
import RequestStatusCard, { RequestDetailModal } from '../components/RequestStatusCard';

interface AdoptionRequest {
    id: number;
    petName: string; 
    petImage: string; 
    rating: number;
    description: string;
    submitterName: string; 
    submitterAvatar: string; 
    date: string;
    status: 'en_espera' | 'aceptado' | 'rechazado' | 'pendiente' | 'completada';
}

const API_URL = 'http://ayunpet-api.eastus2.cloudapp.azure.com/v1';

const mockUserSentRequests: AdoptionRequest[] = [
    { 
        id: 9991,
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

const mockInstitutionReceivedRequests: AdoptionRequest[] = [
    {
        id: 9994,
        petName: 'Pipo', 
        petImage: 'https://www.purina.es/sites/default/files/styles/ttt_image_510/public/2024-02/sitesdefaultfilesstylessquare_medium_440x440public2022-09golden20retriever.jpg?itok=48StbVfe',
        rating: 5, 
        description: 'Usuario "Elvis Cochuelo" ha enviado una solicitud para adoptar a Pipo. La solicitud está pendiente de revisión.', 
        submitterName: 'Elvis Cochuelo', 
        submitterAvatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Carita_feliz.svg/768px-Carita_feliz.svg.png',
        date: '04-11-2025', 
        status: 'en_espera' as const
    },
    {
        id: 9992,
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
        id: 9993,
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
    const { isLoading, setLoading } = useLoading(); 

    const [requests, setRequests] = useState<AdoptionRequest[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<AdoptionRequest | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("authToken");

        const fetchRequests = async () => {
            if (!user || !token) { 
                return;
            }
            
            setLoading(true);

            const endpoint = `${API_URL}/adoptions/adoption-requests?page=1&pageSize=20`;

            try {
                const response = await fetch(endpoint, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, 
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Error al cargar las solicitudes');
                }

                const data = await response.json();

                const formattedRequests: AdoptionRequest[] = data.data.map((req: any) => {
                    let mainImage = 'https://via.placeholder.com/150';
                    if (req.postImages && typeof req.postImages === 'string') {
                           mainImage = req.postImages;
                    }
                    
                    return {
                        id: req.id,
                        status: req.status,
                        description: req.message,
                        date: new Date(req.created_at).toLocaleDateString(),
                        petName: `Post ID: ${req.post_id}`, 
                        petImage: mainImage, 
                        rating: 3,
                        submitterName: `User ID: ${req.user_id}`,
                        submitterAvatar: 'https://via.placeholder.com/50',
                    };
                });
                
                if (formattedRequests.length > 0) {
                    setRequests(formattedRequests);
                } else {
                    if (user.role === 'tester') {
                        setRequests([...mockUserSentRequests, ...mockInstitutionReceivedRequests]);
                    } else if (user.role === 'normal') {
                        setRequests(mockUserSentRequests);
                    } else {
                        setRequests(mockInstitutionReceivedRequests);
                    }
                }

            } catch (error) {
                if (!user) {
                     setRequests(mockInstitutionReceivedRequests);
                } else if (user.role === 'tester') {
                    setRequests([...mockUserSentRequests, ...mockInstitutionReceivedRequests]);
                } else if (user.role === 'normal') {
                    setRequests(mockUserSentRequests);
                } else {
                    setRequests(mockInstitutionReceivedRequests);
                }

            } finally {
                setLoading(false); 
            }
        };

        fetchRequests();

    }, [user]); 

    const handleOpenModal = (request: AdoptionRequest) => {
        setSelectedRequest(request);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedRequest(null);
        setIsModalOpen(false);
    };

    const handleApprove = async (requestId: number) => {
        setLoading(true); 
        const token = localStorage.getItem("authToken"); 
        
        try {
            const response = await fetch(`${API_URL}/adoptions/adoption-requests/${requestId}/confirm-accept`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al aprobar la solicitud');
            }

            const result = await response.json();
            alert(`¡Solicitud Pre-aprobada!\n\nCódigo de confirmación: ${result.data.confirmation_code}\n\nEntrega este código al adoptante.`);

            setRequests(prevRequests =>
                prevRequests.map(req =>
                    req.id === requestId ? { ...req, status: 'aceptado' } : req
                )
            );
            handleCloseModal();

        } catch (error: any) {
            console.error("Error al aprobar:", error);
            alert(`Error: ${error.message}`);
        } finally {
            setLoading(false); 
        }
    };

    const handleReject = (requestId: number) => {
        handleCloseModal();
    };


    if (isLoading && requests.length === 0) {
        return (
            <div className="page-container">
                <Header />
                <main className="requests-page-container"><h1>Cargando solicitudes...</h1></main>
                <Footer />
            </div>
        );
    }
    
    const currentUserRole = user ? user.role : 'institution'; 
    
    let pageTitle;
    const isInstitutionView = currentUserRole === 'institution' || currentUserRole === 'tester';
    
    if (currentUserRole === 'tester') {
        pageTitle = 'Vista de Tester: Todas las Solicitudes';
    } else if (currentUserRole === 'normal') {
        pageTitle = 'Mis Solicitudes Enviadas';
    } else { 
        pageTitle = 'Ver Solicitudes'; 
    }

    return (
        <div className="page-container">
            <Header />
            <main className="requests-page-container">
                <h1 className="text-4xl font-bold text-[#6D3B07] [text-shadow:1px_1px_2px_#FBDBA8]" style={{ fontFamily: 'monospace' }}>
                    {pageTitle}
                </h1>
                <div>
                    {requests.length > 0 ? (
                        requests.map((request) => (
                            <RequestStatusCard
                                key={request.id}
                                {...request} 
                                onInfoClick={() => handleOpenModal(request)}
                            />
                        ))
                    ) : (
                        <p className='text-white text-center mt-8'>No hay solicitudes para mostrar.</p>
                    )}
                </div>
            </main>
            <Footer />

            {isModalOpen && selectedRequest && (
                <RequestDetailModal
                    {...selectedRequest}
                    onClose={handleCloseModal}
                    onApprove={() => handleApprove(selectedRequest.id)}
                    onReject={() => handleReject(selectedRequest.id)}
                    isInstitution={isInstitutionView}
                />
            )}
        </div>
    );
}