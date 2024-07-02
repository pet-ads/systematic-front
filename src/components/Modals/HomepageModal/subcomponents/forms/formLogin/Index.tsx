import { Link } from "react-router-dom"
import "../index.css"

export default function FormLogin() {
    return (
        <form action="#">
            <h2>
                Log In
            </h2>
            <div className="contentForm">
                <div className="inputGroup"> 
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email"></input>
                </div>
                <div className="inputGroup"> 
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password"></input>
                </div>
                <div className="actions">
                    <button>
                        Log in
                    </button>
                    <Link to="#">
                        Forgot Password?
                    </Link>
                </div>
            </div>
        </form>
    )
}