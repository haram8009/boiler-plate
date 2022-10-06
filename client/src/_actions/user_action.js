import axios from 'axios';
import {
    LOGIN_USER
} from './types';

export function loginUser(dataTosubmit) {
    const request = axios.post('/api/users/login', dataTosubmit)
        .then(response => response.data)
    // 서버에서 받은 데이타를 request에 저장

    return {
        // request를 reducer에 넘겨주기
        type: LOGIN_USER,
        payload: request // payload는 말하자면 response
    }
}