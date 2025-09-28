"use client";

import {
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Box,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Layout from "@/components/Layout";
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as AccountBalanceIcon,
  AttachMoney as AttachMoneyIcon,
  Category as CategoryIcon,
  Assessment as AssessmentIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";

export default function Dashboard() {
  return (
    <Layout>
      <Container maxWidth="xl" sx={{ py: 2 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            Financial Overview
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Track your spending, monitor budgets, and analyze your financial
            health.
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Tooltip title="Refresh data">
              <IconButton
                color="primary"
                sx={{
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": { bgcolor: "primary.dark" },
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export data">
              <IconButton
                color="secondary"
                sx={{
                  bgcolor: "secondary.main",
                  color: "secondary.contrastText",
                  "&:hover": { bgcolor: "secondary.dark" },
                }}
              >
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Key Metrics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                background: "linear-gradient(135deg, #00d4aa 0%, #00a085 100%)",
                color: "white",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "100px",
                  height: "100px",
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "50%",
                  transform: "translate(30px, -30px)",
                },
              }}
            >
              <CardContent sx={{ position: "relative", zIndex: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <AccountBalanceIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                  <Chip
                    label="+2.5%"
                    size="small"
                    sx={{ bgcolor: "rgba(255, 255, 255, 0.2)", color: "white" }}
                  />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  $0.00
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Net Worth
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                background: "linear-gradient(135deg, #ff6b6b 0%, #e55555 100%)",
                color: "white",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "100px",
                  height: "100px",
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "50%",
                  transform: "translate(30px, -30px)",
                },
              }}
            >
              <CardContent sx={{ position: "relative", zIndex: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <AttachMoneyIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                  <Chip
                    label="-5.2%"
                    size="small"
                    sx={{ bgcolor: "rgba(255, 255, 255, 0.2)", color: "white" }}
                  />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  $0.00
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Monthly Spend
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <CategoryIcon color="primary" sx={{ fontSize: 40 }} />
                  <TrendingUpIcon color="success" />
                </Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, mb: 1, color: "primary.main" }}
                >
                  No data yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Top Category
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={0}
                  sx={{ mt: 2, height: 6, borderRadius: 3 }}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <AssessmentIcon color="secondary" sx={{ fontSize: 40 }} />
                  <TrendingDownIcon color="warning" />
                </Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, mb: 1, color: "secondary.main" }}
                >
                  No budgets set
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Budget Progress
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={0}
                  color="secondary"
                  sx={{ mt: 2, height: 6, borderRadius: 3 }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: 400 }}>
              <CardHeader
                title="Spend by Category"
                titleTypographyProps={{ fontWeight: 600 }}
                action={
                  <Chip label="This Month" size="small" color="primary" />
                }
              />
              <CardContent
                sx={{
                  height: "calc(100% - 80px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box sx={{ textAlign: "center" }}>
                  <CategoryIcon
                    sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
                  />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No data available
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Import some CSV files to see your spending breakdown.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: 400 }}>
              <CardHeader
                title="Monthly Trends"
                titleTypographyProps={{ fontWeight: 600 }}
                action={
                  <Chip label="6 Months" size="small" color="secondary" />
                }
              />
              <CardContent
                sx={{
                  height: "calc(100% - 80px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box sx={{ textAlign: "center" }}>
                  <TrendingUpIcon
                    sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
                  />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No data available
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Import some CSV files to see your monthly spending trends.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
}
