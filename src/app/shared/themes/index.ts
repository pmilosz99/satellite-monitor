import { ThemeConfig, extendTheme } from "@chakra-ui/react";

import { alertTheme } from "./components/alert";

export const MAIN_GRADIENT = 'linear(to-l, #7928CA, #ff0080f6)';
export const MAIN_GRADIENT_COLOR = '#be13a3';

export const CHAKRA_THEME_STORE_KEY = 'chakra-ui-color-mode';

export enum THEME_TYPE {
    DARK = 'dark',
    LIGHT = 'light',
}

const darkThemeValues ={
  components: {
    Alert: alertTheme,
    CustomToast: {
        baseStyle: {
            bg: 'var(--chakra-colors-chakra-body-bg)',
            borderRadius: '6px',
            borderWidth: '1px',
            color: 'white',
        }
    },
    SearchBarMenu: {
      baseStyle: {
        bg: '#232934',
      }
    },
  }
}

const lightThemeValues = {
  components: {
    Alert: {
      baseStyle: {
        container: {
          borderRadius: '6px',
        }
      }
    },
    CustomToast: {
        baseStyle: {
            bg: 'var(--chakra-colors-chakra-body-bg)',
            borderRadius: '6px',
            borderWidth: '1px',
            color: 'black',
        }
    },
    Divider: {
        baseStyle: {
            borderColor: '#d9dde1',
        }
    },
    SearchBarMenu: {
      baseStyle: {
        bg: '#edf2f7',
      }
    },
  }
}

export const config: ThemeConfig  = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

export const darkTheme = extendTheme({ ...darkThemeValues, config: config });

export const lightTheme = extendTheme({ ...lightThemeValues, config: config });