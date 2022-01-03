import React, { useState } from "react";
import { Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, Button, IconButton } from '@mui/material';
import { AiOutlineClose } from 'react-icons/ai';

import { TransactionData } from "../../../api";

interface Props {
    index: number,
    data: TransactionData
}

const ItemRow: React.FC<Props> = ({ index, data }) => {

    const [open, setOpen] = useState<boolean>(false);

    const toggleDialog = () => {
        setOpen((val) => !val);
    }

    return (
        <React.Fragment>
            <TableRow>
                <TableCell align="center">{index}</TableCell>
                <TableCell align="center">{data.total_amount}</TableCell>
                <TableCell align="center">{data.date}</TableCell>
                <TableCell align="center">
                    <Button color="secondary" variant="outlined" size="small" onClick={toggleDialog}>
                        Details
                    </Button>
                </TableCell>
            </TableRow>
            <Dialog open={open} onClose={toggleDialog}>
                <DialogTitle>
                    Details #{index}
                    <IconButton
                        aria-label="close"
                        onClick={toggleDialog}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                        }}
                    >
                        <AiOutlineClose size="16px" />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Sr No.</TableCell>
                                <TableCell align="center">Product</TableCell>
                                <TableCell align="center">Quantity</TableCell>
                                <TableCell align="center">Price per quantity</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                {data.items.map((item, i) => (
                                    <React.Fragment key={i}>
                                        <TableCell align="center">{i + 1}</TableCell>
                                        <TableCell align="center">{item.product}</TableCell>
                                        <TableCell align="center">{item.quantity}</TableCell>
                                        <TableCell align="center">{item.price_per_quantity}</TableCell>
                                    </React.Fragment>
                                ))}
                            </TableRow>
                        </TableBody>
                    </Table>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}

export default ItemRow;