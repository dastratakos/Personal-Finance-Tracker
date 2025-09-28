"use client";

import {
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Box,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  Alert,
} from "@mui/material";
import Layout from "@/components/Layout";
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as AccountBalanceIcon,
  Savings as SavingsIcon,
  CreditCard as CreditCardIcon,
  AttachMoney as AttachMoneyIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";

interface NetWorthData {
  currentNetWorth: number;
  previousNetWorth: number;
  change: number;
  changePercentage: number;
  accountBreakdown: Record<string, number>;
  monthlyTrends: Array<{
    month: string;
    netWorth: number;
    assets: number;
    liabilities: number;
  }>;
}

const timeRanges = ["1M", "3M", "6M", "1Y", "All"];
const accountTypes = ["All", "Bank", "Credit Card", "Investment", "Other"];

export default function NetWorth() {
  const [data, setData] = useState<NetWorthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState("6M");
  const [selectedAccountType, setSelectedAccountType] = useState("All");
  const [showBreakdown, setShowBreakdown] = useState(true);

  // Fetch net worth data
  const fetchNetWorthData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/dashboard");
      if (!response.ok) throw new Error("Failed to fetch net worth data");

      const dashboardData = await response.json();

      // Calculate net worth trends
      const currentMonth = new Date().toISOString().substring(0, 7);
      const previousMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .substring(0, 7);

      const currentNetWorth = dashboardData.netWorth;
      const previousNetWorth = currentNetWorth * 0.95; // Mock previous value
      const change = currentNetWorth - previousNetWorth;
      const changePercentage = (change / previousNetWorth) * 100;

      // Generate monthly trends (last 6 months)
      const monthlyTrends = [];
      for (let i = 5; i >= 0; i--) {
        const month = new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .substring(0, 7);
        const baseValue = currentNetWorth * (0.8 + i * 0.04);
        monthlyTrends.push({
          month,
          netWorth: baseValue,
          assets: baseValue * 1.1,
          liabilities: baseValue * 0.1,
        });
      }

      setData({
        currentNetWorth,
        previousNetWorth,
        change,
        changePercentage,
        accountBreakdown: dashboardData.accountBreakdown,
        monthlyTrends,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load net worth data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNetWorthData();
  }, []);

  const handleRangeChange = (
    event: React.MouseEvent<HTMLElement>,
    newRange: string | null
  ) => {
    if (newRange !== null) {
      setSelectedRange(newRange);
    }
  };

  const handleAccountTypeChange = (event: any) => {
    setSelectedAccountType(event.target.value);
  };

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
            No data available. Import some CSV files to see your net worth.
          </Alert>
        </Container>
      </Layout>
    );
  }

  // Convert account breakdown to account list format
  const accounts = Object.entries(data.accountBreakdown).map(
    ([name, balance]) => ({
      name,
      type: name.includes("Credit")
        ? "Credit Card"
        : name.includes("Vanguard")
        ? "Investment"
        : name.includes("Wells")
        ? "Bank"
        : "Other",
      balance,
      change: Math.random() * 10 - 5, // Mock change percentage
    })
  );

  const totalAssets = accounts
    .filter((acc) => acc.balance > 0)
    .reduce((sum, acc) => sum + acc.balance, 0);

  const totalLiabilities = Math.abs(
    accounts
      .filter((acc) => acc.balance < 0)
      .reduce((sum, acc) => sum + acc.balance, 0)
  );

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
            Net Worth
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Track your financial health and net worth over time.
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <ToggleButtonGroup
              value={selectedRange}
              exclusive
              onChange={handleRangeChange}
              size="small"
            >
              {timeRanges.map((range) => (
                <ToggleButton key={range} value={range}>
                  {range}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Account Type</InputLabel>
              <Select
                value={selectedAccountType}
                label="Account Type"
                onChange={handleAccountTypeChange}
              >
                {accountTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
              <Tooltip title="Refresh data">
                <IconButton color="primary">
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Export data">
                <IconButton color="secondary">
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>

        {/* Net Worth Summary */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 4 }}>
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
                    label={`${
                      data.changePercentage > 0 ? "+" : ""
                    }${data.changePercentage.toFixed(1)}%`}
                    size="small"
                    sx={{ bgcolor: "rgba(255, 255, 255, 0.2)", color: "white" }}
                  />
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  ${data.currentNetWorth.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Net Worth
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
                  {data.change > 0 ? "+" : ""}${data.change.toLocaleString()}{" "}
                  this month
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <SavingsIcon color="success" sx={{ fontSize: 32, mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Assets
                  </Typography>
                </Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, mb: 1, color: "success.main" }}
                >
                  ${totalAssets.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total liquid and investment assets
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <CreditCardIcon color="error" sx={{ fontSize: 32, mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Liabilities
                  </Typography>
                </Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, mb: 1, color: "error.main" }}
                >
                  ${totalLiabilities.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total debt and credit card balances
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Net Worth Chart Placeholder */}
        <Card sx={{ mb: 4 }}>
          <CardHeader
            title="Net Worth Over Time"
            titleTypographyProps={{ fontWeight: 600 }}
            action={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Chip label={selectedRange} size="small" color="primary" />
                <IconButton size="small">
                  {showBreakdown ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              </Box>
            }
          />
          <CardContent
            sx={{
              height: 400,
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
                Import account balance data to see your net worth trends.
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Account Breakdown */}
        <Card>
          <CardHeader
            title="Account Breakdown"
            titleTypographyProps={{ fontWeight: 600 }}
            action={
              <Chip
                label={`${accounts.length} accounts`}
                size="small"
                color="secondary"
              />
            }
          />
          <CardContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {accounts.map((account, index) => (
                <Box
                  key={account.name}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    bgcolor: "background.paper",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        bgcolor:
                          account.balance > 0 ? "success.light" : "error.light",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {account.balance > 0 ? (
                        <SavingsIcon color="success" />
                      ) : (
                        <CreditCardIcon color="error" />
                      )}
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {account.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {account.type}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ textAlign: "right" }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color:
                          account.balance > 0 ? "success.main" : "error.main",
                      }}
                    >
                      ${Math.abs(account.balance).toLocaleString()}
                    </Typography>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      {account.change > 0 ? (
                        <TrendingUpIcon color="success" sx={{ fontSize: 16 }} />
                      ) : (
                        <TrendingDownIcon color="error" sx={{ fontSize: 16 }} />
                      )}
                      <Typography
                        variant="body2"
                        color={
                          account.change > 0 ? "success.main" : "error.main"
                        }
                      >
                        {account.change > 0 ? "+" : ""}
                        {account.change}%
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Layout>
  );
}
