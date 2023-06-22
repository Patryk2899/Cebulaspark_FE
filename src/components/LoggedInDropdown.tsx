import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import * as React from "react";

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function LoggedInDropdown() {

    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    return (
       <div>
           <Tooltip title="Open settings">
               <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                   <AccountCircleIcon fontSize="large"/>
               </IconButton>
           </Tooltip>
           <Menu
               sx={{ mt: '45px' }}
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
               {settings.map((setting) => (
                   <MenuItem key={setting} onClick={handleCloseUserMenu}>
                       <Typography textAlign="center">{setting}</Typography>
                   </MenuItem>
               ))}
           </Menu>
       </div>
    )
}

export default LoggedInDropdown