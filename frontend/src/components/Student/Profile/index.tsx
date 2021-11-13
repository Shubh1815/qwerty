import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useMutation } from "react-query";
import { Container, Grid, Paper, Typography, TextField, ButtonGroup, Button } from "@mui/material";

import useAuth from "../../../hooks/useAuth";
import { requestPinReset, RequestResetPinSuccessResponse, RequestResetPinErrorResponse } from "../../../api";

const Profile: React.FC = () => {

    const history = useHistory();
    const { user } = useAuth();

    const { mutate } = useMutation<
        RequestResetPinSuccessResponse,
        RequestResetPinErrorResponse,
        { email: string }
    >((params) => requestPinReset(params), {
        onSuccess: (data) => {
            history.push(`/student/reset/pin?key=${data.data.key}`);
        },
    });


    const handleRequestResetPin = () => {
        if (user) {
            mutate({ email: user.email });
        }
    };

    return (
        <Container maxWidth="lg" sx={{ my: '24px' }}>

            {user && user.student_info &&
                <React.Fragment>
                    <Grid
                        container
                        component={Paper}
                        elevation={4}
                        maxWidth="sm"
                        mt="24px"
                        p="16px"
                        rowSpacing={2}
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


                    <Grid
                        container
                        component={Paper}
                        elevation={4}
                        maxWidth="sm"
                        mt="24px"
                        p="16px"
                        rowSpacing={2}
                    >
                        <Typography gutterBottom variant="h5" color="lightgray" fontWeight="bold">Student Info</Typography>

                        <Grid
                            container
                            alignItems="center"
                            justifyContent="flex-start"
                            mt="12px"
                        >
                            <Grid item xs={3} component={Typography} variant="body1" color="white">
                                Batch
                            </Grid>
                            <Grid item xs={9}>
                                <TextField
                                    disabled
                                    fullWidth
                                    size="small"
                                    value={user.student_info.batch}
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
                                Enrollment No.
                            </Grid>
                            <Grid item xs={9}>
                                <TextField
                                    disabled
                                    fullWidth
                                    value={user.student_info.enrollment_no}
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
                                Balance
                            </Grid>
                            <Grid item xs={9}>
                                <TextField
                                    disabled
                                    fullWidth
                                    value={user.student_info.balance}
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
                                Pin
                            </Grid>
                            <Grid item xs={9}>
                                <ButtonGroup fullWidth color="primary">
                                    <Button component={Link} to="/password/change/">Change Pin</Button>
                                    <Button onClick={handleRequestResetPin}>Reset Pin</Button>
                                </ButtonGroup>
                            </Grid>
                        </Grid>
                    </Grid>
                </React.Fragment>
            }

        </Container>
    );
};

export default Profile;