import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Signup from "./CreateAcc";
import Forgot from "./Forgot";
import Home from "./Home";
import Products from "./Products";
import Address from "./Address";
import Order from "./Order";
import Cart from "./Cart";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/create" element={<Signup />} />
                <Route path="/forgot" element={<Forgot />} />
                <Route path="/home" element={<Home />} />
                <Route path="/Products" element={<Products />} />
                <Route path="/Address" element={<Address />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/order" element={<Order />} />
            </Routes>
        </Router>
    );
}

export default App;
