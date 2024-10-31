import { LinkProps, Link as ChakraLink } from "@chakra-ui/react";
import { FC, ReactNode } from "react";
import { To, Link as RouterLink } from "react-router-dom";
import { MAIN_GRADIENT_COLOR } from "../../shared/themes";

interface IMenuLink extends LinkProps {
    to: To;
    children: ReactNode;
}

export const MenuLink: FC<IMenuLink> = ({ to, children, ...props }) => (
    <ChakraLink as={RouterLink} to={to} _hover={{ color: MAIN_GRADIENT_COLOR }} {...props}>
        {children}
    </ChakraLink>
);