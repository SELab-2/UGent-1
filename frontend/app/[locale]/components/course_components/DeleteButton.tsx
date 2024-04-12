'use client';

import React from 'react'
import {useTranslation} from "react-i18next";

const DeleteButton = () => {
    const {t} = useTranslation()

    const handleDelete = () => {
        //TODO
        window.location.href = "/home";
    }

    return (
        <div>
            <button onClick={handleDelete} style={{
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
            }}>{t("Delete course")}
            </button>

        </div>
    )
}

export default DeleteButton