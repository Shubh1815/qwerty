import React from "react";
import { useLocation } from "react-router-dom";
import { useMutation } from "react-query";
import { Alert, Button, Container, Divider, Grid, Input, Paper, TextField, Typography } from "@mui/material";

import { resetPin, ResetPinSuccessResponse, ResetPinErrorResponse } from "../../../api";

function useURLParams() {
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}


const ResetPin: React.FC = () => {

    const query = useURLParams();
    const { mutate, data, error, isLoading } = useMutation<
        ResetPinSuccessResponse,
        ResetPinErrorResponse,
        FormData
    >((formData) => resetPin(formData));


    const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        mutate(formData);
    }


    return (
        <Container maxWidth="lg" sx={{ mt: '24px' }}>
            <Typography gutterBottom variant="h4" color="GrayText" fontWeight="bold">Reset Pin</Typography>
            <Divider />

            <Container maxWidth="sm" sx={{ my: "24px", "mx": 0, "px": 0 }} >
                <Paper component="form" onSubmit={handleForm} sx={{ p: "24px 24px 8px 24px" }}>
                    {!isLoading &&
                        <Grid container>
                            <Grid item xs={12} mb="16px">
                                {data && <Alert severity="success">{data.data}</Alert>}
                                {error && error.response.message.non_field_errors &&
                                    <Alert severity="error">{error.response.message.non_field_errors.map(obj => obj.message).join(" ")}</Alert>
                                }
                            </Grid>
                        </Grid>
                    }

                    <Input
                        type="hidden"
                        name="key"
                        value={query.get("key") ? query.get("key") : ""}
                    />

                    <Grid container>
                        <Grid item xs={12} mb="16px">
                            <TextField
                                fullWidth
                                required
                                autoComplete="off"
                                label="Pin"
                                name="pin"
                                type="password"
                                error={Boolean(error && error.response.message.pin)}
                                helperText={error?.response.message.pin?.map(obj => obj.message).join(" ")}
                            />
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12} mb="16px">
                            <TextField
                                fullWidth
                                required
                                autoComplete="off"
                                label="Confirm Pin"
                                name="pin2"
                                type="password"
                                error={Boolean(error && error.response.message.pin2)}
                                helperText={error?.response.message.pin2?.map(obj => obj.message).join(" ")}
                            />
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12} mb="16px">
                            <Button fullWidth color="success" variant="contained" type="submit">Reset Pin</Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </Container>
    );
}

export default ResetPin;