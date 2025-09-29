"use client";

import {
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Box,
  Button,
  LinearProgress,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Grid,
  Avatar,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import Layout from "@/components/Layout";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as AttachMoneyIcon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useCategories } from "@/hooks/useCategories";
import { Budget, Category } from "@prisma/client";

type BudgetWithSpend = Budget & {
  category: Category;
  actualSpend: number;
};

export default function Budgets() {
  const { categories: categoryData } = useCategories();

  const [budgets, setBudgets] = useState<BudgetWithSpend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [formData, setFormData] = useState({
    categoryId: "",
    amount: "",
    startDate: "",
    endDate: "",
    isRecurring: false,
  });

  // Fetch budgets and calculate actual spend
  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/budgets");
      if (!response.ok) throw new Error("Failed to fetch budgets");

      const budgetsData: BudgetWithSpend[] = await response.json();

      // Calculate actual spend for each budget
      const budgetsWithSpend = await Promise.all(
        budgetsData.map(async (budget) => {
          const currentMonth = new Date().toISOString().substring(0, 7);
          const response = await fetch(
            `/api/transactions?category=${budget.category.name}&startDate=${currentMonth}-01&endDate=${currentMonth}-31`
          );
          const data = await response.json();

          const actualSpend = data.transactions
            .filter((t: any) => t.amount < 0)
            .reduce((sum: number, t: any) => sum + Math.abs(t.amount), 0);

          return {
            ...budget,
            actualSpend,
          };
        })
      );

      setBudgets(budgetsWithSpend);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch budgets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  // Create or update budget
  const saveBudget = async () => {
    try {
      const budgetData = {
        categoryId: formData.categoryId,
        amount: parseFloat(formData.amount),
        startDate: formData.startDate,
        endDate: formData.endDate || null,
      };

      const response = await fetch("/api/budgets", {
        method: editingBudget ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editingBudget
            ? { id: editingBudget.id, updates: budgetData }
            : budgetData
        ),
      });

      if (!response.ok) throw new Error("Failed to save budget");

      setSuccess(
        editingBudget
          ? "Budget updated successfully"
          : "Budget created successfully"
      );
      setOpenDialog(false);
      resetForm();
      fetchBudgets();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save budget");
    }
  };

  // Delete budget
  const deleteBudget = async (id: string) => {
    try {
      const response = await fetch(`/api/budgets?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete budget");

      setSuccess("Budget deleted successfully");
      fetchBudgets();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete budget");
    }
  };

  const resetForm = () => {
    setFormData({
      categoryId: "",
      amount: "",
      startDate: "",
      endDate: "",
      isRecurring: false,
    });
    setEditingBudget(null);
  };

  const handleOpenDialog = (budget?: Budget) => {
    if (budget) {
      setFormData({
        categoryId: budget.categoryId,
        amount: budget.amount.toString(),
        startDate: budget.startDate.toISOString().split('T')[0],
        endDate: budget.endDate ? budget.endDate.toISOString().split('T')[0] : "",
        isRecurring: false,
      });
    } else {
      resetForm();
    }
    setEditingBudget(budget || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    resetForm();
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return "error";
    if (percentage >= 80) return "warning";
    return "success";
  };

  const calculateBudgetMetrics = (budget: BudgetWithSpend) => {
    const budgetAmount = Number(budget.amount);
    const remaining = budgetAmount - budget.actualSpend;
    const percentage = (budget.actualSpend / budgetAmount) * 100;
    return {
      remaining,
      percentage: Math.min(percentage, 100),
    };
  };

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
            Budgets
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Set and monitor your spending budgets to stay on track with your
            financial goals.
          </Typography>
        </Box>

        {/* Action Bar */}
        <Box
          sx={{
            mb: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" color="text.secondary">
            {budgets.length} budget{budgets.length !== 1 ? "s" : ""} set
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ minWidth: 140 }}
          >
            Create Budget
          </Button>
        </Box>

        {/* Loading State */}
        {loading && (
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
        )}

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Budget Cards */}
        {!loading && (
          <Grid container spacing={3}>
            {budgets.length === 0 ? (
              <Grid size={12}>
                <Card>
                  <CardContent sx={{ textAlign: "center", py: 4 }}>
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                    >
                      No budgets set
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 3 }}
                    >
                      Create your first budget to start tracking your spending.
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => handleOpenDialog()}
                    >
                      Create Budget
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ) : (
              budgets.map((budget) => {
                const { remaining, percentage } = calculateBudgetMetrics(budget);
                return (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={budget.id}>
                  <Card sx={{ height: "100%" }}>
                    <CardHeader
                      avatar={
                        <Avatar sx={{ bgcolor: "primary.main" }}>
                          <AttachMoneyIcon />
                        </Avatar>
                      }
                      title={budget.category.name}
                      action={
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(budget)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => deleteBudget(budget.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      }
                    />
                    <CardContent>
                      <Box sx={{ mb: 2 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 1,
                          }}
                        >
                          <Typography variant="h6" color="text.secondary">
                            ${budget.actualSpend.toLocaleString()}
                          </Typography>
                          <Typography variant="h6" color="text.primary">
                            ${budget.amount.toLocaleString()}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={percentage}
                          color={getProgressColor(percentage)}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          {percentage >= 100 ? (
                            <TrendingUpIcon color="error" fontSize="small" />
                          ) : (
                            <TrendingDownIcon
                              color="success"
                              fontSize="small"
                            />
                          )}
                          <Typography
                            variant="body2"
                            color={
                              percentage >= 100
                                ? "error.main"
                                : "success.main"
                            }
                          >
                            {percentage.toFixed(1)}% used
                          </Typography>
                        </Box>
                        <Chip
                          label={`$${remaining.toFixed(2)} left`}
                          size="small"
                          color={remaining < 0 ? "error" : "success"}
                          variant="outlined"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                );
              })
            )}
          </Grid>
        )}

        {/* Budget Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {editingBudget ? "Edit Budget" : "Create New Budget"}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1 }}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.categoryId}
                  onChange={(e) =>
                    handleInputChange("categoryId", e.target.value)
                  }
                  label="Category"
                >
                  {categoryData.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                }}
              />

              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                label="End Date (Optional)"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 3 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isRecurring}
                    onChange={(e) =>
                      handleInputChange("isRecurring", e.target.checked)
                    }
                  />
                }
                label="Recurring monthly"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={saveBudget} variant="contained">
              {editingBudget ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar notifications */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
        >
          <Alert onClose={() => setError(null)} severity="error">
            {error}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!success}
          autoHideDuration={6000}
          onClose={() => setSuccess(null)}
        >
          <Alert onClose={() => setSuccess(null)} severity="success">
            {success}
          </Alert>
        </Snackbar>
      </Container>
    </Layout>
  );
}
