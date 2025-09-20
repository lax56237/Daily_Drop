import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import CreateAcc from './CreateAcc';
import Home from './Home';
import Delivery from './Delivery';
import Verify from './Verify';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/CreateAcc" element={<CreateAcc />} />
                <Route path="/Home" element={<Home />} />
                <Route path="/delivery" element={<Delivery />} />
                <Route path="/verify" element={<Verify />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
