import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  createAdoptionRequest,
  getAdoptionRequests,
  getMyAdoptionRequests,
  getAdoptionRequestById,
  confirmAcceptAdoptionRequest,
  validateAdoptionCode,
  CreateAdoptionRequestInput,
  ConfirmAcceptInput,
  ValidateCodeInput,
} from '../lib/adoptionRequestsService';
import Header from '../components/Header';
import Footer from '../components/Footer';

const TestAdoptionRequestAPI: React.FC = () => {
  const { token, user } = useAuth();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [postId, setPostId] = useState<number>(1);
  const [message, setMessage] = useState('Me gustaría adoptar esta mascota porque tengo experiencia.');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [requestId, setRequestId] = useState<number>(1);
  const [acceptId, setAcceptId] = useState<number>(1);
  const [notes, setNotes] = useState('Perfecto, puedes venir mañana.');
  const [code, setCode] = useState('');

  const handleTest = async (testName: string, testFn: () => Promise<any>) => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await testFn();
      setResult({ testName, ...res });
      console.log(`${testName} result:`, res);
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
      console.error(`${testName} error:`, err);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <Header />
        <h2>Debes iniciar sesión para probar la API</h2>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Test API Solicitudes Adopción</h1>

        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
          <p><strong>Usuario:</strong> {user?.name || user?.email}</p>
          <p><strong>Rol:</strong> {user?.role}</p>
          <p><strong>Token:</strong> {token.substring(0, 20)}...</p>
        </div>

        {/* Test 1 */}
        <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h2>Test 1: Crear Solicitud</h2>
          <div style={{ marginBottom: '15px' }}>
            <label>
              <strong>Post ID:</strong>
              <input type="number" value={postId} onChange={(e) => setPostId(Number(e.target.value))} style={{ marginLeft: '10px', padding: '5px', width: '100px' }} />
            </label>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>
              <strong>Mensaje:</strong>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} style={{ marginLeft: '10px', padding: '5px', width: '100%', maxWidth: '600px' }} />
            </label>
          </div>
          <button onClick={() => handleTest('CREATE', async () => {
            const input: CreateAdoptionRequestInput = { post_id: postId, message };
            return await createAdoptionRequest(token, input);
          })} disabled={loading} style={{ padding: '10px 20px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '5px', cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Probando...' : 'Probar Crear'}
          </button>
        </div>

        {/* Test 2 */}
        <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h2>Test 2: Listar Solicitudes</h2>
          <div style={{ marginBottom: '15px' }}>
            <label>
              <strong>Página:</strong>
              <input type="number" value={page} onChange={(e) => setPage(Number(e.target.value))} min={1} style={{ marginLeft: '10px', padding: '5px', width: '80px' }} />
            </label>
            <label style={{ marginLeft: '20px' }}>
              <strong>Tamaño:</strong>
              <input type="number" value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} min={1} max={100} style={{ marginLeft: '10px', padding: '5px', width: '80px' }} />
            </label>
          </div>
          <button onClick={() => handleTest('LIST', async () => await getAdoptionRequests(token, page, pageSize))} disabled={loading} style={{ padding: '10px 20px', backgroundColor: '#2196f3', color: 'white', border: 'none', borderRadius: '5px', cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Probando...' : 'Probar Listar'}
          </button>
        </div>

        {/* Test 3 */}
        <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h2>Test 3: Mis Solicitudes</h2>
          <button onClick={() => handleTest('MY_REQUESTS', async () => await getMyAdoptionRequests(token))} disabled={loading} style={{ padding: '10px 20px', backgroundColor: '#ff9800', color: 'white', border: 'none', borderRadius: '5px', cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Probando...' : 'Probar Mis Solicitudes'}
          </button>
        </div>

        {/* Test 4 */}
        <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h2>Test 4: Solicitud por ID</h2>
          <div style={{ marginBottom: '15px' }}>
            <label>
              <strong>ID:</strong>
              <input type="number" value={requestId} onChange={(e) => setRequestId(Number(e.target.value))} min={1} style={{ marginLeft: '10px', padding: '5px', width: '100px' }} />
            </label>
          </div>
          <button onClick={() => handleTest('GET_BY_ID', async () => await getAdoptionRequestById(token, requestId))} disabled={loading} style={{ padding: '10px 20px', backgroundColor: '#9c27b0', color: 'white', border: 'none', borderRadius: '5px', cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Probando...' : 'Probar Obtener por ID'}
          </button>
        </div>

        {/* Test 5 */}
        <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h2>Test 5: Aceptar Solicitud</h2>
          <div style={{ marginBottom: '15px' }}>
            <label>
              <strong>ID:</strong>
              <input type="number" value={acceptId} onChange={(e) => setAcceptId(Number(e.target.value))} min={1} style={{ marginLeft: '10px', padding: '5px', width: '100px' }} />
            </label>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>
              <strong>Notas:</strong>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} style={{ marginLeft: '10px', padding: '5px', width: '100%', maxWidth: '600px' }} />
            </label>
          </div>
          <button onClick={() => handleTest('ACCEPT', async () => {
            const input: ConfirmAcceptInput = { notes };
            return await confirmAcceptAdoptionRequest(token, acceptId, input);
          })} disabled={loading} style={{ padding: '10px 20px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '5px', cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Probando...' : 'Probar Aceptar'}
          </button>
        </div>

        {/* Test 6 */}
        <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h2>Test 6: Validar Código</h2>
          <div style={{ marginBottom: '15px' }}>
            <label>
              <strong>Código:</strong>
              <input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Ingresa código" style={{ marginLeft: '10px', padding: '5px', width: '200px' }} />
            </label>
          </div>
          <button onClick={() => handleTest('VALIDATE', async () => {
            const input: ValidateCodeInput = { code };
            return await validateAdoptionCode(token, input);
          })} disabled={loading || !code} style={{ padding: '10px 20px', backgroundColor: '#607d8b', color: 'white', border: 'none', borderRadius: '5px', cursor: loading || !code ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Probando...' : 'Probar Validar'}
          </button>
        </div>

        {/* Results */}
        {loading && (
          <div style={{ padding: '20px', backgroundColor: '#fff3cd', borderRadius: '8px', marginTop: '20px' }}>
            <p style={{ margin: 0, fontWeight: 'bold' }}>Cargando...</p>
          </div>
        )}

        {error && (
          <div style={{ padding: '20px', backgroundColor: '#f8d7da', borderRadius: '8px', marginTop: '20px' }}>
            <h3 style={{ color: '#721c24' }}>Error</h3>
            <p style={{ color: '#721c24', margin: 0 }}>{error}</p>
          </div>
        )}

        {result && (
          <div style={{ padding: '20px', backgroundColor: '#d4edda', borderRadius: '8px', marginTop: '20px' }}>
            <h3 style={{ color: '#155724' }}>Resultado: {result.testName}</h3>
            <p><strong>Estado:</strong> {result.ok ? 'Exito' : 'Error'}</p>
            {result.error && <p><strong>Error:</strong> {result.error}</p>}
            {result.data && (
              <div>
                <strong>Datos:</strong>
                <pre style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '5px', overflowX: 'auto', maxHeight: '400px', overflowY: 'auto' }}>
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default TestAdoptionRequestAPI;
