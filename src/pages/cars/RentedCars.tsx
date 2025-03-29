import { Box, Container, Heading, Text } from "@chakra-ui/react";

const RentedCars = () => {
  return (
    <Container maxW="container.xl" py={8}>
      <Box textAlign="center">
        <Heading as="h1" size="2xl" mb={4}>
          My Rented Cars
        </Heading>
        <Text fontSize="xl" color="gray.600">
          This is the list of cars you have rented
        </Text>
      </Box>
    </Container>
  );
};

export default RentedCars;
