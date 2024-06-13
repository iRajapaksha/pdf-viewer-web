import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const Input = styled("input")({
  display: "none",
});

const HomePage = ({ auth }) => {
  const navigate = useNavigate();
  const [pdf, setPdf] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfList, setPdfList] = useState([]);

  useEffect(() => {
    if (auth.isAuthenticated) {
      fetchPdfs();
    }
  }, [auth.isAuthenticated]);

  const fetchPdfs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/pdfs/get", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setPdfList(response.data);
    } catch (error) {
      console.error("Failed to fetch PDFs", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/pdfs/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (response.status === 200) {
        fetchPdfs();
      }
    } catch (error) {
      console.error("Failed to delete PDF", error);
    }
  };

  const handleListItemClick = async (pdf) => {
    const url = `http://localhost:5000/uploads/${pdf.filename}`;
    try {
      const response = await axios.get(url, {
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "application/pdf" });
      setPdfUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Failed to load PDF:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdf(file);
      setUploadError("");
    } else {
      setUploadError("Please select a PDF file.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pdf) {
      const formData = new FormData();
      formData.append("pdf", pdf);
      setLoading(true);

      try {
        const response = await axios.post(
          "http://localhost:5000/api/pdfs/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        if (response.status === 201) {
          const url = URL.createObjectURL(pdf);
          setPdfUrl(url);
          setLoading(false);
          fetchPdfs();
        }
      } catch (error) {
        console.error("Failed to upload PDF", error);
        setUploadError("Failed to upload PDF. Please try again.");
        setLoading(false);
      }
    }
  };

  const theme = useTheme();
  const newPlugin = defaultLayoutPlugin();

  if (!auth.isAuthenticated) {
    return (
      <Container component="main" maxWidth="xs">
        <Paper elevation={3} sx={{ padding: 3, textAlign: "center", backgroundColor: theme.palette.background.paper }}>
          <Typography variant="h6" gutterBottom>
            Please login first
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/")}
            sx={{ mt: 2 }}
          >
            Go back
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} sx={{ padding: 3, marginTop: 3, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" gutterBottom color="primary">
          Upload and View PDF
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={8}>
              <label htmlFor="pdf-upload">
                <Input
                  accept="application/pdf"
                  id="pdf-upload"
                  type="file"
                  onChange={handleFileChange}
                />
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                  sx={{ backgroundColor: theme.palette.secondary.main, "&:hover": { backgroundColor: theme.palette.secondary.dark } }}
                >
                  Select PDF
                </Button>
              </label>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} />}
                sx={{ backgroundColor: theme.palette.primary.main, "&:hover": { backgroundColor: theme.palette.primary.dark } }}
              >
                {loading ? "Uploading..." : "Upload PDF"}
              </Button>
            </Grid>
          </Grid>
          {uploadError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {uploadError}
            </Alert>
          )}
        </form>
        <Box mt={4}>
          <Typography variant="h5" gutterBottom color="primary">
            Uploaded PDFs
          </Typography>
          <Paper variant="outlined" sx={{ padding: 2, borderRadius: 2, boxShadow: 3 }}>
            <List>
              {pdfList.length === 0 ? (
                <Typography
                  variant="body1"
                  color="textSecondary"
                  align="center"
                >
                  No PDFs uploaded
                </Typography>
              ) : (
                <List>
                  {pdfList.map((pdf) => (
                    <ListItem
                      key={pdf._id}
                      button
                      onClick={() => handleListItemClick(pdf)}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(pdf._id);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                      sx={{ "&:hover": { backgroundColor: theme.palette.action.hover } }}
                    >
                      <ListItemIcon>
                        <CloudUploadIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={pdf.originalname}
                        secondary={`Uploaded on: ${new Date(pdf.uploadDate).toLocaleString()}`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </List>
          </Paper>
        </Box>
        <Box mt={4}>
          <Typography variant="h5" gutterBottom color="primary">
            PDF Preview
          </Typography>
          <Paper variant="outlined" sx={{ padding: 2, borderRadius: 2, boxShadow: 3, minHeight: 400 }}>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
              {pdfUrl ? (
                <Viewer fileUrl={pdfUrl} plugins={[newPlugin]} />
              ) : (
                <Typography
                  variant="body1"
                  color="textSecondary"
                  align="center"
                >
                  No PDF selected
                </Typography>
              )}
            </Worker>
          </Paper>
        </Box>
      </Paper>
    </Container>
  );
};

export default HomePage;
