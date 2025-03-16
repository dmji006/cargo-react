import { ChakraProvider, Box, ColorModeScript } from "@chakra-ui/react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRoutes from "./routes";
import { store } from "./store";
import MainLayout from "./layouts/MainLayout";
import theme from "./theme";

const queryClient = new QueryClient();

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Router>
            <Box minH="100vh">
              <MainLayout>
                <AppRoutes />
              </MainLayout>
            </Box>
          </Router>
        </ChakraProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
