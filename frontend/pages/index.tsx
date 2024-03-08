// pages/index.tsx
import React from 'react';
import LoginForm from '@/components/ui/LoginForm';
import LoginCard from '@/components/ui/LoginCard';


const Home = () => {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <LoginForm/>
            <LoginCard/>
        </main>
    );
};

export default Home;
