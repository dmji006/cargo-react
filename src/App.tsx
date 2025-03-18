import { ChakraProvider, Box, ColorModeScript, Flex } from "@chakra-ui/react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRoutes from "./routes";
import { store } from "./store";
import MainLayout from "./layouts/MainLayout";
import theme from "./theme";
import Sidebar from "./components/Sidebar";
import { useSelector } from "react-redux";
import { RootState } from "./store";

const queryClient = new QueryClient();

// Create a separate component for the app content to access Redux state
const AppContent = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <Router>
      <Flex>
        <Sidebar />
        <Box
          ml={user ? "250px" : "0"}
          w={user ? "calc(100% - 250px)" : "100%"}
          minH="100vh"
          bg="gray.50"
        >
          <MainLayout>
            <AppRoutes />
          </MainLayout>
        </Box>
      </Flex>
    </Router>
  );
};

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <AppContent />
        </ChakraProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
