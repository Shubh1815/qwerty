import React from "react";
import { Container, Box, LinearProgress } from "@mui/material";
import { Typography, Divider, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ResponsiveContainer as ReChartsResponsiveContainer, LineChart, CartesianGrid, Line, XAxis, YAxis, Tooltip } from 'recharts';

import useAuthQuery from "../../../hooks/useAuthQuery";
import useToken from "../../../hooks/useToken";
import { getCalorie, CalorieResponse } from "../../../api";

const ResponsiveContainer = styled(ReChartsResponsiveContainer)({
    'marginTop': '32px',
});

export const CalorieTracker: React.FC = () => {

    const { access } = useToken();
    const [days, setDays] = React.useState<number>(7);

    const { data, isLoading } = useAuthQuery<CalorieResponse>(
        ['calorie', access, days],
        () => getCalorie(access, days)
    );

    return (
        <Container maxWidth="lg" sx={{ mt: '24px' }}>
            <Typography gutterBottom variant="h4" component="div" color="GrayText" fontWeight="bold">
                Calorie Tracker
            </Typography>

            <Divider />

            {isLoading && <LinearProgress color="secondary" />}

            <React.Fragment>
                <Box display="flex" justifyContent="flex-end" mt="24px">
                    <Select value={days} onChange={(e) => setDays(Number(e.target.value))} size="small">
                        <MenuItem value={7}>7 days</MenuItem>
                        <MenuItem value={30}>1 Month</MenuItem>
                    </Select>
                </Box>
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={data ? data.data : []} margin={{ left: 0, right: 0, top: 0, bottom: 20 }}>
                        <Line type="monotone" dataKey="calories" />
                        <CartesianGrid stroke="#ffffff1f" strokeDasharray="3 3" />
                        <XAxis
                            dataKey="date"
                            stroke="#fff"
                            label={{ fill: "#fff", value: "Date", position: "insideTopRight", dy: -30 }}
                            dy={20}
                        />
                        <YAxis
                            stroke="#fff"
                            label={{ fill: "#fff", value: "Calories", position: "insideTopLeft", dx: 65, dy: 5 }}
                            dx={-10}
                        />
                        <Tooltip />
                    </LineChart>
                </ResponsiveContainer>
            </React.Fragment>
        </Container>
    );
}