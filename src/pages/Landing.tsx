import { Box, Container, Heading, Text, HStack, Link } from "@chakra-ui/react";

const Landing = () => {
  return (
    <Container maxW="container.xl" py={8}>
      <Box textAlign="center">
        <Heading as="h1" size="2xl" mb={4}>
          Welcome to Cargo React
        </Heading>
        <Text fontSize="xl" color="gray.600" mb={8}>
          This is the landing page of your application
        </Text>
      </Box>
    </Container>
  );
};

export default Landing;
