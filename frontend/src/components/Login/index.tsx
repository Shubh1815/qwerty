import React from 'react';
import { Redirect } from 'react-router-dom';
import { useMutation } from 'react-query';

import { Box, Grid, Alert } from '@mui/material';
import { TextField as MuiTextField, Button, LinearProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/system';

import { BsShieldLock } from 'react-icons/bs';

import { login, TokenResponse, LoginErrorResponse } from '../../api/';
import useAuth from '../../hooks/useAuth';
import useToken from '../../hooks/useToken';

const TextField = styled(MuiTextField)(({ theme }) => ({
    '& label.MuiInputLabel-root': {
        color: theme.palette.grey[400],
    },
    '& label.MuiInputLabel-root.Mui-focused': {
        color: theme.palette.secondary.light,
    },
    '& .MuiFilledInput-root': {
        '& input': {
            color: theme.palette.grey[200],
        },
        '&:after': {
            borderBottomColor: theme.palette.secondary.light,
        },
        '&:before': {
            borderBottomColor: theme.palette.grey[200],
        },
        '&:hover:not(.Mui-disabled):before': {
            borderBottomColor: theme.palette.grey[400],
        }
    },
}));


const styles = {
    wrapper: {
        'flexGrow': 1,
        'height': 'calc(100vh - 65px)',
    },
}


const Login: React.FC = () => {

    const theme = useTheme();
    const { access } = useToken();
    const { logIn } = useAuth();

    const { mutate, isLoading, error } = useMutation<TokenResponse, LoginErrorResponse, FormData>(login, {
        onSuccess: (data) => {
            logIn(data.access, data.refresh);
        },
        onError: (err) => { console.log(err) },
        retry: false
    });

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate(new FormData(e.currentTarget));
    }

    if (access) {
        return <Redirect to="/dashboard" />
    }

    return (
        <Box display="flex" sx={styles.wrapper} justifyContent="center" alignItems="center">
            <Grid
                container
                bgcolor="#2d3035"
                boxShadow={5}
                component="form"
                maxWidth="500px"
                margin="12px"
                padding="32px"
                justifyContent="center"
                rowSpacing={2}
                onSubmit={handleLogin}
            >
                <Grid item xs={12} display="flex" justifyContent="center" marginBottom="24px">
                    <BsShieldLock size="96px" color={theme.palette.secondary.main} />
                </Grid>
                {
                    error && error.response.detail &&
                    <Grid item xs={12}>
                        <Alert severity="error" >{error.response.detail}</Alert>
                    </Grid>
                }
                <Grid item xs={12}>
                    <TextField
                        autoFocus
                        fullWidth
                        required
                        error={Boolean(error && error.response.email)}
                        helperText={error && error.response.email && error.response.email.join(" ")}
                        label="Email"
                        name="email"
                        variant="filled"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        required
                        error={Boolean(error && error.response.password)}
                        helperText={error && error.response.password && error.response.password.join(" ")}
                        label="Password"
                        name="password"
                        type="password"
                        variant="filled"
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="secondary" size="large" fullWidth>Log In</Button>
                    {isLoading && <LinearProgress color="secondary" />}
                </Grid>
            </Grid>
        </Box>
    );
};

export default Login;
