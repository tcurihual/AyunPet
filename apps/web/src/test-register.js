// Script de prueba para testear el endpoint de registro contra la API real de Azure
// Ejecutar con: node apps/web/src/test-register.js

const testRegister = async () => {
  const testData = {
    name: "Usuario Prueba",
    email: `test_${Date.now()}@example.com`,
    password: "123456",
    rut: "12.345.678-9",
    address: "Dirección de prueba",
    description: "Usuario de prueba"
  };

  try {
    console.log("🧪 Iniciando prueba de registro...");
    console.log("📝 Datos de prueba:", testData);
    
    const response = await fetch("http://ayunpet-api.eastus2.cloudapp.azure.com/v1/auth/register/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(testData)
    });

    console.log("📡 Status de respuesta:", response.status);
    console.log("📡 Headers de respuesta:", Object.fromEntries(response.headers));
    
    const text = await response.text();
    console.log("📡 Respuesta raw:", text);
    
    try {
      const json = JSON.parse(text);
      console.log("📡 Respuesta JSON:", json);
    } catch {
      console.log("⚠️ Respuesta no es JSON válido");
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

(async () => {
  await testRegister();
})();
