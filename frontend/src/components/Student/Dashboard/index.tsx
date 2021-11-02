import React, { useState } from "react";
import { Container, Grid, Paper } from '@mui/material';
import { TableContainer, Table as MuiTable, TableHead, TableBody, TableRow, TableCell, TablePagination } from '@mui/material';
import { Typography, Divider, Alert, LinearProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

import ItemRow from "./itemRow";
import useAuth from "../../../hooks/useAuth";
import useToken from '../../../hooks/useToken';

import useAuthQuery from "../../../hooks/useAuthQuery";
import { getTransactions, TranscationResponse } from "../../../api";


const Table = styled(MuiTable)({
    '& thead th': {
        'color': '#cccccc',
        'fontWeight': 'bold',
    },
    'min-height': '300px',
});


const StudentDashboard: React.FC = () => {

    const [page, setPage] = useState<number>(0);

    const { user } = useAuth();
    const { access } = useToken();

    const { data, isLoading, isError } = useAuthQuery<TranscationResponse>(
        ['transaction', access, page + 1],
        () => getTransactions(access, page + 1),
        {
            keepPreviousData: true,
            staleTime: 5000,
        }
    );

    const onPageChange = (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => {
        setPage(page);
    };

    return (
        <Container>
            <Grid container mt="24px">
                <Grid item lg={6} xs={12} component={Paper} bgcolor="#2d3035" elevation={4} square>
                    <Typography p="16px" color="#cccccc" variant="h5" component="div">
                        {`Name: ${user?.first_name} ${user?.last_name}`}
                    </Typography>
                    <Divider variant="middle" />
                    <Typography p="16px" color="#cccccc" variant="h5" component="div">
                        {`Balance: ₹${user?.student_info?.balance}`}
                    </Typography>
                </Grid>
            </Grid>
            <Grid container mt="24px">
                <Grid item lg={8} xs={12}>
                    {isError && <Alert severity="error">Try Again! Something Went Wrong...</Alert>}
                    <TableContainer component={Paper} sx={{ bgcolor: "#2d3035", minHeight: "300px" }} elevation={5} square>
                        {isLoading && <LinearProgress color="secondary" />}
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">ID</TableCell>
                                    <TableCell align="center">Total Amount (₹)</TableCell>
                                    <TableCell align="center">Date</TableCell>
                                    <TableCell align="center"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    data && data.data.map((transaction, i) => (
                                        <ItemRow key={i} index={i + 1} data={transaction} />
                                    ))
                                }
                            </TableBody>
                        </Table>
                        {data &&
                            <TablePagination
                                rowsPerPageOptions={[10]}
                                component="div"
                                count={data.count ? data.count : -1}
                                rowsPerPage={data.data.length}
                                page={page}
                                onPageChange={onPageChange}
                            />
                        }
                    </TableContainer>

                </Grid>
            </Grid>
        </Container>
    );
};

export default StudentDashboard;