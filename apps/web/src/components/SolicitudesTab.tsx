import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://ayunpet-api.eastus2.cloudapp.azure.com/v1';

interface AdoptionRequest {
  id: number;
  user_id: number;
  post_id: number;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
  postImages?: string[];
  petImages?: string[];
  requester_name?: string;
  pet_name?: string;
  post_title?: string;
}

interface SolicitudesTabProps {
  institutionId: string;
}

const SolicitudesTab: React.FC<SolicitudesTabProps> = ({ institutionId }) => {
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<AdoptionRequest | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadRequests();
  }, [institutionId]);

  const loadRequests = async () => {
    const token = localStorage.getItem('authToken');
    
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔍 Cargando solicitudes para institución:', institutionId);
      
      // GET /v1/adoptions/adoption-requests (rol 21 = giver)
      const response = await fetch(`${API_BASE_URL}/adoptions/adoption-requests?page=1&pageSize=50`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al cargar solicitudes');
      }

      const result = await response.json();
      console.log('✅ Solicitudes cargadas:', result);
      
      // ✅ CORRECCIÓN: La API devuelve data.requests, no data directamente
      setRequests(result.data?.requests || []);
    } catch (err: any) {
      console.error('❌ Error al cargar solicitudes:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (requestId: number) => {
    if (!window.confirm('¿Estás seguro de aprobar esta solicitud? Se generará un código de confirmación.')) {
      return;
    }

    const token = localStorage.getItem('authToken');
    
    try {
      const response = await fetch(`${API_BASE_URL}/adoptions/adoption-requests/${requestId}/confirm-accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al aprobar');
      }

      const result = await response.json();
      
      alert(`✅ Solicitud aprobada!\n\n🔑 Código de confirmación: ${result.data.confirmation_code}\n\n⏰ Expira: ${new Date(result.data.expiresAt).toLocaleString()}\n\nEntrega este código al adoptante para completar la adopción.`);
      
      // Recargar solicitudes
      loadRequests();
      setShowModal(false);
    } catch (err: any) {
      console.error('❌ Error:', err);
      alert(`❌ Error: ${err.message}`);
    }
  };

  const handleReject = async (requestId: number) => {
    if (!window.confirm('¿Estás seguro de rechazar esta solicitud?')) {
      return;
    }

    const token = localStorage.getItem('authToken');
    
    try {
      const response = await fetch(`${API_BASE_URL}/adoptions/adoption-requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'rejected' })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al rechazar');
      }

      alert('✅ Solicitud rechazada');
      
      // Recargar solicitudes
      loadRequests();
      setShowModal(false);
    } catch (err: any) {
      console.error('❌ Error:', err);
      alert(`❌ Error: ${err.message}`);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string; label: string }> = {
      'pending': { bg: '#fef3c7', text: '#92400e', label: '⏳ Pendiente' },
      'approved': { bg: '#d1fae5', text: '#065f46', label: '✅ Aprobada' },
      'rejected': { bg: '#fee2e2', text: '#991b1b', label: '❌ Rechazada' },
      'completed': { bg: '#dbeafe', text: '#1e3a8a', label: '🎉 Completada' }
    };

    const statusInfo = statusMap[status] || statusMap['pending'];
    
    return (
      <span style={{
        padding: '0.375rem 0.75rem',
        backgroundColor: statusInfo.bg,
        color: statusInfo.text,
        borderRadius: '12px',
        fontSize: '0.875rem',
        fontWeight: '600'
      }}>
        {statusInfo.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🐾</div>
        <p style={{ color: '#666' }}>Cargando solicitudes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '2rem',
        backgroundColor: '#fee2e2',
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
        <h4 style={{ color: '#991b1b', marginBottom: '0.5rem' }}>Error al cargar solicitudes</h4>
        <p style={{ color: '#dc2626', margin: 0 }}>{error}</p>
        <button
          onClick={loadRequests}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div style={{
        padding: '3rem 2rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '16px',
        textAlign: 'center',
        border: '2px dashed #dee2e6'
      }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📋</div>
        <h4 style={{ color: '#495057', marginBottom: '0.5rem' }}>Sin solicitudes pendientes</h4>
        <p style={{ fontSize: '1rem', color: '#868e96', margin: 0 }}>
          Aquí aparecerán las solicitudes de adopción cuando lleguen
        </p>
      </div>
    );
  }

  return (
    <>
      <h3 style={{ marginBottom: '1.5rem', color: '#1f2937' }}>
        Solicitudes de Adopción ({requests.length})
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {requests.map((request) => (
          <div
            key={request.id}
            style={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '1.25rem',
              display: 'flex',
              gap: '1rem',
              alignItems: 'flex-start',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onClick={() => {
              setSelectedRequest(request);
              setShowModal(true);
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* Imagen */}
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: '#f3f4f6',
              flexShrink: 0
            }}>
              {request.postImages && request.postImages.length > 0 ? (
                <img
                  src={request.postImages[0]}
                  alt="Mascota"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.parentElement) {
                      e.currentTarget.parentElement.innerHTML = '<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 2rem;">🐾</div>';
                    }
                  }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem'
                }}>
                  🐾
                </div>
              )}
            </div>

            {/* Contenido */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h4 style={{ margin: 0, color: '#1f2937', fontSize: '1.05rem' }}>
                  Solicitud #{request.id} - Post #{request.post_id}
                </h4>
                {getStatusBadge(request.status)}
              </div>

              <p style={{
                margin: '0.5rem 0',
                color: '#6b7280',
                fontSize: '0.9rem',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {request.message || 'Sin mensaje'}
              </p>

              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: '#9ca3af', marginTop: '0.75rem' }}>
                <span>👤 Usuario #{request.user_id}</span>
                <span>📅 {formatDate(request.created_at)}</span>
              </div>
            </div>

            {/* Botones de acción */}
            {request.status === 'pending' && (
              <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApprove(request.id);
                  }}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  ✅ Aprobar
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReject(request.id);
                  }}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  ❌ Rechazar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal de detalles */}
      {showModal && selectedRequest && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              padding: '2rem'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>
              Detalles de Solicitud #{selectedRequest.id}
            </h2>

            <div style={{ marginBottom: '1.5rem' }}>
              <strong>Estado:</strong> {getStatusBadge(selectedRequest.status)}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <strong>Post ID:</strong> {selectedRequest.post_id}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <strong>Usuario ID:</strong> {selectedRequest.user_id}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <strong>Fecha:</strong> {formatDate(selectedRequest.created_at)}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <strong>Mensaje del solicitante:</strong>
              <p style={{ 
                marginTop: '0.5rem', 
                padding: '1rem', 
                backgroundColor: '#f9fafb', 
                borderRadius: '8px',
                lineHeight: '1.6'
              }}>
                {selectedRequest.message || 'Sin mensaje'}
              </p>
            </div>

            {selectedRequest.status === 'pending' && (
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button
                  onClick={() => handleApprove(selectedRequest.id)}
                  style={{
                    flex: 1,
                    padding: '0.875rem',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  ✅ Aprobar Solicitud
                </button>
                <button
                  onClick={() => handleReject(selectedRequest.id)}
                  style={{
                    flex: 1,
                    padding: '0.875rem',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  ❌ Rechazar
                </button>
              </div>
            )}

            <button
              onClick={() => setShowModal(false)}
              style={{
                width: '100%',
                padding: '0.875rem',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                marginTop: '1rem'
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SolicitudesTab;
