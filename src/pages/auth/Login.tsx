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
  Link,
  useToast,
  InputGroup,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../../store/slices/authSlice";
import Swal from "sweetalert2";

const Login = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const validateMobileNumber = (number: string) => {
    const mobileRegex = /^(09|\+639)\d{9}$/;
    return mobileRegex.test(number);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate mobile number
    if (!validateMobileNumber(mobileNumber)) {
      setError(
        "Please enter a valid mobile number (e.g., 09123456789 or +639123456789)"
      );
      return;
    }

    try {
      dispatch(loginStart());

      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobileNumber,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Log the response data to debug
      console.log("Login response data:", data);

      dispatch(loginSuccess(data.data));

      toast({
        title: "Login Successful",
        description: "Welcome back!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Redirect to profile page
      navigate("/profile");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred during login";
      dispatch(loginFailure(errorMessage));

      toast({
        title: "Login Failed",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.sm" py={8}>
      <Box bg="white" p={8} borderRadius="lg" boxShadow="sm">
        <Stack spacing={6}>
          <Heading size="lg">Welcome Back</Heading>
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl isRequired isInvalid={!!error}>
                <FormLabel>Mobile Number</FormLabel>
                <Input
                  type="tel"
                  placeholder="09*********"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                />
                {error && <FormErrorMessage>{error}</FormErrorMessage>}
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              <Button type="submit" colorScheme="blue" size="lg">
                Sign In
              </Button>
            </Stack>
          </form>
          <Text textAlign="center">
            Don't have an account?{" "}
            <Link as={RouterLink} to="/register" color="blue.500">
              Sign up
            </Link>
          </Text>
        </Stack>
      </Box>
    </Container>
  );
};

export default Login;
