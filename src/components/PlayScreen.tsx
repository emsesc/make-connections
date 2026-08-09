import { AspectRatio, Box, Button, Circle, Flex, HStack, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { MODAL_ACTION_LABEL, MODAL_BODY, MODAL_TITLE } from '../constants';
import { chunk, difficultyColor, type Game } from '../game';
import { FitText } from './FitText';
import { GameHeader } from './GameHeader';

const PLAY_SCREEN_INTRO = 'Create four groups of four!';
const MISTAKES_LABEL = 'Mistakes remaining:';

type PlayScreenProps = {
  game: Game;
  showPrompt: boolean;
  onClosePrompt: () => void;
  onGoToModernLove: () => void;
};

export const PlayScreen = ({ game, showPrompt, onClosePrompt, onGoToModernLove }: PlayScreenProps) => {
  return (
    <Box w="100%" minH="100vh" overflowX="hidden">
      <GameHeader />
      <Flex mx="auto" w="100%" align="center" justify="flex-end" borderTopWidth={1} borderBottomWidth={1} borderColor="gray.200" pt={4} paddingBottom={3} paddingTop={3} pr={65}>
        <HStack spacing={4} align="center">
          <Box as="span" aria-hidden="true">
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="25" viewBox="0 0 24 24" width="30" className="game-icon" data-testid="icon-forum">
              <path fill="var(--text)" d="M15.4538 15.0078C17.2881 13.8544 18.5 11.818 18.5 9.5C18.5 5.91015 15.5899 3 12 3C8.41015 3 5.5 5.91015 5.5 9.5C5.5 11.818 6.71194 13.8544 8.54624 15.0078C9.37338 15.5279 10 16.4687 10 17.6014V20H14V17.6014C14 16.4687 14.6266 15.5279 15.4538 15.0078ZM16.5184 16.7009C16.206 16.8974 16 17.2323 16 17.6014V20C16 21.1046 15.1046 22 14 22H10C8.89543 22 8 21.1046 8 20V17.6014C8 17.2323 7.79404 16.8974 7.48163 16.7009C5.08971 15.1969 3.5 12.5341 3.5 9.5C3.5 4.80558 7.30558 1 12 1C16.6944 1 20.5 4.80558 20.5 9.5C20.5 12.5341 18.9103 15.1969 16.5184 16.7009ZM8 17H16V21C16 22.1046 15.1046 23 14 23H10C8.89543 23 8 22.1046 8 21V17Z"></path>
            </svg>
          </Box>

          <Box as="span" aria-hidden="true">
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="4 4 24 24" width="30" className="game-icon" data-testid="icon-stats">
              <path fill="var(--text)" d="M21.3332 14.6667V4H10.6665V12H2.6665V28H29.3332V14.6667H21.3332ZM13.3332 6.66667H18.6665V25.3333H13.3332V6.66667ZM5.33317 14.6667H10.6665V25.3333H5.33317V14.6667ZM26.6665 25.3333H21.3332V17.3333H26.6665V25.3333Z"></path>
            </svg>
          </Box>

          <Box as="span" aria-hidden="true">
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="2 2 28 28" width="30" className="game-icon" data-testid="icon-help">
              <path fill="var(--text)" d="M15 24H17.6667V21.3333H15V24ZM16.3333 2.66666C8.97333 2.66666 3 8.63999 3 16C3 23.36 8.97333 29.3333 16.3333 29.3333C23.6933 29.3333 29.6667 23.36 29.6667 16C29.6667 8.63999 23.6933 2.66666 16.3333 2.66666ZM16.3333 26.6667C10.4533 26.6667 5.66667 21.88 5.66667 16C5.66667 10.12 10.4533 5.33332 16.3333 5.33332C22.2133 5.33332 27 10.12 27 16C27 21.88 22.2133 26.6667 16.3333 26.6667ZM16.3333 7.99999C13.3867 7.99999 11 10.3867 11 13.3333H13.6667C13.6667 11.8667 14.8667 10.6667 16.3333 10.6667C17.8 10.6667 19 11.8667 19 13.3333C19 16 15 15.6667 15 20H17.6667C17.6667 17 21.6667 16.6667 21.6667 13.3333C21.6667 10.3867 19.28 7.99999 16.3333 7.99999Z"></path>
            </svg>
          </Box>
        </HStack>
      </Flex>

      <Modal isOpen={showPrompt} onClose={onClosePrompt} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{MODAL_TITLE}</ModalHeader>
          <ModalBody>
            <Text>{MODAL_BODY}</Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onGoToModernLove}>
              {MODAL_ACTION_LABEL}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Flex align="center" justify="center" py={8}>
        <Stack spacing={4} align="center" w="100%">
          <Text fontWeight="semibold">{PLAY_SCREEN_INTRO}</Text>
          <Box w={{ base: '92vw', md: '624px' }} mx="auto">
            <Stack>
              {game.complete.map((group) => (
                <Stack
                  key={group.category}
                  spacing={1}
                  lineHeight={1}
                  rounded="lg"
                  align="center"
                  justify="center"
                  minH="80px"
                  px={2}
                  py={1}
                  w="100%"
                  bg={difficultyColor(group.difficulty)}
                >
                  <Text fontSize={{ base: '12px', md: 'xl' }} fontWeight="extrabold" textTransform="uppercase">
                    {group.category}
                  </Text>
                  <Text fontSize={{ base: '11px', md: 'xl' }} textTransform="uppercase" whiteSpace="normal">
                    {group.items.join(', ')}
                  </Text>
                </Stack>
              ))}

              <SimpleGrid display={{ base: 'grid', md: 'none' }} columns={{ base: 4, md: 4 }} spacing={4} w="100%" mx="auto" px={{ base: 2, md: 0 }}>
                {game.items.map((item) => (
                  <AspectRatio key={item} ratio={1} w="100%">
                    <Button
                      w="100%"
                      h="100%"
                      bg="#efefe6"
                      minW={0}
                      fontSize={{ base: '11px', sm: '12px', md: '14px' }}
                      fontWeight="extrabold"
                      textTransform="uppercase"
                      onClick={() => game.toggleActive(item)}
                      isActive={game.activeItems.includes(item)}
                      lineHeight={1.1}
                      px={1}
                      _active={{
                        bg: '#5a594e',
                        color: 'white',
                      }}
                    >
                      <FitText>{item}</FitText>
                    </Button>
                  </AspectRatio>
                ))}
              </SimpleGrid>

              <Box display={{ base: 'none', md: 'block' }}>
                {chunk(game.items, 4).map((row, rowIdx) => (
                  <HStack key={`row-${rowIdx}`} spacing={3} justify="center" mb={3}>
                    {row.map((item) => (
                      <Button
                        key={item}
                        w="150px"
                        h="80px"
                        minW={0}
                        bg="#efefe6"
                        fontSize="19px"
                        fontWeight="extrabold"
                        textTransform="uppercase"
                        onClick={() => game.toggleActive(item)}
                        isActive={game.activeItems.includes(item)}
                        lineHeight={1.1}
                        px={2}
                        _active={{
                          bg: '#5a594e',
                          color: 'white',
                        }}
                      >
                        <FitText>{item}</FitText>
                      </Button>
                    ))}
                  </HStack>
                ))}
              </Box>
            </Stack>
          </Box>

          <HStack align="baseline">
            <Text>{MISTAKES_LABEL}</Text>
            {[...Array(game.mistakesRemaining).keys()].map((index) => (
              <Circle key={index} bg="gray.800" size="12px" />
            ))}
          </HStack>

          <HStack>
            <Button colorScheme="black" variant="outline" rounded="full" py={6} borderWidth="1px" onClick={game.shuffle}>
              Shuffle
            </Button>
            <Button colorScheme="black" variant="outline" rounded="full" py={6} borderWidth="1px" onClick={game.deselectAll}>
              Deselect All
            </Button>
            <Button colorScheme="black" variant="outline" rounded="full" py={6} borderWidth="1px" isDisabled={game.activeItems.length !== 4} onClick={game.submit}>
              Submit
            </Button>
          </HStack>
        </Stack>
      </Flex>
    </Box>
  );
};
