import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useToast,
  Textarea,
  Checkbox,
  FormErrorMessage,
  InputGroup,
  InputLeftAddon,
  VStack,
  Icon,
  Image,
  Center,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { loginSuccess } from "../../store/slices/authSlice";
import { FiUploadCloud } from "react-icons/fi";
import Swal from "sweetalert2";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    address: "",
    password: "",
    confirmPassword: "",
    driversLicenseFront: null as File | null,
    driversLicenseBack: null as File | null,
    licenseNumber: "",
    agreeToTerms: false,
  });
  const [previewUrls, setPreviewUrls] = useState({
    front: null as string | null,
    back: null as string | null,
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    address: "",
    password: "",
    confirmPassword: "",
    driversLicenseFront: "",
    driversLicenseBack: "",
    licenseNumber: "",
    agreeToTerms: "",
  });
  const frontFileInputRef = useRef<HTMLInputElement>(null);
  const backFileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [name]: checkbox.checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Validate mobile number
    if (name === "mobileNumber") {
      const mobileRegex = /^(09|\+639)\d{9}$/;
      if (!mobileRegex.test(value)) {
        setErrors((prev) => ({
          ...prev,
          mobileNumber:
            "Please enter a valid Philippine mobile number (e.g., 09123456789 or +639123456789)",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          mobileNumber: "",
        }));
      }
    }

    // Validate email
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setErrors((prev) => ({
          ...prev,
          email: "Please enter a valid email address",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          email: "",
        }));
      }
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    side: "front" | "back"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls((prev) => ({
          ...prev,
          [side]: reader.result as string,
        }));

        setFormData((prev) => ({
          ...prev,
          [side === "front" ? "driversLicenseFront" : "driversLicenseBack"]:
            file,
        }));
        setErrors((prev) => ({
          ...prev,
          [side === "front" ? "driversLicenseFront" : "driversLicenseBack"]: "",
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent, side: "front" | "back") => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls((prev) => ({
          ...prev,
          [side]: reader.result as string,
        }));

        setFormData((prev) => ({
          ...prev,
          [side === "front" ? "driversLicenseFront" : "driversLicenseBack"]:
            file,
        }));
        setErrors((prev) => ({
          ...prev,
          [side === "front" ? "driversLicenseFront" : "driversLicenseBack"]: "",
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      mobileNumber: "",
      address: "",
      password: "",
      confirmPassword: "",
      driversLicenseFront: "",
      driversLicenseBack: "",
      licenseNumber: "",
      agreeToTerms: "",
    };

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (!/^[A-Za-z\s\-'\.]+$/.test(formData.name)) {
      newErrors.name =
        "Name can only contain letters, spaces, hyphens, apostrophes, and periods";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    }

    // Mobile number validation
    if (!formData.mobileNumber) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^(09|\+639)\d{9}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber =
        "Please enter a valid Philippine mobile number (e.g., 09123456789 or +639123456789)";
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    // License number validation
    if (!formData.licenseNumber) {
      newErrors.licenseNumber = "Driver's license number is required";
    } else if (!/^[A-Z]\d{2}-\d{2}-\d{6}$/.test(formData.licenseNumber)) {
      newErrors.licenseNumber =
        "Invalid license number format. Must be in format C09-10-XXXXXX where X is a digit";
    }

    // Driver's license file validation
    if (!formData.driversLicenseFront) {
      newErrors.driversLicenseFront =
        "Front image of driver's license is required";
    }
    if (!formData.driversLicenseBack) {
      newErrors.driversLicenseBack =
        "Back image of driver's license is required";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Terms agreement validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire({
        title: "Validation Error",
        text: "Please fix the errors in the form before submitting",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("mobileNumber", formData.mobileNumber);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("licenseNumber", formData.licenseNumber);
      if (formData.driversLicenseFront) {
        formDataToSend.append(
          "driversLicenseFront",
          formData.driversLicenseFront
        );
      }
      if (formData.driversLicenseBack) {
        formDataToSend.append(
          "driversLicenseBack",
          formData.driversLicenseBack
        );
      }

      // Show loading state
      Swal.fire({
        title: "Creating Account",
        html: "Please wait while we process your registration...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Dispatch login action with the user data
      dispatch(loginSuccess(data.data));

      // Show success message
      await Swal.fire({
        title: "Success!",
        text: "Your account has been created successfully!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      // Navigate to profile page
      navigate("/profile");
    } catch (error) {
      Swal.fire({
        title: "Registration Failed",
        text: error instanceof Error ? error.message : "Please try again",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <Container
      maxW="xl"
      py={{ base: "12", md: "24" }}
      px={{ base: "4", sm: "8" }}
    >
      <Stack spacing="8">
        <Stack spacing="6" textAlign="center">
          <Heading size={{ base: "xl", md: "2xl" }}>Create an account</Heading>
          <Text color="gray.600" fontSize="lg">
            Already have an account?{" "}
            <Button
              as={RouterLink}
              to="/login"
              variant="link"
              colorScheme="blue"
              fontSize="lg"
            >
              Sign in
            </Button>
          </Text>
        </Stack>
        <Box
          py={{ base: "6", sm: "8" }}
          px={{ base: "6", sm: "10" }}
          bg={useColorModeValue("white", "gray.800")}
          boxShadow="xl"
          borderRadius="xl"
        >
          <form onSubmit={handleSubmit}>
            <VStack spacing="6">
              <FormControl isInvalid={!!errors.name}>
                <FormLabel htmlFor="name" fontSize="md">
                  Full Name
                </FormLabel>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  size="lg"
                  borderRadius="md"
                  _focus={{
                    borderColor: "blue.400",
                    boxShadow: "0 0 0 1px blue.400",
                  }}
                />
                <FormErrorMessage>{errors.name}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.email}>
                <FormLabel htmlFor="email" fontSize="md">
                  Email Address
                </FormLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  size="lg"
                  borderRadius="md"
                  _focus={{
                    borderColor: "blue.400",
                    boxShadow: "0 0 0 1px blue.400",
                  }}
                />
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.mobileNumber}>
                <FormLabel htmlFor="mobileNumber" fontSize="md">
                  Mobile Number
                </FormLabel>
                <InputGroup size="lg">
                  <Input
                    id="mobileNumber"
                    name="mobileNumber"
                    type="tel"
                    placeholder="09*********"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    required
                    borderRadius="md"
                  />
                </InputGroup>
                <FormErrorMessage>{errors.mobileNumber}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.licenseNumber}>
                <FormLabel htmlFor="licenseNumber" fontSize="md">
                  Driver's License Number
                </FormLabel>
                <Input
                  id="licenseNumber"
                  name="licenseNumber"
                  type="text"
                  placeholder="C09-10-XXXXXX"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  required
                  size="lg"
                  borderRadius="md"
                />
                <FormErrorMessage>{errors.licenseNumber}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.address}>
                <FormLabel htmlFor="address" fontSize="md">
                  Complete Address
                </FormLabel>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="Enter your complete address"
                  size="lg"
                  borderRadius="md"
                  rows={3}
                />
                <FormErrorMessage>{errors.address}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.password}>
                <FormLabel htmlFor="password" fontSize="md">
                  Password
                </FormLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  size="lg"
                  borderRadius="md"
                />
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.confirmPassword}>
                <FormLabel htmlFor="confirmPassword" fontSize="md">
                  Confirm Password
                </FormLabel>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  size="lg"
                  borderRadius="md"
                />
                <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={
                  !!errors.driversLicenseFront || !!errors.driversLicenseBack
                }
              >
                <FormLabel fontSize="md">Driver's License Images</FormLabel>

                {/* Front Image Upload */}
                <Box mb={4}>
                  <Text fontSize="sm" mb={2} color="gray.600">
                    Front Side
                  </Text>
                  <Input
                    id="driversLicenseFront"
                    name="driversLicenseFront"
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={(e) => handleFileChange(e, "front")}
                    hidden
                    ref={frontFileInputRef}
                  />
                  <Box
                    borderWidth={2}
                    borderRadius="xl"
                    borderStyle="dashed"
                    borderColor={useColorModeValue("gray.300", "gray.600")}
                    p={6}
                    cursor="pointer"
                    onClick={() => frontFileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, "front")}
                    _hover={{
                      borderColor: "blue.400",
                    }}
                  >
                    {previewUrls.front ? (
                      <VStack spacing={4}>
                        <Image
                          src={previewUrls.front}
                          alt="License Front Preview"
                          maxH="200px"
                          borderRadius="md"
                        />
                        <Text color="gray.500" fontSize="sm">
                          Click or drag a new image to change front side
                        </Text>
                      </VStack>
                    ) : (
                      <Center flexDir="column" p={6}>
                        <Icon
                          as={FiUploadCloud}
                          w={10}
                          h={10}
                          color="blue.500"
                          mb={4}
                        />
                        <Text fontWeight="medium" mb={2}>
                          Upload Front Side
                        </Text>
                        <Text color="gray.500" fontSize="sm" textAlign="center">
                          Drag and drop here or click to upload
                          <br />
                          JPG, JPEG or PNG (max. 5MB)
                        </Text>
                      </Center>
                    )}
                  </Box>
                  <FormErrorMessage>
                    {errors.driversLicenseFront}
                  </FormErrorMessage>
                </Box>

                {/* Back Image Upload */}
                <Box>
                  <Text fontSize="sm" mb={2} color="gray.600">
                    Back Side
                  </Text>
                  <Input
                    id="driversLicenseBack"
                    name="driversLicenseBack"
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={(e) => handleFileChange(e, "back")}
                    hidden
                    ref={backFileInputRef}
                  />
                  <Box
                    borderWidth={2}
                    borderRadius="xl"
                    borderStyle="dashed"
                    borderColor={useColorModeValue("gray.300", "gray.600")}
                    p={6}
                    cursor="pointer"
                    onClick={() => backFileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, "back")}
                    _hover={{
                      borderColor: "blue.400",
                    }}
                  >
                    {previewUrls.back ? (
                      <VStack spacing={4}>
                        <Image
                          src={previewUrls.back}
                          alt="License Back Preview"
                          maxH="200px"
                          borderRadius="md"
                        />
                        <Text color="gray.500" fontSize="sm">
                          Click or drag a new image to change back side
                        </Text>
                      </VStack>
                    ) : (
                      <Center flexDir="column" p={6}>
                        <Icon
                          as={FiUploadCloud}
                          w={10}
                          h={10}
                          color="blue.500"
                          mb={4}
                        />
                        <Text fontWeight="medium" mb={2}>
                          Upload Back Side
                        </Text>
                        <Text color="gray.500" fontSize="sm" textAlign="center">
                          Drag and drop here or click to upload
                          <br />
                          JPG, JPEG or PNG (max. 5MB)
                        </Text>
                      </Center>
                    )}
                  </Box>
                  <FormErrorMessage>
                    {errors.driversLicenseBack}
                  </FormErrorMessage>
                </Box>
              </FormControl>

              <FormControl isInvalid={!!errors.agreeToTerms}>
                <Checkbox
                  name="agreeToTerms"
                  isChecked={formData.agreeToTerms}
                  onChange={handleChange}
                  required
                  size="lg"
                  colorScheme="blue"
                >
                  <Text fontSize="md">
                    I agree to the{" "}
                    <Button
                      as={RouterLink}
                      to="/terms"
                      variant="link"
                      colorScheme="blue"
                      fontSize="md"
                    >
                      Terms and Conditions
                    </Button>
                  </Text>
                </Checkbox>
                <FormErrorMessage>{errors.agreeToTerms}</FormErrorMessage>
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                fontSize="md"
                w="full"
                py={6}
                mt={4}
              >
                Create Account
              </Button>
            </VStack>
          </form>
        </Box>
      </Stack>
    </Container>
  );
};

export default Register;
