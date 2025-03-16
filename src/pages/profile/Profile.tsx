import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  Avatar,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Grid,
  FormControl,
  FormLabel,
  Input,
  useToast,
  VStack,
  HStack,
  Divider,
  IconButton,
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { useState, useEffect } from "react";
import { updateUser } from "../../store/slices/authSlice";
import { FiEdit2 } from "react-icons/fi";

const Profile = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  console.log("Redux user state:", user); // Debug log for Redux state
  const dispatch = useDispatch();
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);

  // Initialize form data with empty strings
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      console.log("Setting form data with user data:", {
        name: user.name,
        email: user.email, // Log email specifically
        phone: user.mobileNumber,
        address: user.address,
      });
      setFormData({
        name: user.name || "",
        email: user.email || "", // Make sure email is being set
        phone: user.mobileNumber || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          mobileNumber: formData.phone,
          address: formData.address,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      dispatch(updateUser(data));
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your personal information has been updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description:
          error instanceof Error ? error.message : "Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to current user data
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.mobileNumber || "",
        address: user.address || "",
      });
    }
  };

  // Add debug log before return
  console.log("Current form data:", formData);
  console.log("Current user data:", user);

  if (!user) {
    return <Text>Please log in to view your profile</Text>;
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Grid templateColumns={{ base: "1fr", md: "250px 1fr" }} gap={8}>
        {/* Left Sidebar */}
        <Stack spacing={6}>
          <Box
            bg="white"
            p={6}
            borderRadius="lg"
            shadow="sm"
            textAlign="center"
          >
            <Avatar size="2xl" name={user.name} mb={4} />
            <Heading size="md">{user.name}</Heading>
            <Text color="gray.500">{user.role}</Text>
          </Box>

          {/* Display Personal Information in Sidebar */}
          <Box bg="white" p={6} borderRadius="lg" shadow="sm">
            <VStack align="start" spacing={4}>
              <Heading size="sm" color="gray.600">
                Personal Information
              </Heading>
              <VStack align="start" spacing={3} width="100%">
                <Box width="100%">
                  <Text fontSize="sm" color="gray.500">
                    Email
                  </Text>
                  <Text fontWeight="medium">
                    {user.email || "No email provided"}
                  </Text>
                </Box>
                <Box width="100%">
                  <Text fontSize="sm" color="gray.500">
                    Mobile Number
                  </Text>
                  <Text fontWeight="medium">{user.mobileNumber}</Text>
                </Box>
                <Box width="100%">
                  <Text fontSize="sm" color="gray.500">
                    Address
                  </Text>
                  <Text fontWeight="medium">{user.address}</Text>
                </Box>
                <Divider />
                <Box width="100%">
                  <Text fontSize="sm" color="gray.500">
                    Driver's License Number
                  </Text>
                  <Text fontWeight="medium" color="blue.600">
                    {user.licenseNumber}
                  </Text>
                  <Text fontSize="xs" color="gray.400" mt={1}>
                    (This information cannot be edited)
                  </Text>
                </Box>
              </VStack>
            </VStack>
          </Box>
        </Stack>

        {/* Main Content */}
        <Box bg="white" borderRadius="lg" shadow="sm" overflow="hidden">
          <Tabs>
            <TabList px={6} pt={4}>
              <Tab>Profile</Tab>
              <Tab>My Cars</Tab>
              <Tab>Rentals</Tab>
            </TabList>

            <TabPanels>
              {/* Profile Tab */}
              <TabPanel p={6}>
                <Stack spacing={6}>
                  <HStack justify="space-between" align="center">
                    <Heading size="md">Personal Information</Heading>
                    {!isEditing && (
                      <Button
                        leftIcon={<FiEdit2 />}
                        colorScheme="blue"
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                      >
                        Edit Profile
                      </Button>
                    )}
                  </HStack>
                  <form onSubmit={handleSubmit}>
                    <Stack spacing={6}>
                      <Grid
                        templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                        gap={6}
                      >
                        <FormControl>
                          <FormLabel>Full Name</FormLabel>
                          <Input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            isReadOnly={!isEditing}
                            bg={!isEditing ? "gray.50" : "white"}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Email</FormLabel>
                          <Input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            type="email"
                            isReadOnly={!isEditing}
                            bg={!isEditing ? "gray.50" : "white"}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Phone</FormLabel>
                          <Input
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            type="tel"
                            isReadOnly={!isEditing}
                            bg={!isEditing ? "gray.50" : "white"}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Address</FormLabel>
                          <Input
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            isReadOnly={!isEditing}
                            bg={!isEditing ? "gray.50" : "white"}
                          />
                        </FormControl>
                      </Grid>
                      {isEditing && (
                        <HStack spacing={4} justify="flex-end">
                          <Button variant="outline" onClick={handleCancel}>
                            Cancel
                          </Button>
                          <Button type="submit" colorScheme="blue">
                            Save Changes
                          </Button>
                        </HStack>
                      )}
                    </Stack>
                  </form>
                </Stack>
              </TabPanel>

              {/* My Cars Tab */}
              <TabPanel p={6}>
                <Stack spacing={6}>
                  <Heading size="md">My Listed Cars</Heading>
                  <Text color="gray.500">
                    {user.role === "owner"
                      ? "You have not listed any cars yet."
                      : "Become a car owner to list your cars."}
                  </Text>
                  {user.role === "owner" && (
                    <Button colorScheme="blue">Add New Car</Button>
                  )}
                </Stack>
              </TabPanel>

              {/* Rentals Tab */}
              <TabPanel p={6}>
                <Stack spacing={6}>
                  <Heading size="md">My Rentals</Heading>
                  <Text color="gray.500">You have no active rentals.</Text>
                </Stack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Grid>
    </Container>
  );
};

export default Profile;
