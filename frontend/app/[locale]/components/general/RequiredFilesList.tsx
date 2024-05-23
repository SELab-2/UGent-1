"use client"

import {Button, IconButton, List, ListItem, ListItemText, Tooltip, TextField, Typography} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React, {useState} from "react";
import Box from "@mui/material/Box";
import StatusButton from "@app/[locale]/components/StatusButton";
import {useTranslation} from "react-i18next";

interface ItemsListProps {
    items: string[],
    setItems: (value: (((prevState: any[]) => any[]) | any[])) => void,
    input_placeholder: string,
    empty_list_placeholder: string,
    button_text: string,
    items_status: string[],
    setItemsStatus: (value: (((prevState: any[]) => any[]) | any[])) => void,
}

const ItemsList = ({
                       items,
                       setItems,
                       input_placeholder,
                       empty_list_placeholder,
                       button_text,
                       items_status,
                       setItemsStatus
                   }: ItemsListProps) => {
    const [newItem, setNewItem] = useState('')
    const [noInput, setNoInput] = useState(false)
    const {t} = useTranslation();

    const handleDelete = (index: number) => {
        const newFields = [...items];
        newFields.splice(index, 1);
        setItems(newFields);
    }

    const addNewFile = () => {
        if (newItem !== '') {
            const newItems = [...items];
            const newStatuses = [...items_status];
            newItems.push(newItem);
            newStatuses.push("+");
            setItems(newItems);
            setItemsStatus(newStatuses);
            setNewItem('');
            setNoInput(false);
        } else {
            setNoInput(true);
        }
    }

    return (
        <Box>
            {items.length === 0 ? (
                <Typography variant={"body1"} color={"text.disabled"}
                            sx={{padding: 1}}>{empty_list_placeholder}</Typography>
            ) : (
                <List
                    sx={{
                        width: '100%',
                        maxWidth: 360,
                        bgcolor: 'background.paper',
                        maxHeight: 150,
                        overflow: 'auto',
                    }}
                >
                    {items.map((field, index) => (
                        <ListItem
                            disablePadding={true}
                            key={index}
                            secondaryAction={
                                <div>
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        onClick={() => handleDelete(index)}
                                    >
                                        <DeleteIcon/>
                                    </IconButton>
                                </div>
                            }
                        >
                            <Tooltip title={t("status_button_tooltip")} placement="top">
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <StatusButton files={items_status} setFiles={setItemsStatus} fileIndex={index} />
                                </div>
                            </Tooltip>
                            <ListItemText
                                primary={field}
                            />
                        </ListItem>
                    ))}
                </List>
            )
            }
            <Box
                display={'flex'}
                flexDirection={'row'}
                justifyContent={'flex-start'}
            >
                <TextField
                    value={newItem}
                    onChange={(event) => setNewItem(event.target.value)}
                    variant="outlined"
                    size="small"
                    error={noInput}
                    placeholder={input_placeholder}
                    sx={{
                        width: 'fit-content',
                    }}
                />
                <Button
                    onClick={() => addNewFile()}
                    variant={'contained'}
                    color={'secondary'}
                    sx={{
                        width: 'fit-content',
                        color: 'secondary.contrastText',
                        marginX: 1
                    }}
                >
                    <Typography>{button_text}</Typography>
                </Button>
            </Box>
        </Box>
    );
}

export default ItemsList