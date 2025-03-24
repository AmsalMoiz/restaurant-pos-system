function LoginPage({ onLogin }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, you would validate credentials against a backend
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (username && password) {
            onLogin();
        } else {
            alert('Please enter both username and password');
        }
    };

    return (
        <>
            <div id="box"> 
                <h1>Employee Login</h1> 
                
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">Username</label>
                    <br />
                    <input type="text" id="username" required/>
                    <br />
                    <label htmlFor="password">Password</label>
                    <br />
                    <input type="password" id="password" required/>
                    <br />
                    <br />
                    <button type="submit" id="sign_in">Sign In</button>
                </form>
            </div>
        </>
    );
}

export default LoginPage;