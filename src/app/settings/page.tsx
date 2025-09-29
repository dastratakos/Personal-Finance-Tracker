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
  Alert,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import Layout from "@/components/Layout";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { Account } from "@prisma/client";
import { useAccounts } from "@/hooks/useAccounts";
import { useCategories } from "@/hooks/useCategories";
import { Category } from "@prisma/client";

const accountTypes = ["Bank", "Credit Card", "Investment", "Venmo"];

export default function Settings() {
  const {
    accounts,
    loading: accountsLoading,
    error: accountsError,
    refetch: refetchAccounts,
  } = useAccounts();
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useCategories();

  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [openAccountDialog, setOpenAccountDialog] = useState(false);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState("📂");
  const [accountForm, setAccountForm] = useState({
    name: "",
    type: "",
    emoji: "🏦",
  });

  // Combined loading and error states
  const loading = accountsLoading || categoriesLoading;
  const error = accountsError || categoriesError || localError;

  // Create or update account
  const saveAccount = async () => {
    try {
      const accountData = {
        name: accountForm.name,
        accountType: accountForm.type,
        emoji: accountForm.emoji,
      };

      const response = await fetch("/api/accounts", {
        method: editingAccount ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editingAccount
            ? { id: editingAccount.id, updates: accountData }
            : accountData
        ),
      });

      if (!response.ok) throw new Error("Failed to save account");

      setSuccess(
        editingAccount
          ? "Account updated successfully"
          : "Account created successfully"
      );
      setOpenAccountDialog(false);
      resetForm();
      refetchAccounts();
    } catch (err) {
      setLocalError(
        err instanceof Error ? err.message : "Failed to save account"
      );
    }
  };

  // Delete account
  const deleteAccount = async (id: string) => {
    try {
      const response = await fetch(`/api/accounts?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete account");

      setSuccess("Account deleted successfully");
      refetchAccounts();
    } catch (err) {
      setLocalError(
        err instanceof Error ? err.message : "Failed to delete account"
      );
    }
  };

  const resetForm = () => {
    setAccountForm({
      name: "",
      type: "",
      emoji: "🏦",
    });
    setEditingAccount(null);
  };

  const handleOpenAccountDialog = (account?: Account) => {
    if (account) {
      setAccountForm({
        name: account.name,
        type: account.accountType || "",
        emoji: account.emoji || "🏦",
      });
    } else {
      resetForm();
    }
    setEditingAccount(account || null);
    setOpenAccountDialog(true);
  };

  const handleCloseAccountDialog = () => {
    setOpenAccountDialog(false);
    resetForm();
  };

  const handleOpenCategoryDialog = (category?: Category) => {
    setEditingCategory(category || null);
    setNewCategory(category?.name || "");
    setNewCategoryIcon(category?.emoji || "📂");
    setOpenCategoryDialog(true);
  };

  const handleCloseCategoryDialog = () => {
    setOpenCategoryDialog(false);
    setEditingCategory(null);
    setNewCategory("");
    setNewCategoryIcon("📂");
  };

  const handleSaveCategory = async () => {
    try {
      if (!newCategory.trim()) {
        setLocalError("Category name is required");
        return;
      }

      const response = await fetch("/api/categories", {
        method: editingCategory ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editingCategory
            ? {
                id: editingCategory.id,
                name: newCategory,
                emoji: newCategoryIcon,
              }
            : { name: newCategory, emoji: newCategoryIcon }
        ),
      });

      if (!response.ok) throw new Error("Failed to save category");

      setSuccess(
        editingCategory
          ? "Category updated successfully"
          : "Category created successfully"
      );
      setOpenCategoryDialog(false);
      setNewCategory("");
      setEditingCategory(null);
      refetchCategories();
    } catch (err) {
      setLocalError(
        err instanceof Error ? err.message : "Failed to save category"
      );
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    try {
      const response = await fetch(`/api/categories?id=${category.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete category");

      setSuccess("Category deleted successfully");
      refetchCategories();
    } catch (err) {
      setLocalError(
        err instanceof Error ? err.message : "Failed to delete category"
      );
    }
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
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          sx={{ textAlign: "center", py: 4 }}
                        >
                          <CircularProgress />
                        </TableCell>
                      </TableRow>
                    ) : accounts.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          sx={{ textAlign: "center", py: 4 }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            No accounts found. Create your first account.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      accounts.map((account) => (
                        <TableRow key={account.id}>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Typography
                                variant="h6"
                                sx={{ fontSize: "1.2rem" }}
                              >
                                {account.emoji}
                              </Typography>
                              <Typography variant="body2">
                                {account.name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={account.accountType || "Other"}
                              size="small"
                              variant="outlined"
                              color={
                                account.accountType === "bank"
                                  ? "success"
                                  : account.accountType === "credit_card"
                                  ? "error"
                                  : account.accountType === "investment"
                                  ? "info"
                                  : "default"
                              }
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
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      `Are you sure you want to delete ${account.name}?`
                                    )
                                  ) {
                                    deleteAccount(account.id);
                                  }
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
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
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Category</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categoriesLoading ? (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          sx={{ textAlign: "center", py: 4 }}
                        >
                          <CircularProgress />
                        </TableCell>
                      </TableRow>
                    ) : categories.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          sx={{ textAlign: "center", py: 4 }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            No categories found. Create your first category.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      categories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Typography
                                variant="h6"
                                sx={{ fontSize: "1.2rem" }}
                              >
                                {category.emoji}
                              </Typography>
                              <Typography variant="body2">
                                {category.name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(
                                category.createdAt
                              ).toLocaleDateString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", gap: 0.5 }}>
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleOpenCategoryDialog(category)
                                }
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      `Are you sure you want to delete "${category.name}"?`
                                    )
                                  ) {
                                    handleDeleteCategory(category);
                                  }
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
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
                value={accountForm.name}
                onChange={(e) =>
                  setAccountForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g., Wells Fargo Checking"
              />

              <FormControl fullWidth>
                <InputLabel>Account Type</InputLabel>
                <Select
                  value={accountForm.type}
                  onChange={(e) =>
                    setAccountForm((prev) => ({
                      ...prev,
                      type: e.target.value,
                    }))
                  }
                  label="Account Type"
                >
                  {accountTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Icon (Emoji)"
                value={accountForm.emoji}
                onChange={(e) =>
                  setAccountForm((prev) => ({ ...prev, emoji: e.target.value }))
                }
                placeholder="e.g., 🏦, 💳, 📈"
                helperText="Enter a single emoji to represent this account"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAccountDialog}>Cancel</Button>
            <Button variant="contained" onClick={saveAccount}>
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

              <TextField
                fullWidth
                label="Icon (Emoji)"
                value={newCategoryIcon}
                onChange={(e) => setNewCategoryIcon(e.target.value)}
                placeholder="e.g., 🏥, 🎓, 💊"
                helperText="Enter a single emoji to represent this category"
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

        {/* Snackbar notifications */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setLocalError(null)}
        >
          <Alert onClose={() => setLocalError(null)} severity="error">
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
