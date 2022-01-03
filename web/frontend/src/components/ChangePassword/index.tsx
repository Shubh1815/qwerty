import React from "react";
import { Alert, Box, Button, Container, Divider, Grid, LinearProgress, Paper, TextField, Typography } from "@mui/material";

import useToken from "../../hooks/useToken";
import useAuthMutation from "../../hooks/useAuthMutate";
import { changePassword, ChangePasswordSuccessResponse, ChangePasswordErrorResponse } from "../../api";

interface MutationVariables {
    access: string | null,
    payload: {
        old_password: string,
        password: string,
        password2: string
    }
}

const ChangePassword: React.FC = () => {

    const { access, setTokens } = useToken();

    const { mutate, data, error, isLoading } = useAuthMutation<
        ChangePasswordSuccessResponse,
        ChangePasswordErrorResponse,
        MutationVariables
    >((params) => changePassword(params.access, params.payload), {
        onSuccess: (data) => {
            setTokens(data.data);
        }
    })

    const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const data = new FormData(e.currentTarget);

        const old_password = data.get('old_password');
        const password = data.get('password');
        const password2 = data.get('password2');

        const payload = {
            old_password: old_password ? String(old_password) : "",
            password: password ? String(password) : "",
            password2: password2 ? String(password2) : "",
        }

        mutate({ access, payload });
    }

    return (
        <Container maxWidth="lg" sx={{ mt: '24px' }}>

            <Typography gutterBottom variant="h4" color="GrayText" fontWeight="bold">
                Change Password
            </Typography>

            <Divider />

            {isLoading && <LinearProgress />}

            {!isLoading &&
                <Box mt="24px">
                    {data &&
                        <Alert severity="success">Password Changed Successfully!</Alert>
                    }
                    {error && error.response.message && error.response.message.non_field_errors &&
                        <Alert severity="error">{error.response.message.non_field_errors.map(obj => obj.message).join(" ")}</Alert>
                    }
                </Box>
            }
            <Paper component="form" onSubmit={handleForm} sx={{ p: "24px 24px 8px 24px", my: "16px" }}>
                <Grid container>
                    <Grid item xs={12} md={6} mb="16px">
                        <TextField
                            autoFocus
                            fullWidth
                            required
                            label="Current Password"
                            name="old_password"
                            type="password"
                            error={Boolean(error && error.response.message?.old_password)}
                            helperText={error && error.response.message?.old_password?.map(obj => obj.message).join(" ")}
                        />
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} md={6} mb="16px">
                        <TextField
                            fullWidth
                            required
                            label="New Password"
                            name="password"
                            type="password"
                            error={Boolean(error && error.response.message?.password)}
                            helperText={error && error.response.message?.password?.map(obj => obj.message).join(" ")}
                        />
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} md={6} mb="16px">
                        <TextField
                            fullWidth
                            required
                            label="Confirm Password"
                            name="password2"
                            type="password"
                            error={Boolean(error && error.response.message?.password2)}
                            helperText={error && error.response.message?.password2?.map(obj => obj.message).join(" ")}
                        />
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} md={6} mb="16px">
                        <Button color="success" variant="contained" type="submit">Change Password</Button>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
}

export default ChangePassword;