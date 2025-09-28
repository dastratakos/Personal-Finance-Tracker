"use client";

import {
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Box,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  FormControlLabel,
  Alert,
} from "@mui/material";
import Layout from "@/components/Layout";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AccountBalance as AccountBalanceIcon,
} from "@mui/icons-material";
import { useState } from "react";

const accountTypes = ["Bank", "Credit Card", "Investment", "Other"];

const mockAccounts = [
  { id: 1, name: "Wells Fargo Checking", type: "Bank", isActive: true },
  { id: 2, name: "Wells Fargo Savings", type: "Bank", isActive: true },
  { id: 3, name: "Amex Gold", type: "Credit Card", isActive: true },
  { id: 4, name: "Vanguard 401k", type: "Investment", isActive: true },
  { id: 5, name: "Venmo", type: "Other", isActive: false },
];

const defaultCategories = [
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
  "Transfer",
];

export default function Settings() {
  const [openAccountDialog, setOpenAccountDialog] = useState(false);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any>(null);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [newCategory, setNewCategory] = useState("");

  const handleOpenAccountDialog = (account?: any) => {
    setEditingAccount(account || null);
    setOpenAccountDialog(true);
  };

  const handleCloseAccountDialog = () => {
    setOpenAccountDialog(false);
    setEditingAccount(null);
  };

  const handleOpenCategoryDialog = (category?: string) => {
    setEditingCategory(category || null);
    setNewCategory(category || "");
    setOpenCategoryDialog(true);
  };

  const handleCloseCategoryDialog = () => {
    setOpenCategoryDialog(false);
    setEditingCategory(null);
    setNewCategory("");
  };

  const handleSaveCategory = () => {
    // Handle category save logic here
    handleCloseCategoryDialog();
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
            Settings
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Manage your accounts, categories, and application preferences.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {/* Accounts Management */}
          <Card>
            <CardHeader
              title="Accounts"
              titleTypographyProps={{ fontWeight: 600 }}
              subheader="Manage your financial accounts and their types"
              action={
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenAccountDialog()}
                >
                  Add Account
                </Button>
              }
            />
            <CardContent>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Account Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockAccounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <AccountBalanceIcon color="action" />
                            <Typography variant="body2">
                              {account.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={account.type}
                            size="small"
                            variant="outlined"
                            color={
                              account.type === "Bank"
                                ? "success"
                                : account.type === "Credit Card"
                                ? "error"
                                : "default"
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={account.isActive ? "Active" : "Inactive"}
                            size="small"
                            color={account.isActive ? "success" : "default"}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", gap: 0.5 }}>
                            <IconButton
                              size="small"
                              onClick={() => handleOpenAccountDialog(account)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton size="small" color="error">
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Categories Management */}
          <Card>
            <CardHeader
              title="Categories"
              titleTypographyProps={{ fontWeight: 600 }}
              subheader="Manage your spending categories"
              action={
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenCategoryDialog()}
                >
                  Add Category
                </Button>
              }
            />
            <CardContent>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
                {defaultCategories.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    onDelete={() => handleOpenCategoryDialog(category)}
                    deleteIcon={<EditIcon />}
                    variant="outlined"
                    sx={{ mb: 1 }}
                  />
                ))}
              </Box>
              <Alert severity="info">
                <Typography variant="body2">
                  <strong>Note:</strong> Categories are used to organize your
                  transactions. You can add custom categories or modify existing
                  ones.
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        </Box>

        {/* Account Dialog */}
        <Dialog
          open={openAccountDialog}
          onClose={handleCloseAccountDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {editingAccount ? "Edit Account" : "Add New Account"}
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}
            >
              <TextField
                fullWidth
                label="Account Name"
                defaultValue={editingAccount?.name || ""}
                placeholder="e.g., Wells Fargo Checking"
              />

              <FormControl fullWidth>
                <InputLabel>Account Type</InputLabel>
                <Select
                  defaultValue={editingAccount?.type || ""}
                  label="Account Type"
                >
                  {accountTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Switch defaultChecked={editingAccount?.isActive ?? true} />
                }
                label="Active account"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAccountDialog}>Cancel</Button>
            <Button variant="contained" onClick={handleCloseAccountDialog}>
              {editingAccount ? "Update Account" : "Add Account"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Category Dialog */}
        <Dialog
          open={openCategoryDialog}
          onClose={handleCloseCategoryDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {editingCategory ? "Edit Category" : "Add New Category"}
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}
            >
              <TextField
                fullWidth
                label="Category Name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="e.g., Healthcare, Education"
              />

              <Alert severity="info">
                <Typography variant="body2">
                  Category names should be descriptive and help you organize
                  your spending effectively.
                </Typography>
              </Alert>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCategoryDialog}>Cancel</Button>
            <Button variant="contained" onClick={handleSaveCategory}>
              {editingCategory ? "Update Category" : "Add Category"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
}
