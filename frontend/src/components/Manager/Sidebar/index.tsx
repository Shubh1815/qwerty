import React from "react";
import { Link, useLocation } from 'react-router-dom';
import { Drawer as MuiDrawer, List as MuiList, ListItem, ListItemText, ListItemIcon, ListSubheader } from '@mui/material';
import { Divider } from '@mui/material';
import { BsShopWindow, BsShop, BsPerson, BsKey } from 'react-icons/bs';
import { IoBusOutline } from 'react-icons/io5';
import { styled } from '@mui/material/styles';


interface Props {
    open: boolean,
}

const sidebarWidth = "275px";

const Drawer = styled(MuiDrawer)(
    {
        boxSizing: 'border-box',
        flexShrink: 0,
        whiteSpace: 'nowrap',
        width: sidebarWidth,
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
        '&.Mui-selected:hover': {
            backgroundColor: "#0404044a",
        }
    },
    '& .MuiListItemIcon-root': {
        color: theme.palette.grey[700],
    },
    '& .MuiDivider-root': {
        borderColor: theme.palette.grey[700],
        marginRight: "16px",
    }
}));

const SideBar: React.FC<Props> = ({ open }) => {

    const location = useLocation();
    const links = {
        canteen: ["/dashboard/", "/dashboard/canteen/"],
        stationary: ["/dashboard/stationary/"],
        transportion: ["/dashboard/transportation/"],
    }

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
            variant="persistent"
            open={open}
            elevation={3}
        >
            <List>
                <ListSubheader>Main</ListSubheader>
                <ListItem
                    button
                    component={Link}
                    selected={isSelected(links.canteen)}
                    to="/dashboard/canteen/"
                >
                    <ListItemIcon><BsShopWindow size="24px" color="inherit" /></ListItemIcon>
                    <Divider orientation="vertical" variant="middle" flexItem />
                    <ListItemText primary="Canteen" />
                </ListItem>
                <ListItem
                    button
                    component={Link}
                    selected={isSelected(links.stationary)}
                    to="/dashboard/stationary/"
                >
                    <ListItemIcon><BsShop size="24px" color="inherit" /></ListItemIcon>
                    <Divider orientation="vertical" variant="middle" flexItem />
                    <ListItemText primary="Stationary" />
                </ListItem>
                <ListItem
                    button
                    component={Link}
                    selected={isSelected(links.transportion)}
                    to="/dashboard/transportation/"
                >
                    <ListItemIcon><IoBusOutline size="24px" color="inherit" /></ListItemIcon>
                    <Divider orientation="vertical" variant="middle" flexItem />
                    <ListItemText primary="Transaportation" />
                </ListItem>
            </List>

            <List>
                <ListSubheader>User</ListSubheader>
                <ListItem button>
                    <ListItemIcon><BsPerson size="24px" color="inherit" /></ListItemIcon>
                    <Divider orientation="vertical" variant="middle" flexItem />
                    <ListItemText primary="Profile" />
                </ListItem>
                <ListItem button>
                    <ListItemIcon><BsKey size="24px" color="inherit" /></ListItemIcon>
                    <Divider orientation="vertical" variant="middle" flexItem />
                    <ListItemText primary="Change Password" />
                </ListItem>
            </List>
        </Drawer>
    );
};

export default SideBar;