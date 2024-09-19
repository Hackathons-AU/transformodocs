import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container, Typography, Button, CircularProgress,
  Snackbar, Alert, IconButton, Box, Input
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import bg from '../assets/images/bg1.jpg';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [copied, setCopied] = useState(false);

  const navigate = useNavigate();

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
        headers: { 'Content-Type': 'multipart/form-data' }
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

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  const handleCopy = () => {
    if (response) {
      navigator.clipboard.writeText(JSON.stringify(response, null, 2))
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((err) => console.error('Failed to copy:', err));
    }
  };

  const handleProveMRCClick = () => navigate('/prove-mrc');

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(0.9) contrast(1.2)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(45deg, rgba(0,150,136,0.5), rgba(0,77,64,0.5))',
          zIndex: 1,
          pointerEvents: 'none',
          animation: 'floatingEffect 8s infinite ease-in-out',
        }}
      />
  
      <Container
        component="main"
        maxWidth="md"
        sx={{
          zIndex: 2,
          padding: '3rem',
          background: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(12px)',
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'scale(1.03)',
          },
        }}
      >
        <Typography
          variant="h2"
          sx={{
            color: '#004d40',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '2rem',
            fontSize: '2.8rem',
            textShadow: '0 5px 15px rgba(0, 77, 64, 0.3)',
          }}
        >
          TransformoDocs - Upload Your Document
        </Typography>
  
        <form onSubmit={handleUpload} noValidate>
          <Input
            type="file"
            onChange={handleFileChange}
            fullWidth
            sx={{
              display: 'block',
              marginBottom: '2rem',
              color: '#004d40',
              '&::file-selector-button': {
                backgroundColor: '#004d40',
                color: '#fff',
                padding: '12px 24px',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
                boxShadow: '0 10px 25px rgba(0, 128, 128, 0.5)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#00796b',
                  boxShadow: '0 10px 25px rgba(0, 128, 128, 0.7)',
                },
              },
            }}
          />
  
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              marginTop: '2rem',
              padding: '1rem',
              fontSize: '1.3rem',
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #00897b, #26a69a)',
              color: '#fff',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0, 150, 136, 0.5)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(45deg, #00796b, #004d40)',
                boxShadow: '0 12px 30px rgba(0, 150, 136, 0.8)',
              },
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'Upload'}
          </Button>
        </form>
  
        {response && (
          <>
            <Box
              sx={{
                marginTop: '3rem',
                padding: '2rem',
                border: '1px solid #ddd',
                borderRadius: '20px',
                backgroundColor: '#f1f8e9',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
                maxHeight: '400px',
                overflowY: 'auto',
                position: 'relative',
                animation: 'fadeIn 0.6s ease',
              }}
            >
              <IconButton
                onClick={handleCopy}
                color="primary"
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  color: '#004d40',
                  backgroundColor: '#e0f2f1',
                  '&:hover': {
                    backgroundColor: '#b2dfdb',
                  },
                }}
              >
                <ContentCopyIcon />
              </IconButton>
  
              <Typography
                variant="body1"
                color="textSecondary"
                sx={{
                  fontSize: '1rem',
                  color: '#37474f',
                  wordWrap: 'break-word',
                  whiteSpace: 'pre-wrap',
                }}
              >
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
  
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              sx={{
                marginTop: '2rem',
                padding: '1rem',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                backgroundColor: '#ff4081',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(255, 64, 129, 0.5)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#f50057',
                  boxShadow: '0 12px 35px rgba(255, 64, 129, 0.7)',
                },
              }}
              onClick={handleProveMRCClick}
            >
              Prove MRC (Machine Readable Code)
            </Button>
          </>
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
  
      {/* Animation keyframes */}
      <style jsx global>{`
        @keyframes floatingEffect {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-12px);
          }
          100% {
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </Box>
  );
  
  
  
};

export default Upload;
