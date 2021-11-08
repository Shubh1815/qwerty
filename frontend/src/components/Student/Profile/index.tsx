import React from "react";
import { Container, Grid, Paper, Typography, Divider, TextField } from "@mui/material";

import useAuth from "../../../hooks/useAuth";

const Profile: React.FC = () => {

    const { user } = useAuth();

    return (
        <Container maxWidth="lg" sx={{ my: '24px' }}>

            {user && user.student_info &&
                <React.Fragment>
                    <Grid container p="16px" mt="24px" rowSpacing={2} component={Paper} elevation={4}>
                        <Typography gutterBottom variant="h5" color="lightgray" fontWeight="bold">User Info</Typography>
                        <Grid container mt="12px" justifyContent="flex-start" alignContent="center" xs={12}>
                            <Grid item xs={2}>
                                <Typography mt="5px" variant="h6" color="white">Email</Typography>
                            </Grid>
                            <Grid item xs={10}>
                                <TextField
                                    disabled
                                    value={user.email}
                                    size="small"
                                />
                            </Grid>
                        </Grid>
                        <Grid container mt="12px" justifyContent="flex-start" alignContent="center" xs={12}>
                            <Grid item xs={2}>
                                <Typography mt="5px" variant="h6" color="white">First Name</Typography>
                            </Grid>
                            <Grid item xs={10}>
                                <TextField
                                    disabled
                                    value={user.first_name}
                                    size="small"
                                />
                            </Grid>
                        </Grid>
                        <Grid container mt="12px" justifyContent="flex-start" alignContent="center" xs={12}>
                            <Grid item xs={2}>
                                <Typography mt="5px" variant="h6" color="white">Last Name</Typography>
                            </Grid>
                            <Grid item xs={10}>
                                <TextField
                                    disabled
                                    value={user.last_name}
                                    size="small"
                                />
                            </Grid>
                        </Grid>
                    </Grid>


                    <Grid container p="16px" mt="24px" rowSpacing={2} component={Paper} elevation={4}>
                        <Typography gutterBottom variant="h5" color="lightgray" fontWeight="bold">Student Info</Typography>
                        <Grid container mt="12px" justifyContent="flex-start" alignContent="center" xs={12}>
                            <Grid item xs={2}>
                                <Typography mt="5px" variant="h6" color="white">Batch</Typography>
                            </Grid>
                            <Grid item xs={10}>
                                <TextField
                                    disabled
                                    value={user.student_info.batch}
                                    size="small"
                                />
                            </Grid>
                        </Grid>
                        <Grid container mt="12px" justifyContent="flex-start" alignContent="center" xs={12}>
                            <Grid item xs={2}>
                                <Typography mt="5px" variant="h6" color="white">Enrollment No.</Typography>
                            </Grid>
                            <Grid item xs={10}>
                                <TextField
                                    disabled
                                    value={user.student_info.enrollment_no}
                                    size="small"
                                />
                            </Grid>
                        </Grid>
                        <Grid container mt="12px" justifyContent="flex-start" alignContent="center" xs={12}>
                            <Grid item xs={2}>
                                <Typography mt="5px" variant="h6" color="white">Balance</Typography>
                            </Grid>
                            <Grid item xs={10}>
                                <TextField
                                    disabled
                                    value={user.student_info.balance}
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