"use client"

import {IconButton, List, ListItem, ListItemText, TextField, Typography, Button} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React, {useState} from "react";
import Box from "@mui/material/Box";

interface ItemsListProps {
    items: string[],
    setItems: (value: (((prevState: any[]) => any[]) | any[])) => void,
    input_placeholder: string,
    empty_list_placeholder:string,
    button_text: string
}

const ItemsList = ({items, setItems, input_placeholder, empty_list_placeholder, button_text}: ItemsListProps) => {
    /*
    * This component displays a list of items and allows the user to add and delete items.
    * @param items: The list of items
    * @param setItems: The function to set the list of items
    * @param input_placeholder: The placeholder for the input field
    * @param empty_list_placeholder: The placeholder for the list when it is empty
    * @param button_text: The text for the button
    */
    const [newItem, setNewItem] = useState('')
    const [noInput, setNoInput] = useState(false)

    const handleDelete = (index: number) => {
        const newFields = [...items];
        newFields.splice(index, 1);
        setItems(newFields);
    }

    const addNewFile = () => {
        if (newItem !== '') {
            const newItems = [...items];
            newItems.push(newItem)
            setItems(newItems);
            setNewItem('');
            setNoInput(false);
            console.log(items);
        } else {
            setNoInput(true);
        }
    }

    return (
        <Box>
            {items.length === 0 ? (
                <Typography variant={"body1"} color={"text.disabled"} sx={{padding: 1}}>{empty_list_placeholder}</Typography>
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
                            key={index}
                            secondaryAction={
                                <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={() => handleDelete(index)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            }
                        >
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