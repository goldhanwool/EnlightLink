import './App.css';
import ChatMain from './Chat/Chat';
import Pdf from './Pdf/Pdf';
// import Test from './test';
import { ToastContainer } from 'react-toastify';
import { data } from './store';

function App() {
  return (
  <div className="">
    
    <div className="container" id="container">

        <Pdf />
        <ChatMain conversations={data} />
      </div>
  </div>
  );
}

export default App;
