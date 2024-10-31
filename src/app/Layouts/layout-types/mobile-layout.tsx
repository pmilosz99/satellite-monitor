import { Grid, GridItem } from "@chakra-ui/react";

import { Main } from "../components/main";
import { Footer } from "../components/footer";
import { MobileHeader } from "../components/mobile-header";

export const MobileLayout = () => {
    const HEADER_HEIGHT = '120px';
    const FOOTER_HEIGHT = '48px';

    return (
        <Grid
                templateAreas={`"header header" "main main" "footer footer"`}
                h={'100vh'}
                gridTemplateRows={`${HEADER_HEIGHT} auto ${FOOTER_HEIGHT}`}
                overflowY="auto"
            >
                <GridItem area={'header'}>{<MobileHeader />}</GridItem>
                <GridItem area={'main'} overflowX={'auto'}>{<Main />}</GridItem>
                <GridItem area={'footer'}>{<Footer />}</GridItem>
            </Grid>
    )
}