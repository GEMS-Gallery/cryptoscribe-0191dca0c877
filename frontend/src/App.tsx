import React, { useState } from 'react';
import { Container, Typography, TextField, Button, CircularProgress, Box } from '@mui/material';
import { backend } from 'declarations/backend';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [design, setDesign] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateDesign = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await backend.generateDesign(prompt);
      setDesign(result);
    } catch (err) {
      setError('Failed to generate design. Please try again.');
      console.error('Error generating design:', err);
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h2" component="h1" gutterBottom>
        GEMS Design Generator
      </Typography>
      <Box mb={2}>
        <TextField
          fullWidth
          label="Enter your design prompt"
          variant="outlined"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          multiline
          rows={4}
        />
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleGenerateDesign}
        disabled={loading || !prompt.trim()}
      >
        Generate Design
      </Button>
      {loading && <CircularProgress style={{ marginLeft: 16 }} />}
      {error && (
        <Typography color="error" style={{ marginTop: 16 }}>
          {error}
        </Typography>
      )}
      {design && (
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            Generated Design:
          </Typography>
          <div className="design-output">{design}</div>
        </Box>
      )}
    </Container>
  );
};

export default App;