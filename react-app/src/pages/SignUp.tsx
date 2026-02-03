const SignUpPage = () => {
    return (
        <div>
            <h1>Sign Up</h1>
            <form>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" />
                </div>
                
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" />
                </div>
                <div>
                    <label htmlFor="confirmpassword">Confirm Password:</label>
                    <input type="password" id="confirmpassword" />
                </div>
                
                <button type="submit">Sign Up</button>
            </form>
        </div>
    )
}

export default SignUpPage;