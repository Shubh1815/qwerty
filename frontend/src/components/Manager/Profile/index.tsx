import React from "react";
import { Container, Grid, Paper, Typography, TextField } from "@mui/material";

import useAuth from "../../../hooks/useAuth";
import { TypeFormatFlags } from "typescript";

const Profile: React.FC = () => {

    const { user } = useAuth();

    return (
        <Container maxWidth="lg" sx={{ my: '24px' }}>

            {user &&
                <React.Fragment>
                    <Grid
                        container
                        component={Paper}
                        elevation={4}
                        maxWidth="sm"
                        mt="24px"
                        p="16px"
                    >
                        <Typography gutterBottom variant="h5" color="lightgray" fontWeight="bold">User Info</Typography>

                        <Grid
                            container
                            alignItems="center"
                            justifyContent="flex-start"
                            mt="12px"
                        >
                            <Grid item xs={3} component={Typography} variant="body1" color="white">
                                Email
                            </Grid>
                            <Grid item xs={9}>
                                <TextField
                                    disabled
                                    fullWidth
                                    value={user.email}
                                    size="small"
                                />
                            </Grid>
                        </Grid>

                        <Grid
                            container
                            alignItems="center"
                            justifyContent="flex-start"
                            mt="12px"
                        >
                            <Grid item xs={3} component={Typography} variant="body1" color="white">
                                First Name
                            </Grid>
                            <Grid item xs={9}>
                                <TextField
                                    disabled
                                    fullWidth
                                    value={user.first_name}
                                    size="small"
                                />
                            </Grid>
                        </Grid>

                        <Grid
                            container
                            alignItems="center"
                            justifyContent="flex-start"
                            mt="12px"
                        >
                            <Grid item xs={3} component={Typography} variant="body1" color="white">
                                Last Name
                            </Grid>
                            <Grid item xs={9}>
                                <TextField
                                    disabled
                                    fullWidth
                                    value={user.last_name}
                                    size="small"
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </React.Fragment>
            }

        </Container>
    );
};

export default Profile;