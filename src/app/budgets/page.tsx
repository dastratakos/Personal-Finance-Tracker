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
} from "@mui/material";
import Layout from "@/components/Layout";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as AttachMoneyIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { useState } from "react";

const categories = [
  "Housing",
  "Food",
  "Groceries",
  "Wellness",
  "Daily Transport",
  "Travel",
  "Technology",
  "Personal Care",
  "LEGO",
  "Clothing",
  "Gifts",
  "Entertainment",
  "Subscription",
  "Going Out",
];

export default function Budgets() {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBudget, setEditingBudget] = useState<any>(null);

  const handleOpenDialog = (budget?: any) => {
    setEditingBudget(budget || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingBudget(null);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return "error";
    if (percentage >= 80) return "warning";
    return "success";
  };

  const getProgressIcon = (percentage: number) => {
    if (percentage >= 100) return <TrendingUpIcon color="error" />;
    if (percentage >= 80) return <TrendingDownIcon color="warning" />;
    return <TrendingUpIcon color="success" />;
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
            Set and track your monthly spending limits by category.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ mb: 2 }}
          >
            Create Budget
          </Button>
        </Box>

        {/* Budget Cards */}
        <Grid container spacing={3}>
          {categories.slice(0, 6).map((category, index) => {
            const budgetAmount = 1000 + index * 200;
            const spentAmount = Math.floor(
              budgetAmount * (0.3 + Math.random() * 0.7)
            );
            const percentage = Math.round((spentAmount / budgetAmount) * 100);

            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={category}>
                <Card sx={{ height: "100%" }}>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        <AttachMoneyIcon />
                      </Avatar>
                    }
                    title={category}
                    action={
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleOpenDialog({ category, amount: budgetAmount })
                          }
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <DeleteIcon fontSize="small" />
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
                          mb: 1,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Spent this month
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {percentage}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(percentage, 100)}
                        color={getProgressColor(percentage)}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          ${spentAmount.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          of ${budgetAmount.toLocaleString()}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        {getProgressIcon(percentage)}
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Chip
                        label={`$${(
                          budgetAmount - spentAmount
                        ).toLocaleString()} left`}
                        size="small"
                        color={
                          budgetAmount - spentAmount > 0 ? "success" : "error"
                        }
                        variant="outlined"
                      />
                      <Typography variant="caption" color="text.secondary">
                        Monthly budget
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Empty State for remaining categories */}
        <Card sx={{ mt: 3 }}>
          <CardContent sx={{ textAlign: "center", py: 6 }}>
            <Avatar
              sx={{
                bgcolor: "grey.100",
                width: 64,
                height: 64,
                mx: "auto",
                mb: 2,
              }}
            >
              <AttachMoneyIcon sx={{ fontSize: 32, color: "grey.400" }} />
            </Avatar>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No budgets set for remaining categories
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Create budgets for {categories.slice(6).join(", ")} and more.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Create More Budgets
            </Button>
          </CardContent>
        </Card>

        {/* Budget Creation/Edit Dialog */}
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
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}
            >
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select value={editingBudget?.category || ""} label="Category">
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Monthly Amount"
                type="number"
                value={editingBudget?.amount || ""}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                }}
              />

              <TextField
                fullWidth
                label="Start Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                defaultValue={new Date().toISOString().split("T")[0]}
              />

              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Recurring monthly budget"
              />

              <FormControlLabel
                control={<Switch />}
                label="Apply to future months"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button variant="contained" onClick={handleCloseDialog}>
              {editingBudget ? "Update Budget" : "Create Budget"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
}
