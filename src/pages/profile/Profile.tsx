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
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { useState } from "react";
import { updateUser } from "../../store/slices/authSlice";

const Profile = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
  });

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
      // TODO: Implement profile update API call
      const response = await fetch("http://localhost:3000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      dispatch(updateUser(data));
      toast({
        title: "Profile updated",
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
                <form onSubmit={handleSubmit}>
                  <Stack spacing={6}>
                    <Heading size="md" mb={4}>
                      Personal Information
                    </Heading>
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
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Email</FormLabel>
                        <Input
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          type="email"
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Phone</FormLabel>
                        <Input
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          type="tel"
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Address</FormLabel>
                        <Input
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                        />
                      </FormControl>
                    </Grid>
                    <Button type="submit" colorScheme="blue">
                      Save Changes
                    </Button>
                  </Stack>
                </form>
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
