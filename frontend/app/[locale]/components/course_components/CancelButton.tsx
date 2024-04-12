'use client';

import React from 'react'
import { Button, Typography } from '@mui/material'
import Link from "next/link";
import {useTranslation} from "react-i18next";

const url = process.env['NEXT_PUBLIC_FRONTEND_URL'];

const CancelButton = () => {
    const { t } = useTranslation()

    const handleCancel = () => {
        window.location.href = url + "/home";
    }

    return (
        <div>
                <button onClick={handleCancel} style={{
                    backgroundColor: 'red',
                    color: 'white',
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontFamily: 'Arial, sans-serif',
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    fontSize: '16px'
                }}>{t("Cancel")}
                </button>

        </div>
    )
}

export default CancelButton