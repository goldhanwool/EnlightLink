import React, { useState } from 'react'
import './Pdf.css'
import axios from 'axios';
import { toast } from 'react-toastify';

const Pdf = () => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("이미지 파일을 업로드 해주세요");
    const [imgSrc, setImgSrc] = useState(null);
    const [resText, setResText] = useState(null);
    const [cropImgs, setCropImgs] = useState([]);

    const imageSelectHandler = (event) => {
        const imageFile = event.target.files[0];
        setFile(imageFile);
        setFileName(imageFile.name);

        //사진 미리보기
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onload = (e) => setImgSrc(e.target.result)
    }

    const onSubmit = async(event) => {
        if (file === null) {
            event.preventDefault();
            alert("이미지 파일을 업로드 해주세요");
            return;
        }
        event.preventDefault();
        const formData = new FormData();
        formData.append("file", file);
        console.log(formData);
        try {
            const res = await axios.post('http://localhost:8000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then((res) => {
                const pdfText = res.data.text;
                // const pdfTextArray = pdfText.split("\n");
                setResText(pdfText);

                for (let i = 0; i < res.data.crop_imgs.length; i++) {
                    setCropImgs((cropImgs) => [...cropImgs, res.data.crop_imgs[i]]);
                }
                
            })
            .catch((error) => console.log("error:", error))
            
            alert("업로드 성공");
            setFile(null);
            setFileName("이미지 파일을 업로드 해주세요");
            setImgSrc(null);
        
        } catch (err) {
            console.log(err);
            alert("업로드 실패");
        }
    }
    
    const reset = (event) => {
        event.preventDefault();
        setFile(null);
        setFileName("이미지 파일을 업로드 해주세요");
        setImgSrc(null);
    }
    
    const pdfReset = (event) => {
        event.preventDefault();
        setResText(null);
        setCropImgs([]);
    }
    
    return (
      <div className="content">
        <section className="pdf_container">
          <div className='pdf_container_inner'>
            {resText ? (
            <>
                <div className='pdf_area'>
                {resText?.map((item, idx) => (
                   item.trim() !== '' && <div key={idx} className='pdf_font'>
                        <p>{item}</p>
                        <div className='message_term_first'></div>
                    </div>
                ))}
                <div className='crop_image'>
                    <div className='message_term_first'></div>
                    <p>[Cropimage]</p>
                    {cropImgs?.map((imgData, idx) => (
                        <div key={idx} className='line'>
                            <img src={`data:image/png;base64,${imgData}`} alt={`${idx}`} />
                        </div>
                    ))}
                </div>
                </div>
                <div className=''>
                    <button 
                        type="submit"
                        className='change_button'
                        onClick={pdfReset}
                    >
                    초기화
                    </button>
                </div>
            </>
            ) : (
            <>
                <form>
                    { imgSrc ? (
                        <>
                            <img src={imgSrc} className='file_drop_zone' alt=''/>
                        </>
                    ) : (
                        <>
                            <div className='file_drop_zone'>
                                {fileName}
                            <input 
                                id="image" 
                                type="file"
                                onChange={imageSelectHandler} 
                            />
                            </div>
                        </>
                    )} 
                    <button 
                        type="submit"
                        className='reset_button'
                        onClick={reset}
                    >
                    초기화
                    </button>
                    <button 
                        type="submit"
                        className='reset_button'
                        onClick={onSubmit}
                    >
                    이미지 업로드
                    </button>
                </form>
            </>
            )}
          </div>
        </section>
        </div>
      
  )
}

export default Pdf;