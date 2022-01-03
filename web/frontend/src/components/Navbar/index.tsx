import React, { useState } from 'react';
import { AppBar, Box, Toolbar } from '@mui/material';
import { Typography, Button, IconButton } from '@mui/material';
import { BiMenu } from 'react-icons/bi';

import StudentSidebar from '../Student/Sidebar';
import ManagerSideBar from '../Manager/Sidebar';
import useAuth from '../../hooks/useAuth';

const styles = {
    root: {
        bgcolor: '#2d3035',
    },
    brandName: {
        '& > span': {
            color: 'secondary.main',
        }
    },
    splitter: {
        flexGrow: 1,
    }
};


const Navbar: React.FC = () => {

    const [open, setOpen] = useState<boolean>(false);
    const { user, logOut } = useAuth();

    const toggleSideBar = () => {
        setOpen((val) => !val);
    }

    const closeSideBar = () => {
        setOpen(false);
    }

    return (
        <React.Fragment>
            <AppBar position="sticky" sx={styles.root}>
                <Toolbar>
                    {user &&
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={toggleSideBar}
                        >
                            <BiMenu />
                        </IconButton>
                    }
                    <Typography variant="h6" component="div" sx={styles.brandName}>
                        <span>QWE</span>RTY
                    </Typography>
                    <Box sx={styles.splitter} />
                    {user && <Button variant="contained" color="secondary" onClick={logOut}>Log out</Button>}
                </Toolbar>
            </AppBar>
            {user && user.role === "student" && <StudentSidebar open={open} closeSideBar={closeSideBar} />}
            {user && (user.role === "admin" || user.role === "manager") && <ManagerSideBar open={open} closeSideBar={closeSideBar} />}
        </React.Fragment>
    );
};

export default Navbar;