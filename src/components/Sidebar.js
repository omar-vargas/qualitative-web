import React, { useState } from "react";
import { SidebarData } from "./SidebarData";
import { useNavigate, useLocation } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Divider,
  Typography,
  Box
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const drawerWidth = 280;

function Sidebar() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { clearSession } = useSession();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleItemClick = (link) => {
    if (link === "/logout") {
      // Clear session and local data
      clearSession();
      localStorage.clear(); // Clear all localStorage data
      navigate("/");
    } else {
      navigate(link);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? drawerWidth : 60,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : 60,
            boxSizing: 'border-box',
            backgroundColor: '#f5f5f5',
            borderRight: '1px solid #e0e0e0',
            transition: 'width 0.3s ease',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', padding: '8px', justifyContent: open ? 'space-between' : 'center' }}>
          {open && (
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              🧪 Qualicode  Evaluación Cualitativa Asistida por Agentes
            </Typography>
          )}
          <IconButton onClick={handleDrawerToggle}>
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
        </Box>
        <Divider />
        <List>
          {SidebarData.map((item, index) => (
            <Tooltip key={index} title={open ? '' : item.description} placement="right">
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleItemClick(item.link)}
                  selected={location.pathname === item.link}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    '&.Mui-selected': {
                      backgroundColor: '#e3f2fd',
                      '&:hover': {
                        backgroundColor: '#bbdefb',
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {open && <ListItemText primary={item.title} secondary={item.description} />}
                </ListItemButton>
              </ListItem>
            </Tooltip>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}

export default Sidebar;
