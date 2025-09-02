import jwt from "jsonwebtoken"
import { email } from "zod"

const key = "nsqueponeracaoe"

function createToken(user:{id:string, email:string}) {
    console.log("creando token del user:",user.email)
    const TokenData = {
        userID: user.id,
        email: user.email,
    }
    const token = jwt.sign(
        TokenData,
        key,
        {
            expiresIn:"15m"
        }
    )

    console.log("Token Creado", token.substring(0,50)+ "...")
    return token
}

function TokenVerify(token:string) {
    try {
        const UserData = jwt.verify(token,key) as any
        console.log("Token Aceptado para el user:",UserData.email)
        return UserData
    } catch (error){
        console.log("token anulado")
        return null
    }

}

function createAccessToken(user:{id:string, email:string, role:string}) {
    const token = jwt.sign(
        {
            userID: user.id,
            email: user.email,
            role: user.role,
            type: "access"
        },
        key,
        {
            expiresIn:"15m",
            audience: "UserPet"
        }
    )

    console.log("AccessToken Creado")
    return token
}

function createRefreshToken(user:{id:string,email:string,role:string}){
    const token = jwt.sign(
        {userID: user.id,
        tokenVersion: 1,
        type: "refresh",
        },key,
        {expiresIn: "7d",
         audience: "AyunRefresh"
        }
    )
    console.log("refreshToken creado")
    return token
}
