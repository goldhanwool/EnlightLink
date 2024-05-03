import { snackVar } from "../constants/snackVar";
import { API_URL } from "../constants/urls";

const useCreateUser = () => {
    const createUser = async() => { 
        const userRes = await fetch(`${API_URL}/users`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
        });
        if (!userRes.ok) {
            snackVar({ message: '계정 생성에 실패하였습니다.', type: 'error' })
            return new Error(userRes.statusText);
        }
    };
    return { createUser }
}
export { useCreateUser };