import {
  Box,
  Container,
  Stack,
  Text,
  Link,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <Box
      bg={useColorModeValue("gray.50", "gray.900")}
      color={useColorModeValue("gray.700", "gray.200")}
      mt="auto"
    >
      <Container
        as={Stack}
        maxW={"container.xl"}
        py={4}
        spacing={4}
        justify={"center"}
        align={"center"}
      >
        <Stack direction={"row"} spacing={6}>
          <Link href={"#"}>Home</Link>
          <Link href={"#"}>About</Link>
          <Link href={"#"}>Contact</Link>
          <Link href={"#"}>Terms</Link>
          <Link href={"#"}>Privacy</Link>
        </Stack>
        <Text>© 2024 CarGo. All rights reserved</Text>
        <Stack direction={"row"} spacing={6}>
          <Link href={"#"}>
            <FaFacebook />
          </Link>
          <Link href={"#"}>
            <FaTwitter />
          </Link>
          <Link href={"#"}>
            <FaInstagram />
          </Link>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
