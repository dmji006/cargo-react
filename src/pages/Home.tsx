import { Box, Container, Heading, Text } from "@chakra-ui/react";

const Home = () => {
  return (
    <Container maxW="container.xl" py={8}>
      <Box textAlign="center">
        <Heading as="h1" size="2xl" mb={4}>
          Home Dashboard
        </Heading>
        <Text fontSize="xl" color="gray.600">
          Welcome to your personalized dashboard
        </Text>
      </Box>
    </Container>
  );
};

export default Home;
