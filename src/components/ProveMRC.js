import React, { useState } from 'react';
import { Container, Typography, Button, TextField, Snackbar, Alert } from '@mui/material';

const ProveMRC = () => {
    const [code, setCode] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleCheck = () => {
        // Logic to check if the code is machine-readable
        if (code.trim()) {
            if (isMachineReadable(code)) {
                setResult('Yes, it is machine-readable code');
                setError(null);
            } else {
                setResult('No, it is not machine-readable');
                setError(null);
            }
        } else {
            setError('Please enter some code to check.');
            setResult(null);
        }
    };

    const isMachineReadable = (input) => {
        // Implement your logic to check machine-readability
        return input.includes('MRC'); // Dummy logic for demo purposes
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
                    open={true}
                    autoHideDuration={6000}
                    onClose={() => setError(null)}
                >
                    <Alert severity="error">
                        {error}
                    </Alert>
                </Snackbar>
            )}
        </Container>
    );
};

export default ProveMRC;
