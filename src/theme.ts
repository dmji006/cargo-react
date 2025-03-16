import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

const theme = extendTheme({
  config,
  styles: {
    global: {
      body: {
        bg: 'gray.50',
      },
    },
  },
  components: {
    Button: {
      variants: {
        link: {
          color: 'blue.500',
          _hover: {
            textDecoration: 'underline',
          },
        },
      },
    },
    Stack: {
      defaultProps: {
        spacing: 4,
      },
    },
  },
})

export default theme 