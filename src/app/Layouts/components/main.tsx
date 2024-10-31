import { Outlet } from "react-router-dom";
import { chakra } from "@chakra-ui/react";

export const Main = () => (
    <chakra.main height="100%" width="100%">
        <Outlet />
    </chakra.main>
);