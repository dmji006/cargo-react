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
  Input,
  Select,
  HStack,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../store";
import { updateFilters } from "../../store/slices/carSlice";
import { useState, useEffect } from "react";

const CarListing = () => {
  const { cars, filters, loading } = useSelector(
    (state: RootState) => state.cars
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [priceRange, setPriceRange] = useState<[number, number]>(
    filters.priceRange
  );
  const [location, setLocation] = useState(filters.location);
  const [showAvailable, setShowAvailable] = useState(filters.available);

  useEffect(() => {
    dispatch(
      updateFilters({
        priceRange,
        location,
        available: showAvailable,
      })
    );
  }, [priceRange, location, showAvailable, dispatch]);

  const handleCarClick = (carId: string) => {
    navigate(`/cars/${carId}`);
  };

  const handlePriceRangeChange = (values: number[]) => {
    setPriceRange([values[0], values[1]]);
  };

  const filteredCars = cars.filter((car) => {
    const matchesPrice =
      car.price >= priceRange[0] && car.price <= priceRange[1];
    const matchesLocation =
      !location || car.location.toLowerCase().includes(location.toLowerCase());
    const matchesAvailability = !showAvailable || car.available;

    return matchesPrice && matchesLocation && matchesAvailability;
  });

  return (
    <Container maxW="container.xl" py={8}>
      <Stack spacing={8}>
        <Box>
          <Heading size="lg" mb={4}>
            Available Cars in East Tapinac
          </Heading>
          <Text color="gray.600">
            Find and rent the perfect car for your needs
          </Text>
        </Box>

        {/* Filters */}
        <Box bg="white" p={6} borderRadius="lg" shadow="sm">
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <Box>
              <Text mb={2}>Price Range</Text>
              <RangeSlider
                min={0}
                max={10000}
                step={100}
                value={priceRange}
                onChange={handlePriceRangeChange}
              >
                <RangeSliderTrack>
                  <RangeSliderFilledTrack />
                </RangeSliderTrack>
                <RangeSliderThumb index={0} />
                <RangeSliderThumb index={1} />
              </RangeSlider>
              <HStack justify="space-between" mt={2}>
                <Text fontSize="sm">₱{priceRange[0]}</Text>
                <Text fontSize="sm">₱{priceRange[1]}</Text>
              </HStack>
            </Box>
            <Box>
              <Text mb={2}>Location</Text>
              <Input
                placeholder="Search location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </Box>
            <Box>
              <Text mb={2}>Availability</Text>
              <Select
                value={showAvailable ? "available" : "all"}
                onChange={(e) =>
                  setShowAvailable(e.target.value === "available")
                }
              >
                <option value="all">All Cars</option>
                <option value="available">Available Only</option>
              </Select>
            </Box>
          </SimpleGrid>
        </Box>

        {/* Car Grid */}
        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
          {filteredCars.map((car) => (
            <Box
              key={car.id}
              bg="white"
              borderRadius="lg"
              overflow="hidden"
              shadow="sm"
              cursor="pointer"
              onClick={() => handleCarClick(car.id)}
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
                  <HStack>
                    <Badge colorScheme={car.available ? "green" : "red"}>
                      {car.available ? "Available" : "Rented"}
                    </Badge>
                    {car.features.slice(0, 2).map((feature) => (
                      <Badge key={feature} colorScheme="blue">
                        {feature}
                      </Badge>
                    ))}
                  </HStack>
                </Stack>
              </Box>
            </Box>
          ))}
        </Grid>
      </Stack>
    </Container>
  );
};

export default CarListing;
