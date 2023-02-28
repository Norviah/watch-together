import Link from 'next/link';

import { Box, Button, Typography } from '@mui/material';
import { Component } from 'react';

export default class Error extends Component {
  render() {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography variant="h4" align="center">
          404: Page Not Found
        </Typography>
        <br />
        <Button component={Link} href="/" variant="contained" color="primary" size="small">
          Go to home page
        </Button>
      </Box>
    );
  }
}
