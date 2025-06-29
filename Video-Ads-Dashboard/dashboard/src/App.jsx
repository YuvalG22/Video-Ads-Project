import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardAds from "./components/DashboardAds";
import DashboardStats from "./components/DashboardStats";
import AdsMap from "./components/AdsMap";
import TopBar from "./components/TopBar";
import CssBaseline from "@mui/material/CssBaseline";
import { Box } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./styles/theme";

const drawerWidth = 240;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: "flex" }}>
          <TopBar />

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 4,
              width: "100%",
            }}
          >
            <Routes>
              <Route path="/ads" element={<DashboardAds />} />
              <Route path="/stats" element={<DashboardStats />} />
              <Route path="/" element={<DashboardAds />} />
              <Route path="/adsmap" element={<AdsMap />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
