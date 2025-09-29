"use client";

import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  TextField,
  Button,
  Chip,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  SelectChangeEvent,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridToolbar,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import Layout from "@/components/Layout";
import {
  Search as SearchIcon,
  Upload as UploadIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { useState, useEffect, useCallback } from "react";
import { useCategories } from "@/hooks/useCategories";
import { useAccounts } from "@/hooks/useAccounts";
import { Transaction } from "@prisma/client";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function Transactions() {
  const { categories: categoryData, loading: categoriesLoading } =
    useCategories();
  const { accounts: accountData, loading: accountsLoading } = useAccounts();

  const categories = categoryData.map((cat) => ({
    id: cat.id,
    name: cat.name,
  }));
  const accounts = accountData.map((account) => account.name);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: 25,
    total: 0,
    pages: 0,
  });
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  // Fetch transactions from API
  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: (pagination.page + 1).toString(),
        limit: pagination.pageSize.toString(),
        search: searchTerm,
        category: selectedCategories.join(","),
        account: selectedAccounts.join(","),
      });

      const response = await fetch(`/api/transactions?${params}`);
      if (!response.ok) throw new Error("Failed to fetch transactions");

      const data = await response.json();
      setTransactions(data.transactions);
      setPagination((prev) => ({
        ...prev,
        total: data.pagination.total,
        pages: data.pagination.pages,
      }));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch transactions"
      );
    } finally {
      setLoading(false);
    }
  }, [
    pagination.page,
    pagination.pageSize,
    searchTerm,
    selectedCategories,
    selectedAccounts,
  ]);

  // Update transaction
  const updateTransaction = async (
    id: string,
    updates: Partial<Transaction>
  ) => {
    try {
      const response = await fetch("/api/transactions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, updates }),
      });

      if (!response.ok) throw new Error("Failed to update transaction");

      const updatedTransaction = await response.json();
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? updatedTransaction : t))
      );
      setSuccess("Transaction updated successfully");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update transaction"
      );
    }
  };

  // Delete transaction
  const deleteTransaction = async (id: string) => {
    try {
      const response = await fetch(`/api/transactions?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete transaction");

      setTransactions((prev) => prev.filter((t) => t.id !== id));
      setSuccess("Transaction deleted successfully");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete transaction"
      );
    }
  };

  // Handle file upload
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/import", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Import failed");

      const result = await response.json();
      setSuccess(result.message);
      fetchTransactions(); // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount and when filters change
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleCategoryChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setSelectedCategories(typeof value === "string" ? value.split(",") : value);
  };

  const handleAccountChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setSelectedAccounts(typeof value === "string" ? value.split(",") : value);
  };

  const handleRowSelectionChange = (newSelection: any) => {
    setSelectedRows(newSelection);
  };

  const handleEditTransaction = (id: string) => {
    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "category" },
    }));
  };

  const handleDeleteTransaction = (id: string) => {
    deleteTransaction(id);
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const processRowUpdate = async (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    await updateTransaction(newRow.id, {
      categoryId: newRow.category,
      note: newRow.note,
    });
    return updatedRow;
  };

  const handleProcessRowUpdateError = (error: Error) => {
    setError(`Failed to update transaction: ${error.message}`);
  };

  const columns: GridColDef[] = [
    {
      field: "date",
      headerName: "Date",
      width: 120,
      type: "date",
      valueGetter: (params: any) => new Date(params.value),
    },
    {
      field: "merchant",
      headerName: "Merchant",
      width: 200,
      editable: false,
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 120,
      type: "number",
      valueFormatter: (params: any) => `$${Math.abs(params.value).toFixed(2)}`,
      cellClassName: (params: any) =>
        params.value < 0 ? "amount-negative" : "amount-positive",
    },
    {
      field: "account",
      headerName: "Account",
      width: 120,
      valueGetter: (params: any) => params.row.account?.name || "Unknown",
      renderCell: (params: any) => (
        <Chip
          label={`${params.row.account?.emoji || "🏦"} ${params.value}`}
          size="small"
          variant="outlined"
          color={params.value === "Amex" ? "error" : "default"}
        />
      ),
    },
    {
      field: "category",
      headerName: "Category",
      width: 150,
      editable: true,
      type: "singleSelect",
      valueOptions: categories.map((cat) => cat.id),
      valueGetter: (params: any) => params.row.category?.id || null,
      renderCell: (params: any) => (
        <Chip
          label={`${params.row.category?.emoji || "📂"} ${
            params.row.category?.name || "Uncategorized"
          }`}
          size="small"
          color="primary"
          variant="outlined"
        />
      ),
    },
    {
      field: "note",
      headerName: "Note",
      width: 200,
      editable: true,
    },
    {
      field: "isManual",
      headerName: "Manual",
      width: 80,
      renderCell: (params: any) =>
        params.value ? (
          <Chip
            label="Manual"
            size="small"
            color="secondary"
            variant="filled"
          />
        ) : null,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      filterable: false,
      type: "actions",
      getActions: (params: any) => {
        const isInEditMode =
          rowModesModel[params.id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              onClick={() => {
                setRowModesModel((prev) => ({
                  ...prev,
                  [params.id]: { mode: GridRowModes.View },
                }));
              }}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              onClick={() => {
                setRowModesModel((prev) => ({
                  ...prev,
                  [params.id]: { mode: GridRowModes.View },
                }));
              }}
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={() => handleEditTransaction(params.id)}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleDeleteTransaction(params.id)}
          />,
        ];
      },
    },
  ];

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
            Transactions
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            View, search, and manage all your financial transactions.
          </Typography>
        </Box>

        {/* Filters and Actions */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <TextField
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
                sx={{ minWidth: 300 }}
              />

              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Categories</InputLabel>
                <Select
                  multiple
                  value={selectedCategories}
                  onChange={handleCategoryChange}
                  input={<OutlinedInput label="Categories" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => {
                        const category = categories.find(
                          (cat) => cat.id === value
                        );
                        return (
                          <Chip
                            key={value}
                            label={category?.name || value}
                            size="small"
                          />
                        );
                      })}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Accounts</InputLabel>
                <Select
                  multiple
                  value={selectedAccounts}
                  onChange={handleAccountChange}
                  input={<OutlinedInput label="Accounts" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {accounts.map((account) => (
                    <MenuItem key={account} value={account}>
                      {account}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
                <input
                  accept=".csv"
                  style={{ display: "none" }}
                  id="csv-upload"
                  type="file"
                  onChange={handleFileUpload}
                />
                <label htmlFor="csv-upload">
                  <Button
                    variant="contained"
                    startIcon={<UploadIcon />}
                    component="span"
                    sx={{ minWidth: 120 }}
                    disabled={loading}
                  >
                    Import CSV
                  </Button>
                </label>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  sx={{ minWidth: 120 }}
                >
                  Export
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Transactions DataGrid */}
        <Card>
          <Box sx={{ height: 600, width: "100%" }}>
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <DataGrid
                rows={transactions}
                columns={columns}
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                onProcessRowUpdateError={handleProcessRowUpdateError}
                paginationModel={{
                  page: pagination.page,
                  pageSize: pagination.pageSize,
                }}
                onPaginationModelChange={(model) => {
                  setPagination((prev) => ({
                    ...prev,
                    page: model.page,
                    pageSize: model.pageSize,
                  }));
                }}
                pageSizeOptions={[10, 25, 50, 100]}
                checkboxSelection
                disableRowSelectionOnClick
                onRowSelectionModelChange={handleRowSelectionChange}
                slots={{
                  toolbar: GridToolbar,
                }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 500 },
                  },
                }}
                sx={{
                  "& .amount-negative": {
                    color: "error.main",
                    fontWeight: 600,
                  },
                  "& .amount-positive": {
                    color: "success.main",
                    fontWeight: 600,
                  },
                  "& .MuiDataGrid-cell:focus": {
                    outline: "none",
                  },
                  "& .MuiDataGrid-row:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              />
            )}
          </Box>
        </Card>

        {/* Bulk Actions */}
        {selectedRows.length > 0 && (
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {selectedRows.length} transaction(s) selected
                </Typography>
                <Button variant="outlined" size="small">
                  Bulk Edit Category
                </Button>
                <Button variant="outlined" size="small">
                  Export Selected
                </Button>
                <Button variant="outlined" color="error" size="small">
                  Delete Selected
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

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
