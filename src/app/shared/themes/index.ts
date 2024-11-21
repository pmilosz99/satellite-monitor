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
    DetailsBoxButtons: {
      baseStyle: {
        _hover: {
          bg: '#19a00d1a',
        },
        _active: {
          bg: '#19a00d3f',
        },
        _focusVisible: {
          bg: '#19a00d3f',
        }
      },
      variants: {
        onMode: {
          bg: '#19a00d3f',
        },
      }
    },
    DrawerSatDetails: {
      baseStyle: {
        bg: 'var(--chakra-colors-chakra-body-bg)',
        borderLeftRadius: 'md',
        borderLeft: '1px',
        borderLeftColor: 'whiteAlpha.300',
        borderTop: '1px',
        borderTopColor: 'whiteAlpha.300',
        borderBottom: '1px',
        borderBottomColor: 'whiteAlpha.300',
      }
    },
    InfoMinimalismGrayBox: {
      baseStyle: {
        color: 'whiteAlpha.500'
      }
    },
    SettingsModuleItem: {
      baseStyle: {
        bg: 'whiteAlpha.50',
        borderRadius: 'md',
      }
    },
    FilterRadioGroup: {
      baseStyle: {
        pl: 2,
        pr: 1,
        pt: 1,
        pb: 1,
        mb: 4,
        border: '1px',
        borderRadius: 'md',
        borderColor: 'whiteAlpha.300',
      }
    }
  }
}

const lightThemeValues = {
  semanticTokens: {
    colors: {
      'chakra-body-text': {
        _light: 'gray.700'
      }
    }
  },
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
    DetailsBoxButtons: {
      baseStyle: {
        _hover: {
          bg: '#0fb10f77',
        },
        _active: {
          bg: '#18a918c4',
        },
        _focusVisible: {
          bg: '#18a918c4',
        }
      },
      variants: {
        onMode: {
          bg: '#18a918c4'
        }
      }
    },
    DrawerSatDetails: {
      baseStyle: {
        bg: 'var(--chakra-colors-chakra-body-bg)',
        borderLeftRadius: 'md',
        borderLeft: '1px',
        borderLeftColor: 'gray.200',
        borderTop: '1px',
        borderTopColor: 'gray.200',
        borderBottom: '1px',
        borderBottomColor: 'gray.200',
      }
    },
    InfoMinimalismGrayBox: {
      baseStyle: {
        color: 'blackAlpha.500'
      }
    },
    SettingsModuleItem: {
      baseStyle: {
        bg: 'gray.100',
        borderRadius: 'md',
      }
    },
    FilterRadioGroup: {
      baseStyle: {
        pl: 2,
        pr: 1,
        pt: 1,
        pb: 1,
        mb: 4,
        border: '1px',
        borderRadius: 'md',
        borderColor: 'gray.200',
      }
    }
  }
}

export const config: ThemeConfig  = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

export const darkTheme = extendTheme({ ...darkThemeValues, config: config });

export const lightTheme = extendTheme({ ...lightThemeValues, config: config });
