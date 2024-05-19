import React from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface RemoveDialogProps {
    confirmRemove: boolean;
    handleRemove: () => void;
    setConfirmRemove: (value: boolean) => void;
}

const RemoveDialog: React.FC<RemoveDialogProps> = ({ confirmRemove, handleRemove, setConfirmRemove }) => {
    const { t } = useTranslation();

    return (
        <Dialog open={confirmRemove} onClose={() => setConfirmRemove(false)}>
            <DialogTitle>{t('remove_dialog')}</DialogTitle>
            <DialogContent>
                <Box textAlign="center" color="grey">
                    {t('action_dialog')}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleRemove} color="error">
                    {t('remove_confirm')}
                </Button>
                <Button onClick={() => setConfirmRemove(false)} color="primary">
                    {t('remove_cancel')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RemoveDialog;
