import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  Image,
  Stack,
  Button,
  Badge,
  SimpleGrid,
  Divider,
  Avatar,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { RootState } from "../../store";
import { useState } from "react";
import { FaCar, FaGasPump, FaCog, FaUsers } from "react-icons/fa";

const CarDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { cars } = useSelector((state: RootState) => state.cars);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const navigate = useNavigate();
  const toast = useToast();

  const car = cars.find((c) => c.id === id);

  const [selectedImage, setSelectedImage] = useState(car?.images[0] || "");

  const handleRentClick = () => {
    if (!isAuthenticated) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to rent a car",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      navigate("/login");
      return;
    }

    // TODO: Implement rental logic
    toast({
      title: "Coming soon",
      description: "Rental functionality will be available soon",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  if (!car) {
    return (
      <Container maxW="container.xl" py={8}>
        <Text>Car not found</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
        {/* Left Column - Car Images and Details */}
        <Stack spacing={8}>
          <Box bg="white" borderRadius="lg" overflow="hidden" shadow="sm">
            <Image
              src={selectedImage || car.images[0]}
              alt={`${car.make} ${car.model}`}
              objectFit="cover"
              w="100%"
              h="400px"
            />
            <SimpleGrid columns={4} p={4} spacing={4}>
              {car.images.map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  alt={`${car.make} ${car.model} view ${index + 1}`}
                  objectFit="cover"
                  h="80px"
                  w="100%"
                  cursor="pointer"
                  opacity={selectedImage === image ? 1 : 0.6}
                  onClick={() => setSelectedImage(image)}
                  borderRadius="md"
                />
              ))}
            </SimpleGrid>
          </Box>

          <Box bg="white" p={6} borderRadius="lg" shadow="sm">
            <Heading size="md" mb={4}>
              Car Features
            </Heading>
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
              <Stack align="center" textAlign="center">
                <Box as={FaCar} size="24px" color="blue.500" />
                <Text fontWeight="medium">{car.year}</Text>
                <Text color="gray.500" fontSize="sm">
                  Year
                </Text>
              </Stack>
              <Stack align="center" textAlign="center">
                <Box as={FaGasPump} size="24px" color="blue.500" />
                <Text fontWeight="medium">Gasoline</Text>
                <Text color="gray.500" fontSize="sm">
                  Fuel Type
                </Text>
              </Stack>
              <Stack align="center" textAlign="center">
                <Box as={FaCog} size="24px" color="blue.500" />
                <Text fontWeight="medium">Automatic</Text>
                <Text color="gray.500" fontSize="sm">
                  Transmission
                </Text>
              </Stack>
              <Stack align="center" textAlign="center">
                <Box as={FaUsers} size="24px" color="blue.500" />
                <Text fontWeight="medium">5</Text>
                <Text color="gray.500" fontSize="sm">
                  Seats
                </Text>
              </Stack>
            </SimpleGrid>
          </Box>

          <Box bg="white" p={6} borderRadius="lg" shadow="sm">
            <Heading size="md" mb={4}>
              Description
            </Heading>
            <Text color="gray.600">{car.description}</Text>
          </Box>
        </Stack>

        {/* Right Column - Pricing and Owner Info */}
        <Box>
          <Stack spacing={6} position="sticky" top="24px">
            <Box bg="white" p={6} borderRadius="lg" shadow="sm">
              <Stack spacing={4}>
                <Heading size="lg">₱{car.price}/day</Heading>
                <Badge
                  colorScheme={car.available ? "green" : "red"}
                  alignSelf="start"
                >
                  {car.available ? "Available" : "Currently Rented"}
                </Badge>
                <Divider />
                <Button
                  colorScheme="blue"
                  size="lg"
                  onClick={handleRentClick}
                  isDisabled={!car.available}
                >
                  Rent Now
                </Button>
              </Stack>
            </Box>

            <Box bg="white" p={6} borderRadius="lg" shadow="sm">
              <Heading size="md" mb={4}>
                Car Owner
              </Heading>
              <HStack spacing={4}>
                <Avatar size="lg" name="Car Owner" />
                <Box>
                  <Text fontWeight="bold">John Doe</Text>
                  <Text color="gray.500">Member since 2024</Text>
                </Box>
              </HStack>
              <Button
                variant="outline"
                colorScheme="blue"
                mt={4}
                w="100%"
                onClick={() => {
                  if (!isAuthenticated) {
                    toast({
                      title: "Please log in",
                      description:
                        "You need to be logged in to contact the owner",
                      status: "warning",
                      duration: 3000,
                      isClosable: true,
                    });
                    navigate("/login");
                    return;
                  }
                  // TODO: Implement chat functionality
                }}
              >
                Contact Owner
              </Button>
            </Box>
          </Stack>
        </Box>
      </Grid>
    </Container>
  );
};

export default CarDetails;
