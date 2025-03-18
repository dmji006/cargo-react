import {
  Box,
  VStack,
  Icon,
  Text,
  Avatar,
  Heading,
  Flex,
  Link as ChakraLink,
  Button,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { AiOutlineHome, AiOutlineCar } from "react-icons/ai";
import { BiLogOut, BiKey } from "react-icons/bi";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { logout } from "../store/slices/authSlice";

const Sidebar = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Don't render anything if there's no user
  if (!user) {
    return null;
  }

  const navItems = [
    { name: "Home", icon: AiOutlineHome, path: "/" },
    { name: "My Cars", icon: AiOutlineCar, path: "/my-cars" },
    { name: "Rented Car", icon: BiKey, path: "/rented-car" },
  ];

  return (
    <Box
      as="nav"
      h="100vh"
      w="250px"
      bg="blue.700"
      color="white"
      py={6}
      position="fixed"
      left={0}
      top={0}
    >
      {/* User Profile Section */}
      <VStack spacing={4} mb={8} px={4}>
        <Avatar size="lg" name={user?.name} />
        <Box textAlign="center">
          <Heading size="sm">{user?.name}</Heading>
          <Text fontSize="sm" color="whiteAlpha.800">
            {user?.role}
          </Text>
        </Box>
      </VStack>

      {/* Navigation Items */}
      <VStack spacing={2} align="stretch">
        {navItems.map((item) => (
          <ChakraLink
            as={RouterLink}
            to={item.path}
            key={item.name}
            _hover={{ textDecoration: "none", bg: "blue.600" }}
            px={4}
            py={3}
          >
            <Flex align="center" gap={3}>
              <Icon as={item.icon} boxSize={5} />
              <Text>{item.name}</Text>
            </Flex>
          </ChakraLink>
        ))}
      </VStack>

      {/* Logout Button at Bottom */}
      <Box position="absolute" bottom={6} width="100%" px={4}>
        <Button
          leftIcon={<BiLogOut />}
          variant="ghost"
          color="white"
          _hover={{ bg: "blue.600" }}
          width="100%"
          justifyContent="flex-start"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default Sidebar;
