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
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridToolbar,
} from "@mui/x-data-grid";
import Layout from "@/components/Layout";
import {
  Search as SearchIcon,
  Upload as UploadIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useState } from "react";

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
  "Transfer",
];

const sources = ["Amex", "Wells Fargo", "Venmo", "Vanguard", "Target", "CIT"];

// Mock data for demonstration
const mockTransactions = [
  {
    id: 1,
    date: "2024-01-15",
    merchant: "Starbucks",
    amount: -5.45,
    source: "Amex",
    category: "Food",
    note: "Morning coffee",
    isManual: false,
  },
  {
    id: 2,
    date: "2024-01-14",
    merchant: "Whole Foods",
    amount: -89.32,
    source: "Wells Fargo",
    category: "Groceries",
    note: "Weekly groceries",
    isManual: false,
  },
  {
    id: 3,
    date: "2024-01-13",
    merchant: "Netflix",
    amount: -15.99,
    source: "Amex",
    category: "Subscription",
    note: "Monthly subscription",
    isManual: false,
  },
  {
    id: 4,
    date: "2024-01-12",
    merchant: "Gas Station",
    amount: -42.5,
    source: "Wells Fargo",
    category: "Daily Transport",
    note: "Gas fill-up",
    isManual: false,
  },
  {
    id: 5,
    date: "2024-01-11",
    merchant: "Amazon",
    amount: -127.89,
    source: "Amex",
    category: "Technology",
    note: "New headphones",
    isManual: true,
  },
];

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const handleCategoryChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setSelectedCategories(typeof value === "string" ? value.split(",") : value);
  };

  const handleSourceChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setSelectedSources(typeof value === "string" ? value.split(",") : value);
  };

  const handleRowSelectionChange = (newSelection: any) => {
    setSelectedRows(newSelection);
  };

  const handleEditTransaction = (id: number) => {
    console.log("Edit transaction:", id);
  };

  const handleDeleteTransaction = (id: number) => {
    console.log("Delete transaction:", id);
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
      editable: true,
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
      field: "source",
      headerName: "Source",
      width: 120,
      renderCell: (params: any) => (
        <Chip
          label={params.value}
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
      valueOptions: categories,
      renderCell: (params: any) => (
        <Chip
          label={params.value}
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
      renderCell: (params: any) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => handleEditTransaction(params.row.id)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDeleteTransaction(params.row.id)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
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
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Sources</InputLabel>
                <Select
                  multiple
                  value={selectedSources}
                  onChange={handleSourceChange}
                  input={<OutlinedInput label="Sources" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {sources.map((source) => (
                    <MenuItem key={source} value={source}>
                      {source}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<UploadIcon />}
                  sx={{ minWidth: 120 }}
                >
                  Import CSV
                </Button>
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
            <DataGrid
              rows={mockTransactions}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 25 },
                },
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
      </Container>
    </Layout>
  );
}
