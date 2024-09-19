import React, { useState } from 'react';
import { Container, Typography, Button, TextField, Snackbar, Alert, Box } from '@mui/material';
import axios from 'axios';
import bgImage from '../assets/images/bg1.jpg'; // Sample background image

const ProveMRC = () => {
    const [code, setCode] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);

    const handleCheck = async () => {
        if (code.trim()) {
            try {
                const response = await axios.post('http://localhost:5000/check-mrc', {
                    content: code
                });
                setResult(response.data.isReadable ? 'Yes, it is machine-readable code' : 'No, it is not machine-readable');
                setError(null);
                setOpen(true);
            } catch (err) {
                setError('Error checking machine readability. Please try again.');
                setResult(null);
                setOpen(true);
            }
        } else {
            setError('Please enter some code to check.');
            setResult(null);
            setOpen(true);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundImage: `url(${bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '2rem', // Add padding to the whole section
                filter: 'brightness(0.95) contrast(1.1)',
            }}
        >
            <Container
                component="main"
                maxWidth="sm"
                sx={{
                    padding: '3rem',
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '20px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
                    backdropFilter: 'blur(8px)',
                    margin: '2rem', // Add margin around the container for extra spacing
                    animation: 'scaleUp 0.6s ease',
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        color: '#004d40',
                        fontWeight: 'bold',
                        fontSize: '2rem',
                        marginBottom: '1.5rem',
                        textShadow: '0 5px 10px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    Prove MRC (Machine Readable Code)
                </Typography>

                <TextField
                    fullWidth
                    variant="outlined"
                    label="Enter Code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    sx={{
                        marginBottom: '1.5rem',
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            background: 'rgba(255, 255, 255, 0.8)',
                            boxShadow: '0 5px 15px rgba(0, 128, 128, 0.3)',
                        },
                    }}
                />

                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleCheck}
                    sx={{
                        padding: '0.8rem',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        borderRadius: '12px',
                        backgroundColor: '#26a69a',
                        boxShadow: '0 10px 25px rgba(0, 128, 128, 0.4)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            backgroundColor: '#004d40',
                            boxShadow: '0 12px 30px rgba(0, 128, 128, 0.6)',
                        },
                    }}
                >
                    Check
                </Button>

                {result && (
                    <Typography
                        variant="h6"
                        color="textPrimary"
                        sx={{
                            marginTop: '1.5rem',
                            padding: '1rem',
                            backgroundColor: result.includes('Yes') ? '#e0f7fa' : '#ffebee',
                            borderRadius: '12px',
                            boxShadow: '0 5px 15px rgba(0, 128, 128, 0.3)',
                            transition: 'opacity 0.3s ease',
                            opacity: result ? 1 : 0,
                        }}
                    >
                        {result}
                    </Typography>
                )}

                <Snackbar
                    open={open}
                    autoHideDuration={6000}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    {error ? (
                        <Alert severity="error" onClose={handleClose}>
                            {error}
                        </Alert>
                    ) : (
                        <Alert severity="success" onClose={handleClose}>
                            {result}
                        </Alert>
                    )}
                </Snackbar>
            </Container>

            <style jsx>{`
                @keyframes scaleUp {
                    0% {
                        transform: scale(0.8);
                        opacity: 0;
                    }
                    100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
            `}</style>
        </Box>
    );
};

export default ProveMRC;
