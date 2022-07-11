import axios from "@/axios";
import AuthService from "@/modules/auth/auth.service";
import type {Store} from "vuex";
import router from "@/router";

const setup = (store: Store<{}>) => {
    // Request interceptor to set Authorization header
    axios.interceptors.request.use(request => {
        const token = AuthService.loggedInUser()?.token;
        if (token) {
            // @ts-ignore
            request.headers.common.Authorization = `Bearer ${token}`;
        }
        return request;
    })

    // Response interceptor to automatically refresh token
    axios.interceptors.response.use(
        (response) => {
            return response
        },
        (error) => {
            const originalConfig = error.config;
            if (originalConfig.url.includes('auth/refresh') && error.response) {
                AuthService.logout();
                store.dispatch('auth/logout');
                router.push('/login')
                return Promise.reject(error)
            }
            if (!originalConfig.url.includes('auth/login') && error.response) {
                if (error.response.status === 401 && !originalConfig._retry) {
                    originalConfig._retry = true;
                    return AuthService.refreshToken().then(token => {
                            return store.dispatch('auth/refreshToken', token).then(() => {
                                const token = AuthService.loggedInUser()?.token;
                                originalConfig.headers.Authorization = `Bearer ${token}`;
                                return axios(originalConfig);
                            });
                        },
                        error => {
                            return Promise.reject(error);
                        })
                }
            }
            return Promise.reject(error);
        }
    )
    ;
};

export default setup;