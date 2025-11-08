// apps/web/src/tests/testCommentsAPI.ts
// Script para probar la conexión con la API de mensajes/comentarios

import { 
  getCommentsByPost, 
  createComment, 
  updateComment, 
  deleteComment 
} from '../lib/CommentService';

/**
 * Función de prueba para verificar la conexión con la API
 * Ejecutar en consola del navegador o como test
 */
export async function testCommentsAPI() {
  console.log('🧪 Iniciando pruebas de API de comentarios...\n');
  
  // Obtener token del localStorage
  const token = localStorage.getItem('authToken') || '';
  
  if (!token) {
    console.error('❌ No hay token de autenticación. Inicia sesión primero.');
    return;
  }

  console.log('✅ Token encontrado:', token.substring(0, 20) + '...\n');

  // TEST 1: Obtener mensajes/comentarios
  console.log('📋 TEST 1: Obteniendo comentarios del post ID 1...');
  try {
    const result = await getCommentsByPost(1, token);
    if (result.ok) {
      console.log('✅ Comentarios obtenidos:', result.data);
      console.log(`   Total: ${result.data?.length || 0} comentarios\n`);
    } else {
      console.warn('⚠️ Error al obtener comentarios:', result.error);
      console.log('   Esto es normal si no hay comentarios aún\n');
    }
  } catch (error) {
    console.error('❌ Error en TEST 1:', error);
  }

  // TEST 2: Crear un comentario de prueba
  console.log('📝 TEST 2: Creando comentario de prueba...');
  let createdCommentId: number | null = null;
  
  try {
    const result = await createComment(token, {
      post_id: 1,
      content: '🧪 Este es un comentario de prueba desde el frontend - ' + new Date().toLocaleTimeString()
    });
    
    if (result.ok && result.data) {
      createdCommentId = result.data.id;
      console.log('✅ Comentario creado exitosamente!');
      console.log('   ID:', result.data.id);
      console.log('   Contenido:', result.data.content);
      console.log('   Fecha:', result.data.created_at, '\n');
    } else {
      console.warn('⚠️ No se pudo crear el comentario:', result.error, '\n');
    }
  } catch (error) {
    console.error('❌ Error en TEST 2:', error);
  }

  // TEST 3: Actualizar comentario (si se creó)
  if (createdCommentId) {
    console.log('✏️ TEST 3: Actualizando comentario...');
    try {
      const result = await updateComment(
        token, 
        createdCommentId, 
        '🔄 Comentario actualizado - ' + new Date().toLocaleTimeString()
      );
      
      if (result.ok) {
        console.log('✅ Comentario actualizado exitosamente!');
        console.log('   Nuevo contenido:', result.data?.content, '\n');
      } else {
        console.warn('⚠️ No se pudo actualizar:', result.error, '\n');
      }
    } catch (error) {
      console.error('❌ Error en TEST 3:', error);
    }
  }

  // TEST 4: Eliminar comentario de prueba (si se creó)
  if (createdCommentId) {
    console.log('🗑️ TEST 4: Eliminando comentario de prueba...');
    try {
      const result = await deleteComment(token, createdCommentId);
      
      if (result.ok) {
        console.log('✅ Comentario eliminado exitosamente!\n');
      } else {
        console.warn('⚠️ No se pudo eliminar:', result.error, '\n');
      }
    } catch (error) {
      console.error('❌ Error en TEST 4:', error);
    }
  }

  console.log('🏁 Pruebas completadas!\n');
  console.log('📊 Resumen:');
  console.log('   - Si ves ✅ en todos los tests, la API está funcionando correctamente');
  console.log('   - Si ves ⚠️, puede que el endpoint necesite ajustes o no esté implementado');
  console.log('   - Revisa la consola de red (Network) para ver los detalles de las peticiones\n');
}

// Exportar para usar en consola
if (typeof window !== 'undefined') {
  (window as any).testCommentsAPI = testCommentsAPI;
  console.log('💡 Para probar la API, ejecuta en consola: testCommentsAPI()');
}

export default testCommentsAPI;