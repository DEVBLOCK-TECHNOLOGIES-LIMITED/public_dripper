import axios from 'axios'
import uri from '../config'

const sendComment = async(data)=>{

    const response = await axios.post(`${uri}/api/comment`, data)

    return response.data
}

const commentService = {
    sendComment
}

export default commentService