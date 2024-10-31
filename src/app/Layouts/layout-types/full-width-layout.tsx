import { Grid, GridItem } from "@chakra-ui/react";

import { Main } from "../components/main";
import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { Sidebar } from "../components/sidebar";

export const FullWidthLayout = () => {
    const HEADER_HEIGHT = '60px';
    const FOOTER_HEIGHT = '30px';
    const NAV_WIDTH = '185px';

    return (
        <Grid
                templateAreas={`"header header" "nav main" "nav footer"`}
                h={'100vh'}
                gridTemplateRows={`${HEADER_HEIGHT} auto ${FOOTER_HEIGHT}`}
                gridTemplateColumns={`${NAV_WIDTH} auto`}
                overflowY="auto"
            >
                <GridItem area={'header'}>{<Header />}</GridItem>
                <GridItem area={'nav'}>{<Sidebar />}</GridItem>
                <GridItem area={'main'} overflowX={'auto'}>{<Main />}</GridItem>
                <GridItem area={'footer'}>{<Footer />}</GridItem>
            </Grid>
    )
}