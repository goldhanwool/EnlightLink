import { snackVar } from "../constants/snackVar"
import { API_URL } from "../constants/urls";

interface AwsRes {
    awsUrl: string,
}
  
const useUploadFile = () => {
    const uploadFile = async(formData: FormData) => { 
        const awsRes = await fetch(`${API_URL}/upload/aws`, {
            method: 'POST',
            body: formData,
            credentials: "include", 
        })
        if (!awsRes.ok) {
            snackVar({ message: 'aws 파일업로드 에러', type: 'error' })
            throw new Error('Error in useUploadVector')
        }
        const awsData: AwsRes = await awsRes.json()
        return awsData
    };
    return { uploadFile }
}

export { useUploadFile };