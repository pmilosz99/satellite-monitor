import { ReactNode } from 'react';
import { Link as ChakraLink } from '@chakra-ui/react';
import { Link as RouterLink, To } from 'react-router-dom';

import { MAIN_GRADIENT_COLOR } from '../themes';

export const CustomLink = ({ to, children }: {to: To, children: ReactNode }) => (
    <ChakraLink as={RouterLink} to={to} color={MAIN_GRADIENT_COLOR}>{children}</ChakraLink>
);
