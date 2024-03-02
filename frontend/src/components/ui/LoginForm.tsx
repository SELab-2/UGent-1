// src/app/components/LoginForm.tsx

import React, {useState} from 'react';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Implement your login logic here
    };

    const handleCASLogin = () => {
        // Implement your CAS login logic here
    };

    return (
        <div>
            <h2>Pigeon Hole</h2>
            <form>
                <label>
                    Username:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </label>
                <br/>
                <label>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                <br/>
                <button type="button" onClick={handleLogin}>
                    Login
                </button>
                <button type="button" onClick={handleCASLogin}>
                    Login using CAS
                </button>
            </form>
        </div>
    );
};

export default LoginForm;
