import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Replacing useHistory with useNavigate
import axios from 'axios';
import { Container, Typography, Button, TextField, CircularProgress, Snackbar, Alert, IconButton, Box } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const Upload = () => {
    const [file, setFile] = useState(null);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [copied, setCopied] = useState(false);

    const navigate = useNavigate();  // Use useNavigate instead of useHistory

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async (event) => {
        event.preventDefault();

        if (!file) {
            setError('Please select a file.');
            setOpenSnackbar(true);
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setResponse(res.data);
            setError(null);
            setOpenSnackbar(true);
        } catch (err) {
            setError('Failed to upload file.');
            setResponse(null);
            setOpenSnackbar(true);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleCopy = () => {
        if (response) {
            navigator.clipboard.writeText(JSON.stringify(response, null, 2))
                .then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                })
                .catch((err) => {
                    console.error('Failed to copy:', err);
                });
        }
    };

    const handleProveMRCClick = () => {
        navigate('/prove-mrc');  // Navigate to another page
    };

    return (
      <Container component="main" maxWidth="md" style={{ marginTop: '2rem' }}>
          <Typography variant="h4" gutterBottom>
              Upload Document
          </Typography>
          <form onSubmit={handleUpload} noValidate>
              <TextField
                  type="file"
                  onChange={handleFileChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  helperText="Choose a file to upload"
              />
              <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  style={{ marginTop: '1rem' }}
              >
                  {loading ? <CircularProgress size={24} /> : 'Upload'}
              </Button>
          </form>
  
          {response && (
              <React.Fragment>
                  <Box
                      sx={{
                          marginTop: '1rem',
                          position: 'relative',
                          padding: 2,
                          border: '1px solid',
                          borderRadius: 1,
                          overflowY: 'auto',
                          maxHeight: '400px',
                      }}
                  >
                      <IconButton
                          onClick={handleCopy}
                          color="primary"
                          style={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                          }}
                      >
                          <ContentCopyIcon />
                      </IconButton>
                      <Typography variant="body1" color="textSecondary">
                          <pre>{JSON.stringify(response, null, 2)}</pre>
                      </Typography>
                      {copied && (
                          <Snackbar
                              open={copied}
                              autoHideDuration={2000}
                              onClose={() => setCopied(false)}
                              message="Copied to clipboard"
                          />
                      )}
                  </Box>
  
                  {/* Conditionally render Prove MRC button only if response is present */}
                  <Button
                      fullWidth
                      variant="contained"
                      color="secondary"
                      style={{ marginTop: '1rem' }}
                      onClick={handleProveMRCClick}  // Button to navigate to prove MRC page
                  >
                      Prove MRC (Machine Readable Code)
                  </Button>
              </React.Fragment>
          )}
  
          {error && (
              <Snackbar
                  open={openSnackbar}
                  autoHideDuration={6000}
                  onClose={handleCloseSnackbar}
              >
                  <Alert onClose={handleCloseSnackbar} severity="error">
                      {error}
                  </Alert>
              </Snackbar>
          )}
      </Container>
  );
  
};

export default Upload;
