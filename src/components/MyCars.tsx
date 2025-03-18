import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  SimpleGrid,
  Card,
  CardBody,
  Text,
  Image,
  NumberInput,
  NumberInputField,
  Textarea,
  useToast,
  Flex,
  IconButton,
  HStack,
  AspectRatio,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Progress,
} from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import {
  AiOutlineUpload,
  AiOutlineDelete,
  AiOutlineLeft,
  AiOutlineRight,
} from "react-icons/ai";
import axios from "axios";

// Configure axios base URL
axios.defaults.baseURL = "http://localhost:5000";

// Configure axios to send auth token with requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

interface Car {
  id: string;
  brand: string;
  model: string;
  year: string;
  seats: number;
  fuel_type: string;
  transmission: string;
  description: string;
  price_per_day: number;
  images: string[];
}

interface CarCard extends Car {
  currentImageIndex: number;
}

interface NewCar {
  brand: string;
  model: string;
  year: string;
  seats: string;
  fuelType: string;
  transmission: string;
  price: string;
  description: string;
}

const MyCars = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = useSelector((state: RootState) => state.auth.user);
  const [isLoading, setIsLoading] = useState(false);
  const [cars, setCars] = useState<Car[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [currentImageIndexes, setCurrentImageIndexes] = useState<{
    [key: string]: number;
  }>({});
  const [uploadProgress, setUploadProgress] = useState(0);

  const [newCar, setNewCar] = useState<NewCar>({
    brand: "",
    model: "",
    year: "",
    seats: "",
    fuelType: "",
    transmission: "",
    price: "",
    description: "",
  });

  // Fetch user's cars on component mount
  useEffect(() => {
    fetchUserCars();
  }, []);

  const fetchUserCars = async () => {
    try {
      const response = await axios.get("/api/cars/my-cars");
      setCars(response.data);
    } catch (error) {
      toast({
        title: "Error fetching cars",
        description: "Could not load your cars",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleInputChange = (
    e:
      | React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      | string,
    name?: string
  ) => {
    if (typeof e === "string" && name) {
      // Handle NumberInput changes
      setNewCar((prev) => ({
        ...prev,
        [name]: e,
      }));
    } else if (typeof e === "object") {
      // Handle regular input changes
      const { name, value } = e.target;
      setNewCar((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = (progressEvent.loaded / progressEvent.total) * 100;
            setUploadProgress(progress);
          }
        },
      });

      return response.data.url;
    });

    const urls = await Promise.all(uploadPromises);
    setUploadProgress(0);
    return urls;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      // Limit to 5 images
      const selectedFiles = files.slice(0, 5);
      setImageFiles(selectedFiles);

      // Create preview URLs
      const newPreviewUrls = selectedFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setImagePreviewUrls((prevUrls) => {
        // Clean up old preview URLs
        prevUrls.forEach((url) => URL.revokeObjectURL(url));
        return newPreviewUrls;
      });
    }
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviewUrls((prev) => {
      const newUrls = prev.filter((_, i) => i !== index);
      URL.revokeObjectURL(prev[index]);
      return newUrls;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (imageFiles.length === 0) {
      toast({
        title: "Please upload at least one image",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setIsLoading(true);

    try {
      // First upload images
      const imageUrls = await uploadImages(imageFiles);

      // Then create car listing
      const carData = {
        ...newCar,
        price: parseFloat(newCar.price),
        seats: parseInt(newCar.seats, 10),
        images: imageUrls,
      };

      const response = await axios.post("/api/cars", carData);

      // Add new car to state
      setCars((prev) => [...prev, response.data.car]);

      toast({
        title: "Car posted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Reset form
      setNewCar({
        brand: "",
        model: "",
        year: "",
        seats: "",
        fuelType: "",
        transmission: "",
        price: "",
        description: "",
      });
      setImageFiles([]);
      setImagePreviewUrls([]);
      onClose();
    } catch (error) {
      toast({
        title: "Error posting car",
        description: "Please try again later",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (carId: string) => {
    try {
      await axios.delete(`/api/cars/${carId}`);
      setCars((prev) => prev.filter((car) => car.id !== carId));
      toast({
        title: "Car deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error deleting car",
        description: "Please try again later",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const navigateImage = (carId: string, direction: "prev" | "next") => {
    const car = cars.find((c) => c.id === carId);
    if (!car) return;

    setCurrentImageIndexes((prev) => {
      const currentIndex = prev[carId] || 0;
      const newIndex =
        direction === "prev"
          ? (currentIndex - 1 + car.images.length) % car.images.length
          : (currentIndex + 1) % car.images.length;
      return { ...prev, [carId]: newIndex };
    });
  };

  const PostCarForm = () => (
    <form onSubmit={(e) => e.preventDefault()}>
      <VStack spacing={4}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} width="100%">
          <FormControl isRequired>
            <FormLabel>Car Brand</FormLabel>
            <Input
              name="brand"
              value={newCar.brand}
              onChange={handleInputChange}
              placeholder="e.g., Toyota"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Car Model</FormLabel>
            <Input
              name="model"
              value={newCar.model}
              onChange={handleInputChange}
              placeholder="e.g., Camry"
            />
          </FormControl>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} width="100%">
          <FormControl isRequired>
            <FormLabel>Year</FormLabel>
            <Input
              name="year"
              value={newCar.year}
              onChange={handleInputChange}
              placeholder="e.g., 2020"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Number of Seats</FormLabel>
            <NumberInput min={1} max={15}>
              <NumberInputField
                name="seats"
                value={newCar.seats}
                onChange={(valueString) =>
                  handleInputChange(valueString, "seats")
                }
                placeholder="e.g., 5"
              />
            </NumberInput>
          </FormControl>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} width="100%">
          <FormControl isRequired>
            <FormLabel>Type of Gasoline</FormLabel>
            <Select
              name="fuelType"
              value={newCar.fuelType}
              onChange={handleInputChange}
              placeholder="Select fuel type"
            >
              <option value="Gasoline">Gasoline</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Transmission Type</FormLabel>
            <Select
              name="transmission"
              value={newCar.transmission}
              onChange={handleInputChange}
              placeholder="Select transmission type"
            >
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
              <option value="CVT">CVT</option>
            </Select>
          </FormControl>
        </SimpleGrid>

        <FormControl isRequired>
          <FormLabel>Price per Day (USD)</FormLabel>
          <NumberInput min={0}>
            <NumberInputField
              name="price"
              value={newCar.price}
              onChange={(valueString) =>
                handleInputChange(valueString, "price")
              }
              placeholder="e.g., 50"
            />
          </NumberInput>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Car Images (Up to 5 images)</FormLabel>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            multiple
            style={{ display: "none" }}
          />
          <Button
            leftIcon={<AiOutlineUpload />}
            onClick={() => fileInputRef.current?.click()}
            width="100%"
            mb={4}
          >
            Upload Images
          </Button>
          {imagePreviewUrls.length > 0 && (
            <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} spacing={4}>
              {imagePreviewUrls.map((url, index) => (
                <Box key={index} position="relative">
                  <Image
                    src={url}
                    alt={`Preview ${index + 1}`}
                    borderRadius="md"
                    objectFit="cover"
                    height="100px"
                  />
                  <IconButton
                    icon={<AiOutlineDelete />}
                    aria-label="Remove image"
                    size="sm"
                    position="absolute"
                    top={1}
                    right={1}
                    onClick={() => removeImage(index)}
                  />
                </Box>
              ))}
            </SimpleGrid>
          )}
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Car Description</FormLabel>
          <Textarea
            name="description"
            value={newCar.description}
            onChange={handleInputChange}
            placeholder="Describe your car's features, condition, additional amenities, etc."
            rows={4}
          />
        </FormControl>

        {uploadProgress > 0 && <Progress value={uploadProgress} width="100%" />}
      </VStack>
    </form>
  );

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Flex justify="space-between" align="center">
          <Heading>My Listed Cars</Heading>
          <Button colorScheme="blue" onClick={onOpen}>
            Post New Car
          </Button>
        </Flex>

        {/* Post Car Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent maxW="800px">
            <ModalHeader>Post Your Car for Rent</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <PostCarForm />
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleSubmit}
                isLoading={isLoading}
              >
                Post Car
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {cars.length === 0 ? (
          <Box textAlign="center" py={10}>
            <Text fontSize="lg" color="gray.600">
              You haven't posted any cars yet. Click "Post New Car" to get
              started!
            </Text>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {cars.map((car) => (
              <Card key={car.id}>
                <CardBody>
                  <Box position="relative">
                    <AspectRatio ratio={16 / 9}>
                      <Image
                        src={car.images[currentImageIndexes[car.id] || 0]}
                        alt={`${car.brand} ${car.model}`}
                        borderRadius="lg"
                        objectFit="cover"
                      />
                    </AspectRatio>
                    {car.images.length > 1 && (
                      <>
                        <IconButton
                          icon={<AiOutlineLeft />}
                          aria-label="Previous image"
                          size="sm"
                          position="absolute"
                          left={2}
                          top="50%"
                          transform="translateY(-50%)"
                          onClick={() => navigateImage(car.id, "prev")}
                        />
                        <IconButton
                          icon={<AiOutlineRight />}
                          aria-label="Next image"
                          size="sm"
                          position="absolute"
                          right={2}
                          top="50%"
                          transform="translateY(-50%)"
                          onClick={() => navigateImage(car.id, "next")}
                        />
                        <HStack
                          spacing={1}
                          position="absolute"
                          bottom={2}
                          left="50%"
                          transform="translateX(-50%)"
                        >
                          {car.images.map((_, index) => (
                            <Box
                              key={index}
                              w="2"
                              h="2"
                              borderRadius="full"
                              bg={
                                index === (currentImageIndexes[car.id] || 0)
                                  ? "white"
                                  : "whiteAlpha.600"
                              }
                            />
                          ))}
                        </HStack>
                      </>
                    )}
                  </Box>
                  <VStack align="stretch" spacing={2} mt={4}>
                    <Heading size="md">
                      {car.brand} {car.model} ({car.year})
                    </Heading>
                    <Text color="blue.600" fontSize="2xl">
                      ${car.price_per_day}/day
                    </Text>
                    <SimpleGrid columns={2} spacing={2}>
                      <Text fontSize="sm">Seats: {car.seats}</Text>
                      <Text fontSize="sm">Fuel: {car.fuel_type}</Text>
                      <Text fontSize="sm">
                        Transmission: {car.transmission}
                      </Text>
                    </SimpleGrid>
                    <Text noOfLines={3}>{car.description}</Text>
                    <Flex mt={2} gap={2}>
                      <Button colorScheme="blue" variant="outline" flex={1}>
                        Edit
                      </Button>
                      <Button
                        colorScheme="red"
                        variant="outline"
                        flex={1}
                        onClick={() => handleDelete(car.id)}
                      >
                        Remove
                      </Button>
                    </Flex>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </VStack>
    </Container>
  );
};

export default MyCars;
