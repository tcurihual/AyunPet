// Script de prueba para testear el endpoint de registro
// Ejecutar con: node apps/web/src/test-register.js

const testRegister = async () => {
  const testData = {
    fullName: "Usuario Prueba",
    email: "test@example.com",
    password: "123456",
    rut: "12345678-9",
    address: "Dirección de prueba",
    description: "Usuario de prueba"
  };

  try {
    console.log("🧪 Iniciando prueba de registro...");
    console.log("📝 Datos de prueba:", testData);
    
    const response = await fetch("http://localhost:3000/v1/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(testData)
    });

    console.log("📡 Status de respuesta:", response.status);
    console.log("📡 Headers de respuesta:", Object.fromEntries(response.headers));
    
    const result = await response.text();
    console.log("📡 Respuesta raw:", result);
    
    try {
      const jsonResult = JSON.parse(result);
      console.log("📡 Respuesta JSON:", jsonResult);
    } catch (e) {
      console.log("⚠️ La respuesta no es JSON válido");
    }
    
    if (response.ok) {
      console.log("✅ Prueba de registro exitosa!");
    } else {
      console.log("❌ Prueba de registro falló");
    }
    
  } catch (error) {
    console.error("💥 Error en la prueba:", error.message);
    console.error("💥 Stack:", error.stack);
  }
};

// Verificar primero que el gateway esté corriendo
const checkGateway = async () => {
  try {
    console.log("🔍 Verificando si el gateway está corriendo...");
    const response = await fetch("http://localhost:3000/v1/docs");
    console.log("🔍 Gateway status:", response.status);
    if (response.status === 200) {
      console.log("✅ Gateway está corriendo!");
      return true;
    } else {
      console.log("❌ Gateway no responde correctamente");
      return false;
    }
  } catch (error) {
    console.error("❌ Gateway no está corriendo:", error.message);
    return false;
  }
};

const runTest = async () => {
  const gatewayRunning = await checkGateway();
  if (gatewayRunning) {
    await testRegister();
  } else {
    console.log("\n💡 Para ejecutar esta prueba:");
    console.log("1. Ve al repositorio AyunPetIV");
    console.log("2. Ejecuta: pnpm install");
    console.log("3. Ejecuta: pnpm run api");
    console.log("4. Espera a que todos los servicios estén corriendo");
    console.log("5. Vuelve a ejecutar esta prueba");
  }
};

runTest();