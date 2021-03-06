import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { QueryClient, QueryClientProvider } from 'react-query';
import { createTheme, ThemeProvider, LinearProgress } from '@mui/material';

import Navbar from './components/Navbar';
import Login from './components/Login';
import StudentDashboard from './components/Student/Dashboard';
import ManagerDashboard from './components/Manager/Dashboard';
import StudentProfile from './components/Student/Profile';
import ManagerProfile from './components/Manager/Profile';
import ChangePassword from './components/ChangePassword';
import ResetPin from './components/Student/ResetPin';
import { CalorieTracker, ExpenseTracker } from './components/Student/Tracker';

import AuthContext, { User } from './context/Auth';
import { getUser } from './api/';

const theme = createTheme({
    palette: {
        mode: "dark",
        secondary: {
            main: '#e94560',
            light: '#db6574',
        }
    },
})

const queryclient = new QueryClient();

function App() {

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [cookies, , removeCookie] = useCookies();

    useEffect(() => {
        if (!user && (cookies.access_token || cookies.refresh_token)) {
            setLoading(true);
            getUser(cookies.access_token)
                .then((res) => {
                    setUser(res.data);
                    setLoading(false);
                })
                .catch((err) => {
                    removeCookie('access_token');
                    setUser(null);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [cookies.access_token, cookies.refresh_token, user, removeCookie]);

    return (
        <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryclient}>
                <AuthContext.Provider value={{ user: user, setUser: setUser }}>
                    <Router>
                        <Navbar />
                        {loading ?
                            <LinearProgress color="secondary" /> :
                            <Switch>
                                <Route exact path="/" component={Login}></Route>
                                {user &&
                                    <Route exact path="/password/change/" component={ChangePassword} ></Route>
                                }
                                {user && user.role === "student" &&
                                    <React.Fragment>
                                        <Route exact path="/dashboard/" component={StudentDashboard}></Route>
                                        <Route exact path="/tracker/expense/" component={ExpenseTracker}></Route>
                                        <Route exact path="/tracker/calorie/" component={CalorieTracker}></Route>
                                        <Route exact path="/profile/" component={StudentProfile}></Route>
                                        <Route exact path="/student/reset/pin/" component={ResetPin}></Route>
                                    </React.Fragment>
                                }
                                {user && (user.role === "admin" || user.role === "manager") &&
                                    <React.Fragment>
                                        <Route
                                            exact
                                            path={["/dashboard/", "/dashboard/:category(canteen|stationary|transportation)/"]}
                                            component={ManagerDashboard}
                                        ></Route>
                                        <Route exact path="/profile/" component={ManagerProfile}></Route>
                                    </React.Fragment>
                                }
                            </Switch>
                        }
                    </Router>
                </AuthContext.Provider>
            </QueryClientProvider>
        </ThemeProvider>
    );
}

export default App;
