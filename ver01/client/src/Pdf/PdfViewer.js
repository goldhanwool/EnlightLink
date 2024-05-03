import React, { useState, useRef } from 'react';
import axios from 'axios';
import './Pdf.css';

const PdfViewer = (props) => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("PDF 파일을 업로드 해주세요");
    const [previewUrl, setPreviewUrl] = useState(null); // PDF 미리보기 URL 상태 추가
    const [imgSrc, setImgSrc] = useState('default');
    const [isLoading, setIsLoading] = useState(false);

    const onFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type === "application/pdf") {
            setFile(selectedFile);
            setFileName(selectedFile.name);

            const url = URL.createObjectURL(selectedFile);
            setPreviewUrl(url); // 파일 선택 시 미리보기 URL 설정
            console.log("selectedFile: ",selectedFile);

        } else {
            alert("PDF 파일만 선택 가능합니다.");
        }
        };

    const onSubmit = async (event) => {
        console.log("onSubmit");
        setIsLoading(true);

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
            const url = 'http://localhost:8000/api/llm/upload'
            console.log("axios.post -> URL : ", url);

            const res = await axios.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then((res) => {
                const pdfText = JSON.parse(res.data);
                
                props.addMessageFromPdf(pdfText);
            })
            .catch((error) => console.log("error:", error))
            setImgSrc(null);
            alert("업로드 성공"); 
            setFileName("이미지 파일을 업로드 해주세요");

        } catch (err) {
            console.log(err);
            alert("업로드 실패");
        }
        setIsLoading(false);
        };

    const reset = (event) => {
        event.preventDefault();
        setFile(null);
        setFileName("PDF 파일을 업로드 해주세요");
        setPreviewUrl(null); // 초기화 시 미리보기 URL도 초기화
    };

    return (
    <div className="content">
        <section className="pdf_container">
        <div className='pdf_container_inner'>
            {file ? (
            <div>
                <div className='pdf_area'>
                {previewUrl && (
                    <iframe src={previewUrl} width="100%" height="100%"></iframe>
                )}
                </div>
                <button type="submit" className='reset_button' onClick={reset}>초기화</button>
                
                {imgSrc ? (
                <>
                    <button type="submit" className="reset_button" onClick={onSubmit} disabled={isLoading}>
                        PDF 업로드
                    </button>
                </>) : ( 
                    null
                )
                }
            </div>
            ) : (
            <form onSubmit={onSubmit}>
                <div className='file_drop_zone'>
                    {fileName}
                    <input 
                    id="pdf" 
                    type="file"
                    accept="application/pdf"
                    onChange={onFileChange}
                    />
                </div>
                <button type="submit" className="reset_button" onClick={reset}>
                    초기화
                </button>
                <button type="submit" className="reset_button" onClick={onSubmit} disabled={isLoading}>
                    PDF 업로드
                </button>
            </form>
            )}
        </div>
        </section>
    </div>
    );
};

export default PdfViewer;
