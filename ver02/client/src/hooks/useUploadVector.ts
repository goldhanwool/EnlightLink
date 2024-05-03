import { snackVar } from "../constants/snackVar"
import { API_URL } from "../constants/urls";

interface VectorRes {
    namespace: string,
    index: string,
    originFileName: string, 
    filename: string,
}

const useUploadVector = () => {
    const uploadVector = async(formData: FormData) => {
        const vectorRes = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            body: formData,
            credentials: "include",
        })
        if (!vectorRes.ok) {
            snackVar({ message: vectorRes.statusText, type: 'error' })  
            throw new Error('Error in useUploadVector')
        }
        const vectorData: VectorRes = await vectorRes.json()
        return vectorData
    };
    return { uploadVector }
} //end of UploadFile

export { useUploadVector };