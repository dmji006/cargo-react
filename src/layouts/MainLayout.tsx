import { Box, Container } from "@chakra-ui/react";
import { ReactNode } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <Box>
      <Navbar />
      <Container maxW="container.xl" py={8}>
        {children}
      </Container>
      <Footer />
    </Box>
  );
};

export default MainLayout;
