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
} from "@chakra-ui/react";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login logic
  };

  return (
    <Container maxW="container.sm" py={8}>
      <Box bg="white" p={8} borderRadius="lg" boxShadow="sm">
        <Stack spacing={6}>
          <Heading size="lg">Welcome Back</Heading>
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              <Button type="submit" colorScheme="blue">
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
