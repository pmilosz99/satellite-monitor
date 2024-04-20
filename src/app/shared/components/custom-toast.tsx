import { Box, useStyleConfig } from "@chakra-ui/react"
import { PropsWithChildren } from "react";

export const CustomToast = (props: PropsWithChildren) => {
    const { children, ...rest } = props;

    const styles = useStyleConfig('CustomToast');
    
    return (
        <Box __css={styles} {...rest}>
            {children}
        </Box>
    )
};
