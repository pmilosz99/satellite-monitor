import { Box, Fade, Heading, Text } from "@chakra-ui/react"
import { T } from "../../shared/components";

export const HomePage = () => {
    let delayOrbitSec = 0.7;
    const isMobile = window.innerWidth <= 768;

    const orbits = [
        <Box position="absolute" bottom="-100px" left="-100px" borderWidth="1px" borderRadius="100%" h="200px" w="200px" zIndex={6}/>,
        <Box position="absolute" bottom="-200px" left="-200px" borderWidth="1px" borderRadius="100%" h="400px" w="400px" zIndex={5}/>,
        <Box position="absolute" bottom="-400px" left="-400px" borderWidth="1px" borderRadius="100%" h="800px" w="800px" zIndex={4}/>,
        <Box position="absolute" bottom="-650px" left="-650px" borderWidth="1px" borderRadius="100%" h="1300px" w="1300px" zIndex={3}/>,
        <Box position="absolute" bottom="-1000px" left="-1000px" borderWidth="1px" borderRadius="100%" h="2000px" w="2000px" zIndex={2}/>,
        <Box position="absolute" bottom="-1350px" left="-1350px" borderWidth="1px" borderRadius="100%" h="2700px" w="2700px" zIndex={1}/>
    ]

    return (
        <Box position="relative" h="100%" overflow="hidden">
            <Heading size='4xl' p={isMobile ? 10 : 20} bgGradient='linear(to-l, #7928CA, #ff0080f6)' bgClip='text' zIndex={7} textAlign="center">
                <T dictKey="homePageWelcome" />
            </Heading>
            <Text position="relative" size="xl" pl={'10vw'} pr={'10vw'} textAlign="justify" zIndex={8}>
                <T dictKey="homePageDisc" />
            </Text>
            {orbits.map((orbit) => {
                delayOrbitSec += 0.2;

                return (
                    <Fade key={delayOrbitSec} in={true} delay={delayOrbitSec}>
                      {orbit}
                    </Fade>
                )
            })}        
        </Box>

    )
}

export default HomePage;