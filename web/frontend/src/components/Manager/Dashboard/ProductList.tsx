import React from 'react';
import { Box, List as MuiList, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';
import { Typography, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FaChevronDown, FaChevronUp, FaTrash } from 'react-icons/fa';

import { TransactionData } from '.';

interface Props {
    data: TransactionData,
    updateQuantity: (index: number, change: number) => void,
    removeItem: (index: number) => void,
}

const List = styled(MuiList)({
    '& .MuiListItem-container': {
        backgroundColor: "#62626278",
        marginBottom: "16px",
    },
});

const ProductList: React.FC<Props> = ({ data, updateQuantity, removeItem }) => {
    return (
        <List disablePadding>
            {data.items.map((item, i) => (
                <ListItem key={i}>
                    <ListItemText primary={item.product?.name} secondary={`Price Per Quantity: ₹ ${item.product?.amount}`} />
                    <ListItemSecondaryAction>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <IconButton onClick={() => updateQuantity(i, -1)}>
                                <FaChevronDown size="12px" color="#919293" />
                            </IconButton>
                            <Typography variant="body1" mx="6px">{item.quantity}</Typography>
                            <IconButton onClick={() => updateQuantity(i, 1)}>
                                <FaChevronUp size="12px" color="#919293" />
                            </IconButton>
                            <IconButton color="secondary" onClick={() => removeItem(i)}>
                                <FaTrash size="16px" />
                            </IconButton>
                        </Box>
                    </ListItemSecondaryAction>
                </ListItem>
            ))}
        </List>
    );
}

export default ProductList;