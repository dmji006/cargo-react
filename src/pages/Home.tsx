import {
  Box,
  Heading,
  Container,
  Text,
  Stack,
  Icon,
  useColorModeValue,
  SimpleGrid,
  Image,
  Button,
  Badge,
  useToast,
} from "@chakra-ui/react";
import {
  FaCar,
  FaComments,
  FaMoneyBillWave,
  FaShieldAlt,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../store";

const Feature = ({
  title,
  text,
  icon,
}: {
  title: string;
  text: string;
  icon: any;
}) => {
  return (
    <Stack align={"center"} textAlign={"center"}>
      <Icon as={icon} w={10} h={10} color="blue.500" />
      <Text fontWeight={600}>{title}</Text>
      <Text color={"gray.600"}>{text}</Text>
    </Stack>
  );
};

const CarCard = ({ car }: { car: any }) => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const toast = useToast();

  const handleCarClick = () => {
    if (!isAuthenticated) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to view car details",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      navigate("/login");
      return;
    }
    navigate(`/cars/${car.id}`);
  };

  return (
    <Box
      bg="white"
      borderRadius="lg"
      overflow="hidden"
      shadow="sm"
      cursor="pointer"
      onClick={handleCarClick}
      transition="transform 0.2s"
      _hover={{ transform: "scale(1.02)" }}
    >
      <Image
        src={car.images[0]}
        alt={`${car.make} ${car.model}`}
        objectFit="cover"
        h="200px"
        w="100%"
      />
      <Box p={4}>
        <Stack spacing={2}>
          <Heading size="md">
            {car.make} {car.model}
          </Heading>
          <Text color="gray.600">{car.year}</Text>
          <Text fontWeight="bold" fontSize="xl">
            ₱{car.price}/day
          </Text>
          <Text fontSize="sm" color="gray.500">
            {car.location}
          </Text>
          <Badge colorScheme={car.available ? "green" : "red"}>
            {car.available ? "Available" : "Rented"}
          </Badge>
        </Stack>
      </Box>
    </Box>
  );
};

const Home = () => {
  const { cars } = useSelector((state: RootState) => state.cars);
  const availableCars = cars.filter((car) => car.available).slice(0, 6); // Show only first 6 available cars

  return (
    <Box>
      {/* Hero Section */}
      <Container maxW={"3xl"}>
        <Stack
          as={Box}
          textAlign={"center"}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 20, md: 36 }}
        >
          <Heading
            fontWeight={600}
            fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }}
            lineHeight={"110%"}
          >
            Rent a car from
            <br />
            <Text as={"span"} color={"blue.400"}>
              trusted owners
            </Text>
          </Heading>
          <Text color={"gray.500"}>
            CarGo connects car owners with renters in Barangay East Tapinac,
            Olongapo City. Find your perfect ride for any occasion, or earn
            extra income by sharing your car when you're not using it.
          </Text>
        </Stack>
      </Container>

      {/* Featured Cars Section */}
      <Box bg={useColorModeValue("white", "gray.800")} py={20}>
        <Container maxW={"6xl"}>
          <Stack spacing={8}>
            <Heading size="xl" textAlign="center">
              Featured Cars
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
              {availableCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </SimpleGrid>
            <Box textAlign="center">
              <Button as="a" href="/cars" size="lg" colorScheme="blue" mt={8}>
                View All Cars
              </Button>
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Box bg={useColorModeValue("gray.50", "gray.900")} p={20}>
        <Container maxW={"6xl"}>
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={10}>
            <Feature
              icon={FaCar}
              title={"Wide Selection"}
              text={
                "Choose from a variety of cars to suit your needs and budget."
              }
            />
            <Feature
              icon={FaMoneyBillWave}
              title={"Competitive Prices"}
              text={"Get the best deals directly from car owners in your area."}
            />
            <Feature
              icon={FaComments}
              title={"Direct Communication"}
              text={"Chat directly with car owners to arrange your rental."}
            />
            <Feature
              icon={FaShieldAlt}
              title={"Secure Platform"}
              text={"Your safety and security are our top priorities."}
            />
          </SimpleGrid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
