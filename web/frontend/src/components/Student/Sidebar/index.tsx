import React from "react";
import { Link, useLocation } from 'react-router-dom';
import { Drawer as MuiDrawer, List as MuiList, ListItem, ListItemText, ListItemIcon, ListSubheader } from '@mui/material';
import { Divider } from '@mui/material';
import { BsHouse, BsBarChartLine, BsGraphDown, BsPerson, BsWallet, BsKey } from 'react-icons/bs';
import { styled } from '@mui/material/styles';


interface Props {
    open: boolean,
    closeSideBar: () => void,
}

const sidebarWidth = "275px";

const Drawer = styled(MuiDrawer)(
    {
        boxSizing: 'border-box',
        flexShrink: 0,
        top: '64px',
        whiteSpace: 'nowrap',
        width: sidebarWidth,
        '& .MuiBackdrop-root': {
            top: '64px',
        },
        '& .MuiDrawer-paper': {
            backgroundColor: "#2d3035",
            boxSizing: 'border-box',
            width: sidebarWidth,
            height: "calc(100% - 64px)",
            top: "64px",
        },
    },
);

const List = styled(MuiList)(({ theme }) => ({
    '& .MuiListSubheader-root': {
        backgroundColor: "#2d3035",
        color: theme.palette.grey[700],
        fontSize: "20px",
        fontWeight: "bold",
    },
    '& .MuiListItem-root': {
        color: "#a0a0a0",
        '&.Mui-selected': {
            backgroundColor: "#04040426",
            boxShadow: `inset 2px 0 0 0 ${theme.palette.secondary.light}`,
            '& .MuiListItemIcon-root': {
                color: theme.palette.secondary.light,
            }
        },
    },
    '& .MuiListItemIcon-root': {
        color: theme.palette.grey[700],
    },
    '& .MuiDivider-root': {
        borderColor: theme.palette.grey[700],
        marginRight: "16px",
    }
}));

const SideBar: React.FC<Props> = ({ open, closeSideBar }) => {

    const location = useLocation();

    const isSelected = (links: string[]) => {
        let current = location.pathname;

        if (current[current.length - 1] !== '/') {
            current += '/';
        }
        return links.some(link => link === current);
    };

    return (
        <Drawer
            anchor="left"
            variant="temporary"
            open={open}
            onBackdropClick={closeSideBar}
            elevation={0}
        >
            <List>
                <ListSubheader>Main</ListSubheader>
                <ListItem
                    button
                    selected={isSelected(["/dashboard/"])}
                    component={Link}
                    to="/dashboard/"
                    onClick={closeSideBar}
                >
                    <ListItemIcon><BsHouse size="24px" color="inherit" /></ListItemIcon>
                    <Divider orientation="vertical" variant="middle" flexItem />
                    <ListItemText primary="Home" />
                </ListItem>
                <ListItem
                    button
                    selected={isSelected(["/tracker/expense/"])}
                    component={Link}
                    to="/tracker/expense/"
                    onClick={closeSideBar}
                >
                    <ListItemIcon><BsBarChartLine size="24px" color="inherit" /></ListItemIcon>
                    <Divider orientation="vertical" variant="middle" flexItem />
                    <ListItemText primary="Expense Tracker" />
                </ListItem>
                <ListItem
                    button
                    selected={isSelected(["/tracker/calorie/"])}
                    component={Link}
                    to="/tracker/calorie/"
                    onClick={closeSideBar}
                >
                    <ListItemIcon><BsGraphDown size="24px" color="inherit" /></ListItemIcon>
                    <Divider orientation="vertical" variant="middle" flexItem />
                    <ListItemText primary="Calorie Tracker" />
                </ListItem>
            </List>

            <List>
                <ListSubheader>User</ListSubheader>
                <ListItem
                    button
                    selected={isSelected(["/profile/"])}
                    component={Link}
                    to="/profile/"
                    onClick={closeSideBar}
                >
                    <ListItemIcon><BsPerson size="24px" color="inherit" /></ListItemIcon>
                    <Divider orientation="vertical" variant="middle" flexItem />
                    <ListItemText primary="Profile" />
                </ListItem>
                <ListItem button>
                    <ListItemIcon><BsWallet size="24px" color="inherit" /></ListItemIcon>
                    <Divider orientation="vertical" variant="middle" flexItem />
                    <ListItemText primary="Wallet" />
                </ListItem>
                <ListItem
                    button
                    selected={isSelected(["/password/change/"])}
                    component={Link}
                    to="/password/change/"
                    onClick={closeSideBar}
                >
                    <ListItemIcon><BsKey size="24px" color="inherit" /></ListItemIcon>
                    <Divider orientation="vertical" variant="middle" flexItem />
                    <ListItemText primary="Change Password" />
                </ListItem>
            </List>
        </Drawer>
    );
};

export default SideBar;