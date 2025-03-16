import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
} from "@chakra-ui/react";

const Dashboard = () => {
  return (
    <Container maxW="container.xl" py={8}>
      <Stack spacing={8}>
        <Heading size="lg">Owner Dashboard</Heading>

        {/* Stats Grid */}
        <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={6}>
          <Stat bg="white" p={6} borderRadius="lg" shadow="sm">
            <StatLabel>Total Cars</StatLabel>
            <StatNumber>5</StatNumber>
            <StatHelpText>Listed for rent</StatHelpText>
          </Stat>
          <Stat bg="white" p={6} borderRadius="lg" shadow="sm">
            <StatLabel>Active Rentals</StatLabel>
            <StatNumber>3</StatNumber>
            <StatHelpText>Currently rented</StatHelpText>
          </Stat>
          <Stat bg="white" p={6} borderRadius="lg" shadow="sm">
            <StatLabel>Total Earnings</StatLabel>
            <StatNumber>₱15,000</StatNumber>
            <StatHelpText>This month</StatHelpText>
          </Stat>
          <Stat bg="white" p={6} borderRadius="lg" shadow="sm">
            <StatLabel>Pending Requests</StatLabel>
            <StatNumber>2</StatNumber>
            <StatHelpText>Awaiting approval</StatHelpText>
          </Stat>
        </Grid>

        {/* Recent Transactions */}
        <Box bg="white" p={6} borderRadius="lg" shadow="sm">
          <Heading size="md" mb={4}>
            Recent Transactions
          </Heading>
          <Table>
            <Thead>
              <Tr>
                <Th>Car</Th>
                <Th>Renter</Th>
                <Th>Period</Th>
                <Th>Amount</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>Toyota Vios 2022</Td>
                <Td>John Doe</Td>
                <Td>Mar 1 - Mar 3</Td>
                <Td>₱3,000</Td>
                <Td>
                  <Badge colorScheme="green">Completed</Badge>
                </Td>
              </Tr>
              <Tr>
                <Td>Honda City 2023</Td>
                <Td>Jane Smith</Td>
                <Td>Mar 5 - Mar 7</Td>
                <Td>₱3,500</Td>
                <Td>
                  <Badge colorScheme="blue">Active</Badge>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
      </Stack>
    </Container>
  );
};

export default Dashboard;
