import axios from 'axios'

export async function loginApi(data: { email: string, password: string }) {
    const res = await axios.post('https://api1.joinsumu.com/v1/auth/signin', data)
    return res.data
}