import { BASE_URL } from "@/config";
import apiClient from "./apiClient";



export async function getProductsApi() {
    const res = await apiClient.get(BASE_URL + '/v1/products')
    return res.data
}