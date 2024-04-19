import { AlertProps, createMultiStyleConfigHelpers } from '@chakra-ui/react'
import { alertAnatomy } from '@chakra-ui/anatomy'

const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers(alertAnatomy.keys)

const baseStyle = definePartsStyle((props: AlertProps) => {
    const { status } = props;

    const defaultContainer = {
      borderRadius: '6px',
      borderWidth: '1px',
    };

    const successBase = status === "success" && {
        container: {
            borderColor: 'rgb(198 246 213 / 50%)',
            ...defaultContainer,
        }
    };

    const warningBase = status === "warning" && {
        container: {
            borderColor: 'rgb(254 235 200 / 50%)',
            ...defaultContainer,
        }
    };

    const errorBase = status === "error" && {
        container: {
            borderColor: 'rgb(254 178 178 / 50%)',
            ...defaultContainer,
        }
    };

    const infoBase = status === "info" && {
        container: {
            borderColor: 'rgb(190 227 248 / 50%)',
            ...defaultContainer,
        }
    };

    return {
        ...successBase,
        ...warningBase,        
        ...errorBase,
        ...infoBase,
    };
})

export const alertTheme = defineMultiStyleConfig({ baseStyle })