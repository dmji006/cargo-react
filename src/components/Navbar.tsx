import {
  Box,
  Flex,
  Button,
  Stack,
  useColorModeValue,
  Container,
  Image,
  IconButton,
  useDisclosure,
  HStack,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  return (
    <Box>
      <Flex
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align={"center"}
      >
        <Container maxW="container.xl">
          <Flex justify="space-between" align="center">
            <RouterLink to="/">
              <Image h="40px" src="/logo.png" alt="CarGo" />
            </RouterLink>

            <Flex display={{ base: "none", md: "flex" }} ml={10}>
              <HStack spacing={4}>
                <Button as={RouterLink} to="/cars" variant="ghost">
                  Browse Cars
                </Button>
                {isAuthenticated ? (
                  <>
                    <Button as={RouterLink} to="/dashboard" variant="ghost">
                      Dashboard
                    </Button>
                    <Button as={RouterLink} to="/profile" variant="ghost">
                      Profile
                    </Button>
                  </>
                ) : (
                  <>
                    <Button as={RouterLink} to="/login" variant="ghost">
                      Login
                    </Button>
                    <Button as={RouterLink} to="/register" colorScheme="blue">
                      Sign Up
                    </Button>
                  </>
                )}
              </HStack>
            </Flex>

            <IconButton
              display={{ base: "flex", md: "none" }}
              onClick={onToggle}
              icon={
                isOpen ? (
                  <CloseIcon w={3} h={3} />
                ) : (
                  <HamburgerIcon w={5} h={5} />
                )
              }
              variant={"ghost"}
              aria-label={"Toggle Navigation"}
            />
          </Flex>
        </Container>
      </Flex>
    </Box>
  );
};

export default Navbar;
