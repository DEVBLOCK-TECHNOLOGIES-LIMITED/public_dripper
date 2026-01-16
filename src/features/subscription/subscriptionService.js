import axios from 'axios'
import uri from '../config'

const subscribe = async(data)=>{
    const response = await axios.post(`${uri}/api/subscribe`, data)

    return response.data
}

const subscriptionService = {
    subscribe,
}

export default subscriptionService