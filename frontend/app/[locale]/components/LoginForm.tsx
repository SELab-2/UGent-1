"use client";
import React, {useState} from 'react';
import {Button, IconButton, InputAdornment, TextField} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const LoginForm = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleLogin = (): void => {
        // Implement your login logic here
        console.log('Login with:', email, password);
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return (
        <div>
            <TextField
                label="Email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
            />
            <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                            >
                                {showPassword ? (
                                    <Visibility fontSize="small"/> // Set the icon to small
                                ) : (
                                    <VisibilityOff fontSize="small"/> // Set the icon to small
                                )}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
            <Button onClick={handleLogin}>Login</Button>
        </div>
    );
}

export default LoginForm;
