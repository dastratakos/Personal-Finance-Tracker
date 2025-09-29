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
  CircularProgress,
  Alert,
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
} from "@mui/icons-material";
import { useState, useEffect } from "react";

interface DashboardData {
  netWorth: number;
  monthlySpend: number;
  topCategories: Array<{ category: string; amount: number }>;
  spendByCategory: Record<string, number>;
  monthlyTrends: Array<{
    month: string;
    spend: number;
    income: number;
    net: number;
  }>;
  accountBreakdown: Record<string, number>;
  totalTransactions: number;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/dashboard");
      if (!response.ok) throw new Error("Failed to fetch dashboard data");

      const dashboardData = await response.json();
      setData(dashboardData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load dashboard data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <Container maxWidth="xl" sx={{ py: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
            }}
          >
            <CircularProgress />
          </Box>
        </Container>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Container maxWidth="xl" sx={{ py: 2 }}>
          <Alert severity="error">{error}</Alert>
        </Container>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout>
        <Container maxWidth="xl" sx={{ py: 2 }}>
          <Alert severity="info">
            No data available. Import some CSV files to see your financial
            overview.
          </Alert>
        </Container>
      </Layout>
    );
  }
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
                  $
                  {data.netWorth.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
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
                  $
                  {data.monthlySpend.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
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
                  {data.topCategories[0]?.category || "No data yet"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Top Category
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={data.topCategories[0] ? 100 : 0}
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
                  {data.totalTransactions}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Transactions
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, (data.totalTransactions / 1000) * 100)}
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
                {Object.keys(data.spendByCategory).length > 0 ? (
                  <Box sx={{ width: "100%", height: "100%" }}>
                    {Object.entries(data.spendByCategory)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map(([category, amount], index) => (
                        <Box key={category} sx={{ mb: 2 }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 1,
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              {category}
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              ${amount.toFixed(2)}
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={
                              (amount /
                                Math.max(
                                  ...Object.values(data.spendByCategory)
                                )) *
                              100
                            }
                            sx={{ height: 8, borderRadius: 4 }}
                            color="primary"
                          />
                        </Box>
                      ))}
                  </Box>
                ) : (
                  <Box sx={{ textAlign: "center" }}>
                    <CategoryIcon
                      sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
                    />
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                    >
                      No data available
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Import some CSV files to see your spending breakdown.
                    </Typography>
                  </Box>
                )}
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
                {data.monthlyTrends.length > 0 ? (
                  <Box sx={{ width: "100%", height: "100%" }}>
                    {data.monthlyTrends.map((trend, index) => (
                      <Box key={trend.month} sx={{ mb: 2 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 1,
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            {new Date(trend.month + "-01").toLocaleDateString(
                              "en-US",
                              { month: "short", year: "numeric" }
                            )}
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            ${trend.spend.toFixed(2)}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={
                            (trend.spend /
                              Math.max(
                                ...data.monthlyTrends.map((t) => t.spend)
                              )) *
                            100
                          }
                          sx={{ height: 8, borderRadius: 4 }}
                          color="secondary"
                        />
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Box sx={{ textAlign: "center" }}>
                    <TrendingUpIcon
                      sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
                    />
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                    >
                      No data available
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Import some CSV files to see your monthly spending trends.
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
}
