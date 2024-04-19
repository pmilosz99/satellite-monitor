import { Box, useStyleConfig } from "@chakra-ui/react"

export const CustomToast = (props: Record<string, string>) => {
    const { children, ...rest } = props;

    const styles = useStyleConfig('CustomToast');
    
    return (
        <Box __css={styles} {...rest}>
            {children}
        </Box>
    )
};
