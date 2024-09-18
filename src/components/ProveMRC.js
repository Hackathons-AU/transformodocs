import React, { useState } from 'react';
import { Container, Typography, Button, TextField, Snackbar, Alert } from '@mui/material';
import axios from 'axios';

const ProveMRC = () => {
    const [code, setCode] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleCheck = async () => {
        if (code.trim()) {
            try {
                const response = await axios.post('http://localhost:5000/check-mrc', {
                    content: code
                });

                setResult(response.data.isReadable ? 'Yes, it is machine-readable code' : 'No, it is not machine-readable');
                setError(null);
            } catch (err) {
                setError('Error checking machine readability. Please try again.');
                setResult(null);
            }
        } else {
            setError('Please enter some code to check.');
            setResult(null);
        }
    };

    return (
        <Container component="main" maxWidth="sm" style={{ marginTop: '2rem' }}>
            <Typography variant="h4" gutterBottom>
                Prove MRC (Machine Readable Code)
            </Typography>
            <TextField
                fullWidth
                variant="outlined"
                label="Enter Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                margin="normal"
            />
            <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleCheck}
                style={{ marginTop: '1rem' }}
            >
                Check
            </Button>
            {result && (
                <Typography variant="h6" color="textPrimary" style={{ marginTop: '1rem' }}>
                    {result}
                </Typography>
            )}
            {error && (
                <Snackbar
                    open={Boolean(error)}
                    autoHideDuration={6000}
                    onClose={() => setError(null)}
                >
                    <Alert severity="error" onClose={() => setError(null)}>
                        {error}
                    </Alert>
                </Snackbar>
            )}
        </Container>
    );
};

export default ProveMRC;

