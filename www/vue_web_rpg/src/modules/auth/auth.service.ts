import type {User} from "@/modules/common/models/user.model";
import axios from "@/axios";
import {joinWithSlash} from "@/modules/common/services/url-utils";
import router from "@/router";

class AuthService {

    loggedInUser(): User | undefined {
        const storedUser = localStorage.getItem(LOCAL_STORAGE_USER);
        return storedUser ? JSON.parse(storedUser) : undefined;
    }

    login(username: string, password: string): Promise<User> {
        return axios.post("/auth/login", {
            username,
            password
        }).then((response) => {
            const user = {
                username: response.data.username,
                token: response.data.token,
                refreshToken: response.data.refreshToken
            };
            localStorage.setItem(LOCAL_STORAGE_USER, JSON.stringify(user));
            return user
        });
    }

    logout() {
        localStorage.removeItem(LOCAL_STORAGE_USER);
    }

    refreshToken(): Promise<string> {
        let user = this.loggedInUser();
        if (!user) {
            return Promise.reject("No logged in user");
        } else {
            return axios.post(joinWithSlash('/auth/refresh'), {
                refreshToken: user?.refreshToken
            }).then(response => {
                user = {
                    username: user!.username,
                    refreshToken: user!.refreshToken,
                    token: response.data.token
                }
                localStorage.setItem(LOCAL_STORAGE_USER, JSON.stringify(user));
                return response.data.token;
            }, error => {
                return Promise.reject(error);
            })
        }
    }

    register(username: string, password: string): Promise<User> {
        return axios.post("/auth/register", {
            username,
            password
        }).then((response) => {
            const user = {
                username: response.data.username,
                token: response.data.token,
                refreshToken: response.data.refreshToken
            };
            localStorage.setItem(LOCAL_STORAGE_USER, JSON.stringify(user));
            return user
        });
    }
}

export default new AuthService();


export const LOCAL_STORAGE_USER = 'cyberdeck.user';