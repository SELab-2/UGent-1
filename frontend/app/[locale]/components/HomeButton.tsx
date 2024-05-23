'use client';

import React from 'react'
import { Button, Typography } from '@mui/material'
import Link from "next/link";

const HomeButton = () => {
    return (
        <div>
            <Link href={'/home'}>
                <Button
                    fullWidth
                    variant="text"
                    size="large"
                    sx={{color: 'white'}}
                >
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        Pigeonhole
                    </Typography>
                </Button>
            </Link>
        </div>
    )
}

export default HomeButton