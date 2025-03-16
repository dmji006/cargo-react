import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
  Icon,
  useColorModeValue,
  createIcon,
  SimpleGrid,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import {
  FaCar,
  FaComments,
  FaMoneyBillWave,
  FaShieldAlt,
} from "react-icons/fa";

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

const Home = () => {
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
          <Stack
            direction={"column"}
            spacing={3}
            align={"center"}
            alignSelf={"center"}
            position={"relative"}
          >
            <Button
              as={RouterLink}
              to="/cars"
              colorScheme={"blue"}
              bg={"blue.400"}
              rounded={"full"}
              px={6}
              _hover={{
                bg: "blue.500",
              }}
            >
              Browse Cars
            </Button>
            <Button
              as={RouterLink}
              to="/register"
              variant={"link"}
              colorScheme={"blue"}
              size={"sm"}
            >
              List Your Car
            </Button>
          </Stack>
        </Stack>
      </Container>

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
