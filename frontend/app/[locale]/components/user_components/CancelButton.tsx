'use client';

import React from 'react'
import {useTranslation} from "react-i18next";

const CancelButton = () => {
    const {t} = useTranslation()

    const handleCancel = () => {
        window.location.href = "/home";
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
                fontFamily: 'Quicksand',
                position: 'absolute',
                top: '20px',
                right: '20px',
                fontSize: '16px'
            }}>{t("cancel")}
            </button>

        </div>
    )
}

export default CancelButton