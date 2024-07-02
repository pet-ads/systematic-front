import { Link } from "react-router-dom"
import "../index.css"

export default function FormSignup({redirectFormLogin} : {redirectFormLogin : () => void}) {
    return (
        <form action="#">
            <h2>
                Sign Up
            </h2>
            <div className="contentForm">
                <div className="inputGroup">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name"></input>
                </div>
                <div className="inputGroup"> 
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email"></input>
                </div>
                <div className="inputGroup"> 
                    <label htmlFor="affiliation">Affiliation</label>
                    <input type="text" id="affiliation"></input>
                </div>
                <div className="inputGroup"> 
                    <label htmlFor="state">State</label>
                    <select>
                        <option>Brazil</option>
                        <option>Spain</option>
                        <option>England</option>
                        <option>France</option>
                    </select>
                </div>
                <div className="inputGroup"> 
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password"></input>
                </div>
                <div className="inputGroup"> 
                    <label htmlFor="confirmPassword">Confirm password</label>
                    <input type="password" id="confirmPassword"></input>
                </div>

                <div className="actions">
                    <button>
                        Create Account
                    </button>
                    <Link to="#" onClick={redirectFormLogin}>
                        Already have an account?
                    </Link>
                </div>
            </div>
        </form>
    )
}