<template>
    <div class='d-flex flex-row justify-content-center align-items-center shadowrun' style='height: 90vh'>
        <div class='login-container position-relative'>
            <div class='login-img login-img-container'>
                <img :src='banner' alt='' class='' />
                <div class='position-absolute top-0 start-0 login-img-effect' />
                <div class='position-absolute start-0 login-img-effect2' />
            </div>
            <div id='loginForm' class='login-form position-relative d-flex flex-row justify-content-center'>
                <form class='w-50' name='form' @submit.prevent=''>
                    <div class='row pb-3'>
                        <label class='col-sm-4 col-form-label'
                               for='username'>{{ $t('username') }}</label>
                        <div class='col-sm-8'>
                            <input id='username'
                                   required
                                   v-model='user.username'
                                   class='form-control'
                                   name='username'
                                   type='text' />
                        </div>
                    </div>
                    <div class='row pb-3 has-validation'>
                        <label class='col-sm-4 col-form-label'
                               for='password'>{{ $t('password') }}</label>
                        <div class='col-sm-8'>
                            <input id='password'
                                   required
                                   v-model='user.password'
                                   class='form-control'
                                   name='password'
                                   type='password' />
                        </div>
                    </div>
                    <div class='pb-4 d-flex flex-row gap-2'>
                        <button :disabled='loading' class='btn btn-primary w-100' @click='handleLogin($event)'>
                            <span v-show='loading' class='spinner-border spinner-border-sm me-1'></span>
                            <span><i class='bi bi-box-arrow-in-right' /> {{ $t('login') }}</span>
                        </button>
                        <button :disabled='loading' class='btn btn-outline-primary w-100'
                                @click='handleRegister($event)'>
                            <span><i class='bi bi-person-plus' /> {{ $t('register') }}</span>
                        </button>
                    </div>
                    <div v-if='message' class='alert alert-danger' role='alert'>{{ message || $t('error') }}</div>
                </form>
            </div>
        </div>
    </div>

</template>

<script lang='ts'>
import { defineComponent } from 'vue'

export default defineComponent({
    data() {
        return {
            user: {
                username: undefined,
                password: undefined,
            },
            loading: false,
            message: '',
            banner: new URL('../assets/shadowrun.jpg', import.meta.url),
        }
    },
    computed: {
        loggedIn(): boolean {
            return !!this.$store.state.auth.user
        },
    }
    ,
    created() {
        if (this.loggedIn) {
            this.$router.push('/')
        }
    }
    ,
    methods: {
        handleLogin(event: Event) {
            if (this.user.username && this.user.password) {
                this.loading = true
                this.$store.dispatch('auth/login', this.user).then(
                    () => {
                        this.loading = false
                        this.$router.push('/')
                    },
                    error => {
                        this.loading = false
                        this.message = error.response?.data?.error || error.toString()
                    },
                )
            }
        },

        handleRegister(event: Event) {
            if (this.user.username && this.user.password) {
                this.loading = true
                this.$store.dispatch('auth/register', this.user).then(
                    () => {
                        this.loading = false
                        this.$router.push('/')
                    },
                    error => {
                        this.loading = false
                        console.log(error)
                        this.message = error.response?.data?.error || error.toString()
                        console.log(this.message)
                    },
                )
            }
        },
    },
})
</script>

<style scoped lang='scss'>

@import "../assets/shadowrun";

.login-container {
    width: 1000px;
    height: 780px;
    box-shadow: 0 10px 16px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19) !important;
}

.login-img {
    width: 1000px;
    height: 562px;
}

.login-img > img {
    width: 100%;
    height: auto;
}

.login-img-effect {
    width: 100%;
    height: 500px;
    background: linear-gradient(to bottom, transparent, white);
}

.login-img-effect2 {
    width: 100%;
    height: 280px;
    top: 500px;
    background-color: white;
}

.login-form {
    /*position: absolute;*/
    top: -30px;
    width: 1000px;
}

.form-group.required > label:after {
    content: " *";
    color: red;
}

.col-form-label.is-invalid {
    color: red;
    font-style: italic;
}

.alert {
    /*height: 50px;*/
}

</style>
