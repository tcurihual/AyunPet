import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt"
import { AppError, JsonResponse } from "@repo/utils";
import { createAccessToken, createRefreshToken } from "@repo/utils/src/jwt"

const fakeUser = {
    UserId: "1",
    username: "demo",
    email: "demo@ayunpet.info",
    role: "user",
    password: "si"
}

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            throw new AppError(400, "Email y contraseña son requeridos")
        }

        const user = fakeUser.email === email ? fakeUser : null
        
        if (!user) {
            throw new AppError(401, "Credenciales inválidas")
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        
        if (!isPasswordValid) {
            throw new AppError(401, "Credenciales inválidas")
        }

        const userForToken = {
            UserId: user.UserId,
            UserName: user.username,
            email: user.email,
            role: user.role
        }

        const accessToken = createAccessToken(userForToken)
        const refreshToken = createRefreshToken(userForToken)


        const response: JsonResponse<{
            user: {
                id: string
                name: string
                email: string
                role: string
            }
            accessToken: string
            refreshToken: string
        }> = {
            message: "Login exitoso",
            type: "success",
            values: {
                user: {
                    id: user.UserId,
                    name: user.username,
                    email: user.email,
                    role: user.role
                },
                accessToken,
                refreshToken
            }
        }

        return res.status(200).json(response)

    } catch (error) {
        next(error)
    }
}