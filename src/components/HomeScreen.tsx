import { Box, Button, Flex, Heading, Image, Stack, Text } from '@chakra-ui/react';
import { APP_BYLINE, APP_DATE, APP_ISSUE_NUMBER, HOME_SUBSCRIBE_LABEL, HOME_SUBSCRIPTION_URL } from '../constants';
import { GameHeader } from './GameHeader';

const APP_TITLE = 'Connections';
const HOME_TAGLINE = 'No need to subscribe for unlimited play.';
const HOME_PLAY_LABEL = 'Play';

type HomeScreenProps = {
  onPlay: () => void;
};

export const HomeScreen = ({ onPlay }: HomeScreenProps) => {
  return (
    <Box w="100vw" minH="100vh" bg="#B3A7FE" color="black">
      <Box bg="white">
        <GameHeader />
      </Box>

      <Flex alignItems="center" justifyContent="center" minH="calc(100vh - 88px)">
        <Stack spacing={3} align="center">
          <Image src="/connections-icon.png" alt="connections icon" boxSize={{ base: '60px', md: '80px' }} />
          <Heading fontFamily="NYT Karnak" fontWeight="bold" fontSize={{ base: '28px', md: '44px' }}>
            {APP_TITLE}
          </Heading>
          <Text fontSize={{ base: '14px', md: '18px' }} color="gray.800">
            {HOME_TAGLINE}
          </Text>

          <Stack spacing={2} align="center" mt={1}>
            <Button colorScheme="black" rounded="full" bg="black" color="white" py={6} width={{ base: '100px', md: '150px' }} onClick={onPlay}>
              {HOME_PLAY_LABEL}
            </Button>
            <Button
              colorScheme="black"
              variant="outline"
              rounded="full"
              borderWidth={1}
              py={6}
              width={{ base: '100px', md: '150px' }}
              onClick={() => window.open(HOME_SUBSCRIPTION_URL, '_blank')}
            >
              {HOME_SUBSCRIBE_LABEL}
            </Button>
          </Stack>

          <Stack spacing={0} align="center" mt={2}>
            <Text fontFamily="NYT Franklin" fontSize={{ base: '12px', md: '16px' }} textAlign="center" maxW="300px" fontWeight="medium">
              {APP_DATE}
            </Text>
            <Text fontFamily="NYT Franklin Small" fontSize={{ base: '12px', md: '14px' }} textAlign="center" maxW="300px">
              {APP_ISSUE_NUMBER}
            </Text>
            <Text fontFamily="NYT Franklin Small" fontSize={{ base: '12px', md: '14px' }} textAlign="center" maxW="300px">
              {APP_BYLINE}
            </Text>
          </Stack>
        </Stack>
      </Flex>
    </Box>
  );
};
