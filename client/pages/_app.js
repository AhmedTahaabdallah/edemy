import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css';
import TopNav from '../components/TopNav';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from '../context';
import { useEffect, useState } from 'react';

function MyApp({ Component, pageProps }) {
  const [showing, setShowing] = useState(false);

    useEffect(() => {
      setShowing(true);
    }, []);
  
    if (!showing) {
      return null;
    }
  
    if (typeof window === 'undefined') {
      return <></>;
    } else {
      return (
      <Provider>
        <ToastContainer position='top-right'/>
        <TopNav/>
        <Component {...pageProps} />
      </Provider>
    );
      }
}

export default MyApp
