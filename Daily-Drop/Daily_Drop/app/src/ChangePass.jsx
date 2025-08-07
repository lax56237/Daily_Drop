import { useNavigate } from 'react-router-dom';
import './ChangePass.css';


function ChangePass() {
    const navigate = useNavigate();

    return (
        <>
            <div className="changepass-container">
                <div className="changepass-box">
                    <h1>Change Password Page</h1>
                    <input type="password" placeholder="Enter new password" />
                    <input type="password" placeholder="Confirm new password" />
                    <button onClick={() => navigate("/")}>Change Password</button>
                </div>
            </div>

        </>
    )
}
export default ChangePass