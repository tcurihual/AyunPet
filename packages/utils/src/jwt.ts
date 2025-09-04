import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret"

interface UserToken {
    UserId:string
    UserName: string
    email: string
    role:string
}

function createToken(user:{id:string, email:string}) {
    console.log("creando token del user:",user.email)
    const TokenData = {
        userID: user.id,
        email: user.email,
    }
    const token = jwt.sign(
        TokenData,
        JWT_SECRET,
        {
            expiresIn:"15m"
        }
    )

    console.log("Token Creado", token.substring(0,50)+ "...")
    return token
}

function TokenVerify(token:string) {
    try {
        const UserData = jwt.verify(token,JWT_SECRET) as any
        console.log("Token Aceptado para el user:",UserData.email)
        return UserData
    } catch (error){
        console.log("token anulado")
        return null
    }

}

function createAccessToken(user:UserToken) {
    try{
        const token = jwt.sign(
        {
            userID: user.UserId,
            email: user.email,
            name: user.UserName,
            role: user.role,
            type: "access"
        },
        JWT_SECRET,
        {
            expiresIn:"15m",
            issuer: "ns",
            audience: "UserPet"
        }
    )

        console.log("AccessToken Creado")
        return token

    } catch (error) {
        console.error("Error al generar Access Token:", error)
        throw new Error("Error interno al generar token")
    }

}

function createRefreshToken(user:UserToken){
    try{
        const token = jwt.sign(
            {userID: user.UserId,
            tokenVersion: 1,
            type: "refresh",
            },JWT_SECRET,
            {expiresIn: "7d",
            audience: "AyunRefresh",
            issuer: "ns"
            }
        )
        console.log("refreshToken creado")
        return token

    } catch (error) {
        console.error("Error al generar Refresh Token:", error)
        throw new Error("Error interno al generar refresh token")
}

}

function verifyAccessToken(token: string) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET, {
            audience: "UserPet"
        }) as any
        
        if (decoded.tipo !== "access") {
            throw new Error("Este no es un Access Token")
        }
        
        return decoded
    } catch (error) {
        console.log("AccessToken invalido :", error)
        return null
    }
}

function verifyRefreshToken(token: string) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET, {
            audience: "ayunRefresh"
        }) as any
        
        if (decoded.tipo !== "refresh") {
            throw new Error("Este no es un Refresh Token")
        }
        
        return decoded
    } catch (error) {
        console.log("refreshToken inválido:", error)
        return null
    }
}