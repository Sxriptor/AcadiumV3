import React from 'react';
import { AppRoutes } from './routes';
import { ThemeProvider } from './components/ui/ThemeProvider';

function App() {
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;