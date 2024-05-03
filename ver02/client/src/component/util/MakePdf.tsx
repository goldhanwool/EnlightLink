import jsPDF from 'jspdf'

const MakePdf= () => {
    const doc = new jsPDF();

    // PDF에 텍스트 추가
    doc.text("Hello world!", 10, 10);
    doc.text("This is a simple PDF created using jsPDF.", 10, 20);

    // PDF 파일로 다운로드
    doc.save('example.pdf');

    return null;
    // return (
    // <div>
    //   <button onClick={generatePdf}>Download PDF</button>
    // </div>
    // );
};
export default MakePdf;