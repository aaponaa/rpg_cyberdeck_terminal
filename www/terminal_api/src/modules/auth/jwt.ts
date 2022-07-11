import jwt, { JwtPayload } from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import { User } from '@/modules/common/models/user.model'

const jwtSecret: string = process.env.JWT_SECRET || '123456'
const jwtRefreshSecret: string = process.env.JWT_REFRESH_SECRET || '654321'
const tokenExpirationInSeconds = process.env.JWT_TOKEN_LIFE || '1m'
const refreshTokenExpirationInSeconds = process.env.JWT_REFRESH_TOKEN_LIFE || '30d'

const refreshTokens = {}

class JWT {
    generateTokens(user: User): { token: string; refreshToken: string } {
        const token = jwt.sign(user, jwtSecret, {
            expiresIn: tokenExpirationInSeconds,
        })
        const refreshToken = jwt.sign(user, jwtRefreshSecret, {
            expiresIn: refreshTokenExpirationInSeconds,
        })
        const tokens = {
            token,
            refreshToken,
        }
        refreshTokens[refreshToken] = tokens
        return tokens
    }

    verifyRefreshToken(refreshToken: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const tokens = refreshTokens[refreshToken]
            if (!tokens) {
                reject({ error: true, message: 'Invalid refresh token' })
            } else {
                jwt.verify(refreshToken, jwtRefreshSecret, (err, tokenDetails: JwtPayload) => {
                    if (err) {
                        reject({
                            error: true,
                            message: 'Invalid refresh token',
                        })
                    }
                    resolve({
                        token: jwt.sign(
                            {
                                username: tokenDetails.username,
                                password: tokenDetails.password,
                            },
                            jwtSecret,
                            {
                                expiresIn: tokenExpirationInSeconds,
                            },
                        ),
                        error: false,
                        message: 'Valid refresh token',
                    })
                })
            }
        })
    }

    authenticateJWT(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization
        if (authHeader && authHeader !== 'null') {
            const token = authHeader.replace('Bearer ', '')
            jwt.verify(token, jwtSecret, (err: any, user: any) => {
                if (err) {
                    return res.status(401).send({ success: false, message: 'Token Expired' })
                }
                req['user'] = user
                next()
            })
        } else {
            res.status(401).json({ success: false, message: 'Unauthorized' })
        }
    }
}

export default new JWT()
