import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function DashboardStats() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://video-ads-api.onrender.com/api/ads")
      .then((res) => {
        setAds(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading ads:", err);
        setLoading(false);
      });
  }, []);

  const totalAds = ads.length;
  const totalImpressions = ads.reduce((sum, ad) => sum + ad.impressions, 0);
  const totalClicks = ads.reduce((sum, ad) => sum + ad.clicks, 0);
  const avgCtr =
    totalImpressions === 0
      ? 0
      : ((totalClicks / totalImpressions) * 100).toFixed(2);

  const REVENUE_PER_CLICK = 0.5;
  const CPM = 5;
  const revenueFromClicks = totalClicks * REVENUE_PER_CLICK;
  const revenueFromImpressions = (totalImpressions / 1000) * CPM;
  const totalRevenue = revenueFromClicks + revenueFromImpressions;

  const topImpressions = [...ads]
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 10);

  const impressionsData = {
    labels: topImpressions.map((ad) => ad.title),
    datasets: [
      {
        label: "Impressions",
        data: topImpressions.map((ad) => ad.impressions),
        backgroundColor: "#2196F3",
      },
    ],
  };

  const ctrSorted = [...ads]
    .filter((ad) => ad.impressions > 0)
    .map((ad) => ({
      ...ad,
      ctr: parseFloat(((ad.clicks / ad.impressions) * 100).toFixed(2)),
    }))
    .sort((a, b) => b.ctr - a.ctr)
    .slice(0, 10);

  const ctrData = {
    labels: ctrSorted.map((ad) => ad.title),
    datasets: [
      {
        label: "CTR (%)",
        data: ctrSorted.map((ad) => ad.ctr),
        backgroundColor: "#FFA726",
      },
    ],
  };

  const monthsOfYear = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(2025, i, 1);
    return date.toLocaleString("en-US", { month: "long" });
  });

  const clicksByMonth = Object.fromEntries(monthsOfYear.map((m) => [m, 0]));

  ads.forEach((ad) => {
    const date = new Date(ad.createdAt);
    const month = date.toLocaleString("en-US", { month: "long" });
    clicksByMonth[month] += ad.clicks;
  });

  const clicksPerMonthData = {
    labels: monthsOfYear,
    datasets: [
      {
        label: "Clicks per Month",
        data: monthsOfYear.map((m) => clicksByMonth[m]),
        backgroundColor: "#fff",
        borderColor: "#7E57C2",
        fill: false,
      },
    ],
  };

  const topClickedAds = [...ads]
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5);

  const topClicksData = {
    labels: topClickedAds.map((ad) => ad.title),
    datasets: [
      {
        label: "Clicks",
        data: topClickedAds.map((ad) => ad.clicks),
        backgroundColor: "#F44336",
      },
    ],
  };

  const categoryCount = ads.reduce((acc, ad) => {
    acc[ad.category] = (acc[ad.category] || 0) + 1;
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(categoryCount),
    datasets: [
      {
        label: "Ads per Category",
        data: Object.values(categoryCount),
        backgroundColor: [
          "#2196F3",
          "#4CAF50",
          "#FFC107",
          "#009688",
          "#9C27B0",
          "#F44336",
        ],
      },
    ],
  };

  const clicksByHour = Array.from({ length: 24 }, () => 0);

  ads.forEach((ad) => {
    if (ad.clickTimestamps) {
      ad.clickTimestamps.forEach((timestamp) => {
        const hour = new Date(timestamp).getHours();
        clicksByHour[hour]++;
      });
    }
  });

  const clicksPerHourData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: "Clicks per Hour",
        data: clicksByHour,
        backgroundColor: "#4dd0e1",
        borderColor: "#00838f",
        fill: true,
      },
    ],
  };

  const commonCardStyle = {
    backgroundColor: "background.paper",
    p: 2,
    width: "1000px",
  };

  return (
    <Box sx={{ px: 3, py: 4 }}>
      <Typography variant="h4" sx={{ textAlign: "center", mb: 4 }}>
        Statistics Overview
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Summary Cards */}
          <Grid container spacing={2} justifyContent="center" sx={{ mb: 4 }}>
            <Grid item>
              <Card
                sx={{
                  minWidth: 200,
                  backgroundColor: "#37474F",
                  color: "#fff",
                }}
              >
                <CardContent>
                  <Typography variant="subtitle1">Total Ads</Typography>
                  <Typography variant="h4">{totalAds}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item>
              <Card
                sx={{
                  minWidth: 200,
                  backgroundColor: "#1976D2",
                  color: "#fff",
                }}
              >
                <CardContent>
                  <Typography variant="subtitle1">Total Impressions</Typography>
                  <Typography variant="h4">{totalImpressions}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item>
              <Card
                sx={{
                  minWidth: 200,
                  backgroundColor: "#388E3C",
                  color: "#fff",
                }}
              >
                <CardContent>
                  <Typography variant="subtitle1">Total Clicks</Typography>
                  <Typography variant="h4">{totalClicks}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item>
              <Card
                sx={{
                  minWidth: 200,
                  backgroundColor: "#F57C00",
                  color: "#fff",
                }}
              >
                <CardContent>
                  <Typography variant="subtitle1">Avg. CTR (%)</Typography>
                  <Typography variant="h4">{avgCtr}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item>
              <Card
                sx={{
                  minWidth: 200,
                  backgroundColor: "#00695C",
                  color: "#fff",
                }}
              >
                <CardContent>
                  <Typography variant="subtitle1">
                    Revenue from Clicks
                  </Typography>
                  <Typography variant="h4">
                    ${revenueFromClicks.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item>
              <Card
                sx={{
                  minWidth: 200,
                  backgroundColor: "#512DA8",
                  color: "#fff",
                }}
              >
                <CardContent>
                  <Typography variant="subtitle1">
                    Revenue from Views
                  </Typography>
                  <Typography variant="h4">
                    ${revenueFromImpressions.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item>
              <Card
                sx={{
                  minWidth: 200,
                  backgroundColor: "#B71C1C",
                  color: "#fff",
                }}
              >
                <CardContent>
                  <Typography variant="subtitle1">Total Revenue</Typography>
                  <Typography variant="h4">
                    ${totalRevenue.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts */}
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12}>
              <Card sx={commonCardStyle}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Top 10 Ads by Impressions
                  </Typography>
                  <Bar
                    data={impressionsData}
                    options={{ responsive: true, indexAxis: "x" }}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card sx={commonCardStyle}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Top 10 Ads by CTR
                  </Typography>
                  <Bar data={ctrData} options={{ responsive: true }} />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card sx={commonCardStyle}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Top 5 Ads by Clicks
                  </Typography>
                  <Bar data={topClicksData} options={{ responsive: true }} />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card sx={commonCardStyle}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Clicks per Month
                  </Typography>
                  <Line
                    data={clicksPerMonthData}
                    options={{ responsive: true }}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card sx={commonCardStyle}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Clicks per Hour
                  </Typography>
                  <Line
                    data={clicksPerHourData}
                    options={{ responsive: true }}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card sx={commonCardStyle}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Category Distribution
                  </Typography>
                  <Box
                    sx={{
                      height: "468px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Doughnut
                      data={pieData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: "right",
                            labels: { color: "#fff" },
                          },
                        },
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}

export default DashboardStats;
