import axios from "axios"

export const PAYPAL_API = 'https://api-m.sandbox.paypal.com'

export const URL_BE = 'http://localhost:1337/api'
export const URL = 'http://localhost:1337'

export const getData = async (url, query) => {
    try {
        return await axios.get(URL_BE + url + `${query ? `?${query}` : ''}`)
    } catch (err) {
        throw new Error(err)
    }
}

export const createData = async (url, data) => {
    try {
        return await axios.post(
            URL_BE + url,
            {
                data: data
            }
        )
    } catch (err) {
        throw new Error(err)
    }
}

export const updateData = async (url, data) => {
    try {
        return await axios.put(
            URL_BE + url,
            {
                data: data
            }
        )
    } catch (err) {
        throw new Error(err)
    }
}
