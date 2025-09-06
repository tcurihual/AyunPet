import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret"
if (!JWT_SECRET) {
    console.error("Error con la key");
    process.exit(1);
}

interface UserToken {
    UserId:string
    UserName: string
    email: string
    role:string
}

export function createAccessToken(user:UserToken) {
    try{
        const token = jwt.sign(
        {
            userId: user.UserId,
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

export function createRefreshToken(user:UserToken){
    try{
        const token = jwt.sign(
            {userId: user.UserId,
            tokenVersion: 1,
            type: "refresh",
            },JWT_SECRET,
            {expiresIn: "7d",
            audience: "ayunRefresh",
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

export function verifyAccessToken(token: string): UserToken {
    try {
        const decoded = jwt.verify(token, JWT_SECRET, {
            issuer: "ns",
            audience: "UserPet"
        }) as any

        if (decoded.type !== "access") {
            throw new Error("Tipo de token inválido")
        }
        
        return {
            UserId: decoded.UserId,
            email: decoded.email,
            role: decoded.role,
            UserName: decoded.UserName
        }
        
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error("Token expirado")
        } else if (error instanceof jwt.JsonWebTokenError) {
            throw new Error("Token inválido")
        } else {
            throw new Error("Error al verificar token")
        }
    }
}

export function verifyRefreshToken(token: string) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET, {
            issuer: "ns",
            audience: "ayunRefresh"
        }) as any
        
        if (decoded.type !== "refresh") {
            throw new Error("Este no es un Refresh Token")
        }
        
        return {
            UserId: decoded.UserId,
            email: decoded.email,
            role: decoded.role,
            UserName: decoded.UserName
        }
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error("Token expirado")
        } else if (error instanceof jwt.JsonWebTokenError) {
            throw new Error("Token inválido")
        } else {
            throw new Error("Error al verificar token")
        }
    }
}

export function extractTokenHeader(authHeader: string | undefined): string | null {
    if (!authHeader) {
        return null
    }
    
    const parts = authHeader.split(" ")
    
    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return null
    }
    
    return parts[1]  
}
