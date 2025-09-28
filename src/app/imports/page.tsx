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
import { useState } from "react";

const supportedSources = [
  {
    name: "American Express",
    pattern: "amex",
    icon: "💳",
    description: "Credit card transactions",
  },
  {
    name: "Wells Fargo",
    pattern: "wells",
    icon: "🏦",
    description: "Bank account transactions",
  },
  {
    name: "Venmo",
    pattern: "venmo",
    icon: "💰",
    description: "Peer-to-peer payments",
  },
  {
    name: "Vanguard",
    pattern: "vanguard",
    icon: "📈",
    description: "Investment account",
  },
  {
    name: "Target",
    pattern: "target",
    icon: "🎯",
    description: "Target RedCard",
  },
  {
    name: "CIT Bank",
    pattern: "cit",
    icon: "🏛️",
    description: "Savings account",
  },
];

const mockImports = [
  {
    id: 1,
    filename: "amex_gold_2024_01.csv",
    source: "American Express",
    importedAt: "2024-01-15T10:30:00Z",
    status: "completed",
    rowsImported: 45,
    rowsSkipped: 2,
    checksum: "abc123def456",
  },
  {
    id: 2,
    filename: "wells_fargo_checking_2024_01.csv",
    source: "Wells Fargo",
    importedAt: "2024-01-14T15:45:00Z",
    status: "completed",
    rowsImported: 78,
    rowsSkipped: 0,
    checksum: "def456ghi789",
  },
  {
    id: 3,
    filename: "venmo_export_2024_01.csv",
    source: "Venmo",
    importedAt: "2024-01-13T09:20:00Z",
    status: "completed",
    rowsImported: 23,
    rowsSkipped: 1,
    checksum: "ghi789jkl012",
  },
  {
    id: 4,
    filename: "vanguard_401k_2024_01.csv",
    source: "Vanguard",
    importedAt: "2024-01-12T14:10:00Z",
    status: "error",
    rowsImported: 0,
    rowsSkipped: 0,
    checksum: "jkl012mno345",
  },
];

export default function Imports() {
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(event.target.files);
    }
  };

  const handleUpload = () => {
    if (!selectedFiles) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setOpenUploadDialog(false);
          setSelectedFiles(null);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
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
            Import your financial data from various sources. Re-uploading the
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

        {/* Supported Sources */}
        <Card sx={{ mb: 4 }}>
          <CardHeader
            title="Supported Sources"
            titleTypographyProps={{ fontWeight: 600 }}
            subheader="We automatically detect the source based on your filename"
          />
          <CardContent>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {supportedSources.map((source) => (
                <Card
                  key={source.name}
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
                    <Typography variant="h4">{source.icon}</Typography>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {source.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {source.description}
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
            {mockImports.length > 0 ? (
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>File</TableCell>
                      <TableCell>Source</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Imported</TableCell>
                      <TableCell>Skipped</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockImports.map((importItem) => (
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
                            label={importItem.source}
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
                            {getStatusIcon(importItem.status)}
                            <Typography
                              variant="body2"
                              sx={{ textTransform: "capitalize" }}
                            >
                              {importItem.status}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="success.main">
                            {importItem.rowsImported} rows
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="warning.main">
                            {importItem.rowsSkipped} rows
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
                  <strong>Tip:</strong> Include the source name in your filename
                  (e.g., "amex_", "wells_", "venmo_") for automatic source
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
      </Container>
    </Layout>
  );
}
