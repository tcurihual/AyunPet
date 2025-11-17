import { Router } from "express";

const router = Router()

router.get("/", (req,res)=>{
    res.status(200).json({
        message: "get users endpoint reached",
        type: "success",
        value: {
            endpoint: "/api/entities/users/"
        }
    })
})

router.get("/:id", (req,res)=>{
    const { id } = req.params
    res.status(200).json({
        meessage: "get user by id enpoint reached",
        type: "success",
        value: {
            endpoint: "/api/entities/users/:id",
            method: "get",
            userId: id
        }
    })
})

router.post("/", (req,res)=>{
    res.status(200).json({
        message: "create user endpoint reached",
        type: "success",
        value: {
            endpoint:"/api/entities/users:id",
            method: "post"
        }
    })
})

router.put("/:id", (req,res)=>{
    const { id } = req.params
    res.status(200).json({
        message: "update user endpoint reached",
        type: "success",
        value: {
            endpoitn: "api/entities/users:id",
            method: "put",
            userId: id
        }
    })
})

router.patch("/:id", (req, res) => {
    const { id } = req.params
    res.status(200).json({
        message: "patch user endpoint reached",
        type: "success",
        values: {
            endpoint: "/api/entities/users/:id",
            method: "patch",
            userId: id
        }
    })
})

router.delete("/:id", (req,res)=>{
    const { id } = req.params
    res.status(200).json({
        message: "delete user endpoint reached",
        type:"success",
        value:{
            endpoint: "api/entities/users:id",
            method: "delete",
            userId: id
        }
  }
})

    // Almacenamiento temporal de datos de usuario
const userDataStore = {};

// PATCH /me - endpoint para actualizar el perfil del usuario actual
router.patch("/me", (req, res) => {
  try {
    const { profile_picture, profile_mural, ...otherUpdates } = req.body;
    
    // Crear un objeto con todos los datos a guardar
    const updates = {
      profile_picture,
      profile_mural,
      ...otherUpdates,
      updated_at: new Date().toISOString()
    };
    
    // Guardar en memoria (en producción sería en database)
    userDataStore['current_user'] = updates;
    console.log('[PATCH /me] Datos guardados:', updates);
    
    // Responder con éxito
    res.status(200).json({
      ok: true,
      message: "Perfil de usuario actualizado exitosamente",
      data: updates
    });
  } catch (error) {
    console.error('[PATCH /me] Error:', error);
    res.status(500).json({
      ok: false,
      error: "Error al actualizar el perfil"
    });
  }
})

})

export default router
