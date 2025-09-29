"use client";

import {
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Box,
  Button,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import Layout from "@/components/Layout";
import {
  Upload as UploadIcon,
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  FileUpload as FileUploadIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { ImportRecord, Account } from "@/types";

export default function Imports() {
  const [imports, setImports] = useState<ImportRecord[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch imports list
  const fetchImports = async () => {
    try {
      const response = await fetch("/api/imports");
      if (!response.ok) throw new Error("Failed to fetch imports");

      const data = await response.json();
      setImports(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch imports");
    }
  };

  // Fetch accounts list
  const fetchAccounts = async () => {
    try {
      const response = await fetch("/api/accounts");
      if (!response.ok) throw new Error("Failed to fetch accounts");

      const data = await response.json();
      setAccounts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch accounts");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchImports(), fetchAccounts()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(event.target.files);
    }
  };

  const handleUpload = async () => {
    if (!selectedFiles) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setError(null);

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/import", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Upload failed");
        }

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.message);
        }

        setUploadProgress(((i + 1) / selectedFiles.length) * 100);
      }

      setSuccess(`Successfully imported ${selectedFiles.length} file(s)`);
      setOpenUploadDialog(false);
      setSelectedFiles(null);
      fetchImports(); // Refresh imports list
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircleIcon color="success" />;
      case "error":
        return <ErrorIcon color="error" />;
      case "warning":
        return <WarningIcon color="warning" />;
      default:
        return <RefreshIcon color="action" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "error":
        return "error";
      case "warning":
        return "warning";
      default:
        return "default";
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
            Imports
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Import your financial data from various accounts. Re-uploading the
            same files won't create duplicates.
          </Typography>
          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            onClick={() => setOpenUploadDialog(true)}
            size="large"
          >
            Import CSV Files
          </Button>
        </Box>

        {/* Supported Accounts */}
        <Card sx={{ mb: 4 }}>
          <CardHeader
            title="Supported Accounts"
            titleTypographyProps={{ fontWeight: 600 }}
            subheader="We automatically detect the account based on your filename"
          />
          <CardContent>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {accounts.map((account) => (
                <Card
                  key={account.id}
                  variant="outlined"
                  sx={{
                    minWidth: 200,
                    p: 2,
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography variant="h4">{account.icon}</Typography>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {account.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {account.accountType}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* Import History */}
        <Card>
          <CardHeader
            title="Import History"
            titleTypographyProps={{ fontWeight: 600 }}
            action={
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton size="small">
                  <RefreshIcon />
                </IconButton>
                <IconButton size="small">
                  <DownloadIcon />
                </IconButton>
              </Box>
            }
          />
          <CardContent>
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  py: 4,
                }}
              >
                <CircularProgress />
              </Box>
            ) : imports.length > 0 ? (
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>File</TableCell>
                      <TableCell>Account</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Transactions</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {imports.map((importItem) => (
                      <TableRow key={importItem.id}>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <DescriptionIcon color="action" />
                            <Typography variant="body2">
                              {importItem.filename}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={importItem.account.name}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <CheckCircleIcon color="success" />
                            <Typography
                              variant="body2"
                              sx={{ textTransform: "capitalize" }}
                            >
                              Completed
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="success.main">
                            {importItem.transactionCount} transactions
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(
                              importItem.importedAt
                            ).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", gap: 0.5 }}>
                            <IconButton size="small">
                              <VisibilityIcon />
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
            ) : (
              <Box sx={{ textAlign: "center", py: 6 }}>
                <CloudUploadIcon
                  sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No imports yet
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Upload your first CSV file to get started.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<UploadIcon />}
                  onClick={() => setOpenUploadDialog(true)}
                >
                  Import Your First File
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Upload Dialog */}
        <Dialog
          open={openUploadDialog}
          onClose={() => setOpenUploadDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Import CSV Files</DialogTitle>
          <DialogContent>
            <Box sx={{ py: 2 }}>
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  <strong>Tip:</strong> Include the account name in your filename
                  (e.g., "Amex", "Wells Fargo", "Venmo") for automatic account
                  detection.
                </Typography>
              </Alert>

              <Box
                sx={{
                  border: "2px dashed",
                  borderColor: "primary.main",
                  borderRadius: 2,
                  p: 4,
                  textAlign: "center",
                  bgcolor: "primary.light",
                  color: "primary.contrastText",
                  mb: 3,
                }}
              >
                <FileUploadIcon sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Drop CSV files here or click to browse
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Supports multiple files at once
                </Typography>
                <input
                  type="file"
                  multiple
                  accept=".csv"
                  onChange={handleFileSelect}
                  style={{ display: "none" }}
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                    sx={{ bgcolor: "white", color: "primary.main" }}
                  >
                    Choose Files
                  </Button>
                </label>
              </Box>

              {selectedFiles && (
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, mb: 2 }}
                  >
                    Selected Files ({selectedFiles.length})
                  </Typography>
                  <List>
                    {Array.from(selectedFiles).map((file, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon>
                          <DescriptionIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={file.name}
                          secondary={`${(file.size / 1024).toFixed(1)} KB`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {isUploading && (
                <Box sx={{ mt: 3 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Processing files...
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={uploadProgress}
                  />
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenUploadDialog(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={!selectedFiles || isUploading}
            >
              {isUploading ? "Processing..." : "Import Files"}
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
