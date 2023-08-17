import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { ReactComponent as Logo} from "../assets/CebulaSparkSmall.svg";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useState} from "react";
import {FormControl, InputLabel, Link, Select} from '@mui/material';
import  "../styles/navbar.css"
import axios from "axios";
import {PUBLIC_URL} from "../api/api-commons";
import {toast} from "react-toastify";

const pages = ['Products', 'Pricing', 'Blog'];

type sortByTitle = () => void;
type sortByNewest = () => void;
type sortByOldest = () => void;

interface NavbarProps {
    isLoggedIn: boolean;
    showSorting: boolean
    sortByTitle: sortByTitle;
    sortByNewest: sortByNewest;
    sortByOldest: sortByOldest;
}

const Navbar: React.FC<NavbarProps> = (props) => {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const navigate = useNavigate();

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleCreateBargain = () => {
        navigate('/bargain/create')
    }

    const handlePasswordChange = () => {
        axios.post(PUBLIC_URL + `${process.env.REACT_APP_PASSWORD_RESET}`, {}, {
            headers: {
                'content-type': 'application/json',
                accept: 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        })
            .then(response => {
                toast.info('Check your email')
            })
        setAnchorElUser(null);
    }

    const handleEmailChange = () => {
        navigate('/change/email')
        setAnchorElUser(null);
    }

    const handleLogout = () => {
        axios.post(PUBLIC_URL + `${process.env.REACT_APP_LOGOUT_URL}`, null, {
            headers: {
                'Authorization': localStorage.getItem('token'),
            }
        })
            .then( response => {
                localStorage.removeItem('token')
                navigate('/')
                toast.info('You have been logged out')
            })
        setAnchorElUser(null);
    }

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <IconButton
                        size="large"
                        href="/main"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleOpenNavMenu}
                        color="inherit"
                    >
                        <Logo className="navbar"/>
                    </IconButton>
                    <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                        {props.showSorting &&
                        <>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon/>
                        </IconButton>

                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: {xs: 'block', md: 'none'},
                            }}
                        >
                            <MenuItem key={5} onClick={props.sortByNewest}>
                                <Typography textAlign="center">Newest</Typography>
                            </MenuItem>
                            <MenuItem key={6} onClick={props.sortByOldest}>
                                <Typography textAlign="center">Oldest</Typography>
                            </MenuItem>
                            <MenuItem key={7} onClick={props.sortByTitle}>
                                <Typography textAlign="center">Sort by title</Typography>
                            </MenuItem>
                        </Menu>
                        </> }
                    </Box>
                        <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            href="/main"
                            sx={{
                                mr: 2,
                                display: {xs: 'flex', md: 'none'},
                                flexGrow: 1,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            CEBULASPARK
                        </Typography>
                    <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                        {props.showSorting && <>
                        <Button
                            key={5}
                            onClick={props.sortByNewest}
                            sx={{my: 2, color: 'white', display: 'block'}}
                        >
                            Newest
                        </Button>
                        <Button
                            key={5}
                            onClick={props.sortByOldest}
                            sx={{my: 2, color: 'white', display: 'block'}}
                        >
                            Oldest
                        </Button>
                        <Button
                            key={5}
                            onClick={props.sortByTitle}
                            sx={{my: 2, color: 'white', display: 'block'}}
                        >
                            Sort by title
                        </Button>
                        </> }
                    </Box>

                    <Box sx={{flexGrow: 0}}>
                        {props.isLoggedIn && <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                <AccountCircleIcon fontSize="large"/>
                            </IconButton>
                        </Tooltip>}
                        {props.isLoggedIn && <Menu
                            sx={{mt: '45px'}}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {
                                <div>
                                    <MenuItem key={1} onClick={handleCreateBargain}>
                                        <Typography textAlign="center">Create bargain</Typography>
                                    </MenuItem>
                                    <MenuItem key={2} onClick={handlePasswordChange}>
                                        <Typography textAlign="center">Change password</Typography>
                                    </MenuItem>
                                    <MenuItem key={3} onClick={handleEmailChange}>
                                        <Typography textAlign="center">Change email</Typography>
                                    </MenuItem>
                                    <MenuItem key={4} onClick={handleLogout}>
                                        <Typography textAlign="center">Logout</Typography>
                                    </MenuItem>
                                </div>
                            }
                        </Menu>}
                        {!props.isLoggedIn && <Button
                            onClick={() => {
                                navigate("/")
                            }}
                            variant="contained"
                            size="large"
                        >
                            Login
                        </Button>}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default Navbar;