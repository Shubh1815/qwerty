import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import QrReader from "react-qr-reader";
import { Alert, Box, Container, Grid, Typography, Divider, Paper, LinearProgress } from '@mui/material';
import { Autocomplete, TextField as MuiTextField, Button, ButtonGroup } from '@mui/material';
import { styled } from '@mui/material/styles';

import ProductList from "./ProductList";
import useToken from '../../../hooks/useToken';
import useAuthQuery from "../../../hooks/useAuthQuery";
import useAuthMutation from "../../../hooks/useAuthMutate";
import { getProduct, ProductResponse, ProductData, Categories } from '../../../api';
import { postTransaction, TransactionBody, TransactionCreatedResponse, TransactionCreatedErrorResponse, TransactionValidationError } from '../../../api';

interface Params {
    category?: Categories,
}

interface Item {
    product: ProductData,
    quantity: number,
}

interface MutationVariables {
    access: string,
    transaction: TransactionBody
}

export interface TransactionData {
    student: string,
    pin: string,
    items: Item[],
    totalAmount: 0,
}

const TextField = styled(MuiTextField)({
    'margin': '0px 10px',
});


const Dashboard: React.FC = () => {

    const { access } = useToken();
    const { category = Categories.CANTEEN } = useParams<Params>();

    const emptyProduct: Item = {
        product: {
            name: "",
            amount: "0",
            category: category,
        },
        quantity: 0,
    }

    const { data, isLoading } = useAuthQuery<ProductResponse>(
        ['products', access, category],
        () => getProduct(access, category)
    );

    const [item, setItem] = useState<Item>(emptyProduct);
    const [transaction, setTransaction] = useState<TransactionData>({
        student: "",
        pin: "",
        items: [],
        totalAmount: 0,
    });
    const [scan, setScan] = useState<boolean>(false);

    useEffect(() => {
        setItem({
            product: {
                name: "",
                amount: "0",
                category: category,
            },
            quantity: 0
        });
        setTransaction((previousTransaction) => (
            { ...previousTransaction, items: [], totalAmount: 0 }
        ));
    }, [category]);

    const mutation = useAuthMutation<
        TransactionCreatedResponse,
        TransactionCreatedErrorResponse,
        MutationVariables
    >((params) => postTransaction(params.access, params.transaction), {
        onSuccess: () => {
            setTransaction({
                student: "",
                pin: "",
                items: [],
                totalAmount: 0,
            })
        },
    });

    const handleProductChange = (event: React.SyntheticEvent<Element, Event>, value: ProductData | null) => {
        if (value) {
            setItem((previousItem) => (
                { ...previousItem, product: value }
            ));
        };
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        setItem((previousItem) => (
            { ...previousItem, quantity: value }
        ));
    };

    const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTransaction((previousTransaction) => (
            { ...previousTransaction, pin: value }
        ));
    };

    const addItem = () => {
        if (item.product.name && item.quantity) {
            setTransaction((previousData) => {
                const items = previousData.items;
                const object = items.find((object) => object.product.name === item.product.name);

                if (object) {
                    object.quantity += item.quantity;
                } else {
                    items.push({ ...item });
                }

                previousData.totalAmount += Number(item.product.amount) * item.quantity;

                return { ...previousData };
            });
        }
        setItem(emptyProduct);
    };

    const removeItem = (index: number) => {
        setTransaction((previousData) => {
            const object = previousData.items.splice(index, 1)[0];

            previousData.totalAmount -= Number(object.product.amount) * object.quantity;

            return { ...previousData };
        });
    };

    const updateQuantity = (index: number, change: number) => {
        setTransaction((previousData) => {
            let object: Item;
            const quantity = Number(previousData.items[index].quantity) + change;

            if (!quantity) {
                object = previousData.items.splice(index, 1)[0];
            } else {
                object = previousData.items[index];
            }

            object.quantity = quantity;
            previousData.totalAmount += Number(object.product.amount) * change;

            return { ...previousData };
        });
    };

    const handleTransaction = () => {
        let record: TransactionBody = {
            student: transaction.student,
            pin: transaction.pin,
            items: transaction.items.map((object) => ({
                product: object.product.name,
                quantity: object.quantity
            }))
        };

        if (access) {
            mutation.mutate({ access: access, transaction: record });
        }
    };

    const getErrorMessage = () => {
        let error = "";
        const status = mutation.error?.response.status;

        if (mutation.error && mutation.error.response.message && status === "bad request") {
            let message: TransactionValidationError = mutation.error.response.message;

            if (message.non_field_errors) {
                error += message.non_field_errors.map((object) => object.message).join(" ") + "\n";
            }

            if (message.student) {
                error += "Student: " + message.student.map((object) => object.message).join(" ") + "\n";
            }

            if (message.pin) {
                error += "Pin: " + message.pin.map((object) => object.message).join(" ") + " ";
            }

            if (message.items) {
                message.items.forEach((object) => {
                    if (object.product) {
                        error += "Product: " + object.product.map((object) => object.message).join(" ") + "\n";
                    }

                    if (object.quantity) {
                        error += "Quantity: " + object.quantity.map((object) => object.message).join(" ") + "\n";
                    }
                });
            }

        } else if (mutation.error && mutation.error.response.message && status === "not found") {
            let message: string = mutation.error.response.message;

            error += message;
        } else {
            error = "Something Went Wrong!";
        }

        return error;
    };

    const handleQrScan = (data: string | null) => {
        if (data) {
            setTransaction(previousData => ({
                ...previousData,
                student: data,
            }));
        }
    }

    const handleQrError = (err: any) => {
        console.log(err);
    }

    return (
        <Container maxWidth="lg" sx={{ mt: '24px' }}>
            <Typography gutterBottom color="GrayText" variant="h4" component="div" fontWeight="bold">
                {category[0].toUpperCase() + category.slice(1)}
            </Typography>

            <Divider />

            {mutation.isError &&
                <Alert severity="error" sx={{ mt: '16px' }}>
                    {getErrorMessage()}
                </Alert>
            }

            {mutation.isSuccess &&
                <Alert severity="success" sx={{ mt: '16px' }}>
                    Transaction was Successful!
                </Alert>
            }

            <Grid container spacing={1} mt="8px">
                <Grid item md={8} xs={12}>
                    <Box px="5px" py="15px" component={Paper} elevation={3} display="flex" justifyContent="flex-start" alignItems="center">
                        <Autocomplete
                            options={data ? data.data : []}
                            getOptionLabel={item => item.name}
                            onChange={handleProductChange}
                            value={item.product}
                            isOptionEqualToValue={
                                (option, value) => option.name === value.name || value.name === ""
                            }
                            renderInput={
                                (params) => <TextField
                                    {...params}
                                    placeholder="Product"
                                    name="product"
                                    size="small"
                                />
                            }
                            sx={{ width: "250px", marginRight: "10px" }}
                        />
                        <TextField
                            name="quantity"
                            placeholder="Quantity"
                            type="number"
                            inputProps={{
                                min: 0,
                                step: 1,
                            }}
                            size="small"
                            value={item.quantity}
                            onChange={handleQuantityChange}
                        />
                        <Button variant="contained" color="secondary" onClick={addItem}>Add</Button>
                    </Box>

                    {isLoading && <LinearProgress color="secondary" />}

                    <Box p="16px" mt="8px" component={Paper} elevation={3}>
                        <ProductList data={transaction} updateQuantity={updateQuantity} removeItem={removeItem} />
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="body1" color="whitesmoke">Total Amount: ₹ {transaction.totalAmount}</Typography>
                            <Button variant="contained" color="primary" onClick={handleTransaction}>Buy</Button>
                        </Box>
                    </Box>

                </Grid>

                <Grid item md={4} xs={12}>
                    <Box px="16px" py="26.5px" elevation={3} component={Paper}>
                        <ButtonGroup fullWidth>
                            <Button variant="contained" color="warning" onClick={() => setScan(true)}>Scan ID</Button>
                            <Button variant="outlined" color="warning" onClick={() => setScan(false)}>Stop Scan</Button>
                        </ButtonGroup>
                        {scan &&
                            <QrReader
                                delay={300}
                                onScan={handleQrScan}
                                onError={handleQrError}
                                style={{ marginTop: '16px' }}
                            />
                        }
                        <MuiTextField
                            fullWidth
                            autoFocus
                            autoComplete="off"
                            placeholder="PIN"
                            size="small"
                            type="password"
                            value={transaction.pin}
                            onChange={handlePinChange}
                            sx={{ mt: '16px' }}
                        />
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
}

export default Dashboard;