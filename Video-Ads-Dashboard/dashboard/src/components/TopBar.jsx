import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Box, Typography } from "@mui/material";
import AdUnitsIcon from "@mui/icons-material/AdUnits";
import BarChartIcon from "@mui/icons-material/BarChart";
import MapIcon from "@mui/icons-material/Map";
import { Link, useLocation } from "react-router-dom";
import { icon } from "leaflet";

const drawerWidth = 240;

function TopBar() {
  const location = useLocation();

  const menuItems = [
    { text: "Ads", to: "/ads", icon: <AdUnitsIcon /> },
    { text: "Statistics", to: "/stats", icon: <BarChartIcon /> },
    { text: "Locations", to: "/adsmap", icon: <MapIcon /> }
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: 'background.default',
          color: 'text.primary',
        },
      }}
    >
      <Toolbar>
        <Typography variant="h5" color="primary.main" noWrap>
          Ads Dashboard
        </Typography>
      </Toolbar>
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={Link}
                to={item.to}
                selected={location.pathname === item.to}
              >
                <ListItemIcon sx={{ color: 'text.primary' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}

export default TopBar;
