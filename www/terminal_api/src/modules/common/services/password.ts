import { randomBytes, scrypt } from 'crypto'
import { promisify } from 'util'

const scryptAsync = promisify(scrypt)

class Password {
    hashPassword(password: string): Promise<string> {
        const salt = randomBytes(8).toString('hex')
        return scryptAsync(password, salt, 64).then((buf: Buffer) => {
            return `${buf.toString('hex')}.${salt}`
        })
    }

    comparePasswords(storedPassword: string, suppliedPassword: string): Promise<boolean> {
        const [hashedPassword, salt] = storedPassword.split('.')
        return scryptAsync(suppliedPassword, salt, 64).then((buf: Buffer) => {
            return buf.toString('hex') === hashedPassword
        })
    }
}

export default new Password()
