import { User } from '@/modules/common/models/user.model'
import fs from 'fs/promises'
import Password from '@/modules/common/services/password'

type UserData = {
    users: User[]
}

class UserService {
    constructor() {}

    findUsers(): Promise<User[]> {
        const res = require('@/data/users.json')
        return Promise.resolve(res.users)
    }

    findUser(username: string): Promise<User | undefined> {
        return this.findUsers().then((users) => users.find((u) => u.username === username))
    }

    createUser(username: string, password: string): Promise<User> {
        const res = require('@/data/users.json')
        return Password.hashPassword(password).then((hash) => {
            const newUser: User = {
                username,
                password: hash,
            }
            res.users.push(newUser)
            return fs.writeFile('src/data/users.json', JSON.stringify(res)).then(() => {
                return newUser
            })
        })
    }
}

export default new UserService()