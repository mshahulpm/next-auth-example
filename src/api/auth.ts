import { BASE_URL } from '@/config'
import axios from 'axios'

type SignUPDto = {
    name: string
    email: string
    password: string
}
type SignUpResponseDto = {

}

type LoginResponseDto = {
    data: {
        user: any,
        access_token: string,
        refresh_token: string
    }
}

type LoginDto = Omit<SignUPDto, 'name'>

export async function loginApi(data: LoginDto) {
    const res = await axios.post(BASE_URL + '/v1/auth/signin', data)
    return res.data
}

export async function signUpApi(data: SignUPDto) {
    const res = await axios.post(BASE_URL + '/v1/auth/signup', data)
    return res.data as LoginResponseDto
}

export async function refreshTokenApi(refreshToken: string) {
    const res = await axios.get(BASE_URL + '/v1/auth/refresh', {
        headers: {
            Authorization: `Bearer ${refreshToken}`
        }
    })
    return res.data as { access_token: string, refresh_token: string }
}