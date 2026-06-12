import { useEffect, useState } from 'react';
import {
  Button,
  ChakraProvider,
  Circle,
  Flex,
  HStack,
  SimpleGrid,
  Heading,
  Stack,
  Text,
  Box,
  AspectRatio,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Image,

} from '@chakra-ui/react';
import useMethods from 'use-methods';
import { DAY_1 } from './constants';

export type Group = {
  category: string;
  items: string[];
  difficulty: 1 | 2 | 3 | 4;
};

type Options = {
  groups: Group[];
};

type State = {
  complete: Group[];
  incomplete: Group[];
  items: string[];
  activeItems: string[];
  mistakesRemaining: number;
};

const difficultyColor = (difficulty: 1 | 2 | 3 | 4): string => {
  return {
    1: '#fbd400',
    2: '#b5e352',
    3: '#729eeb',
    4: '#bc70c4',
  }[difficulty];
};

const chunk = <T,>(list: T[], size: number): T[][] => {
  const chunkCount = Math.ceil(list.length / size);
  return new Array(chunkCount).fill(null).map((_c: null, i: number) => {
    return list.slice(i * size, i * size + size);
  });
};

const shuffle = <T,>(list: T[]): T[] => {
  return list.sort(() => 0.5 - Math.random());
};

const methods = (state: State) => {
  return {
    toggleActive(item: string) {
      if (state.activeItems.includes(item)) {
        state.activeItems = state.activeItems.filter((i) => i !== item);
      } else if (state.activeItems.length < 4) {
        state.activeItems.push(item);
      }
    },

    shuffle() {
      // shuffle returns a new array (and also mutates via sort), assign back to state
      state.items = shuffle(state.items);
    },

    deselectAll() {
      state.activeItems = [];
    },

    submit() {
      const foundGroup = state.incomplete.find((group) =>
        group.items.every((item) => state.activeItems.includes(item)),
      );

      if (foundGroup) {
        state.complete.push(foundGroup);
        const incomplete = state.incomplete.filter((group) => group !== foundGroup);
        state.incomplete = incomplete;
        // when a category is completed, reshuffle the remaining tiles so order is randomized
        state.items = shuffle(incomplete.flatMap((group) => group.items));
        state.activeItems = [];
      } else {
        state.mistakesRemaining -= 1;
        state.activeItems = [];

        if (state.mistakesRemaining === 0) {
          state.complete = [...state.incomplete];
          state.incomplete = [];
          state.items = [];
        }
      }
    },
  };
};

const useGame = (options: Options) => {
  const initialState: State = {
    incomplete: options.groups,
    complete: [],
    items: shuffle(options.groups.flatMap((g) => g.items)),
    activeItems: [],
    mistakesRemaining: 3,
  };

  const [state, fns] = useMethods(methods, initialState);

  return {
    ...state,
    ...fns,
  };
};

export const App = () => {
  const game = useGame({
    groups: DAY_1,
  });

  // app-level navigation state so we can render the Modern Love page when needed
  const [path, setPath] = useState<string>(window.location.pathname);
  const [showPrompt, setShowPrompt] = useState<boolean>(false);

  useEffect(() => {
    const allFound = game.complete.length === DAY_1.length;
    setShowPrompt(allFound);
  }, [game.complete.length]);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const goToModernLove = () => {
    window.history.pushState({}, '', '/modern-love');
    setPath('/modern-love');
  };

  const Header = () => {
    return (
      <Box>
        <Flex mx="auto" w="100%" align="center" justify="flex-start" py={4} pl={5} borderBottomWidth={1} borderColor="gray.200">
          {/* hamburger (three bars) */}
          <Box as="button" aria-label="Open menu" mr={4} display="flex" alignItems="center" justifyContent="center" bg="transparent" border="0" p={0}>
            <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
              <rect x="0" y="0" width="20" height="2" rx="1" fill="black" />
              <rect x="0" y="6" width="20" height="2" rx="1" fill="black" />
              <rect x="0" y="12" width="20" height="2" rx="1" fill="black" />
            </svg>
          </Box>
          {/* SVG from user: converted to JSX (class -> className) */}
          <svg className="pz-nav__logo" width="138" height="25" viewBox="0 0 138 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="138" height="25" fill="white"></rect>
            <path d="M42.4599 1.03519C44.219 1.00558 45.9577 1.41634 47.5176 2.23008V1.45245H53.4162V8.80515H47.5239C47.1067 7.03494 46.3607 6.2257 44.5904 6.2257C42.365 6.23834 41.0058 7.86947 41.0058 12.4151C41.0058 17.3148 42.2386 18.8827 45.0077 18.8827C45.7187 18.8975 46.4203 18.7183 47.0371 18.3643V16.2211H45.2037V11.9283H53.4225V24.0543H48.3648V22.9289C46.902 24.0012 45.1195 24.5471 43.307 24.4778C36.9216 24.4778 32.4392 20.2546 32.4392 12.4214C32.4708 5.2584 36.9849 1.03519 42.4599 1.03519Z" fill="black"></path>
            <path d="M59.8645 24.3471C56.3494 24.3471 54.2883 22.4505 54.2883 19.2198C54.2883 15.9892 56.7097 13.9345 60.541 13.9345C61.9923 13.9222 63.4232 14.2767 64.701 14.965C64.6377 13.2264 63.3164 12.0947 60.8634 12.0947C59.0925 12.1015 57.3477 12.5215 55.7677 13.3212V9.25608C58.149 8.58084 60.6136 8.24457 63.0888 8.25718C69.7966 8.25718 72.0853 11.1907 72.0853 13.7701V19.8647H73.4382V24.0563H64.7705V22.5074C63.544 23.8603 61.7359 24.3471 59.8645 24.3471ZM64.859 18.8658C64.888 18.6431 64.8655 18.4166 64.7931 18.204C64.7207 17.9914 64.6005 17.7982 64.4417 17.6394C64.2829 17.4805 64.0897 17.3603 63.877 17.288C63.6644 17.2156 63.438 17.193 63.2153 17.222C62.1215 17.222 61.3755 17.7721 61.3755 18.8974C61.3755 20.0228 62.0077 20.478 63.1836 20.478C64.3596 20.478 64.8653 19.9911 64.8653 18.8848L64.859 18.8658Z" fill="black"></path>
            <path d="M75.8371 19.8644V12.7709H74.5726V8.57927H83.1455V10.2546C85.1433 8.73732 86.2055 8.25684 87.786 8.25684C89.7206 8.25684 90.8839 8.80687 92.3949 10.3874C94.3611 8.83848 95.7456 8.25684 97.4526 8.25684C100.614 8.25684 102.801 10.419 102.801 13.2197V19.858H104.066V24.0496H95.5054V14.6739C95.5054 13.4473 95.0249 12.7772 94.1841 12.7772C93.3432 12.7772 92.9576 13.4094 92.9576 14.6739V19.8644H94.0513V24.056H85.6681V14.6106C85.6681 13.5169 85.1497 12.7709 84.4036 12.7709C83.6576 12.7709 83.1392 13.479 83.1392 14.6106V19.8644H84.2646V24.056H74.5474V19.8644H75.8371Z" fill="black"></path>
            <path d="M113.781 24.3784C111.46 24.3784 108.881 23.8979 107.073 22.2858C106.216 21.5344 105.534 20.6058 105.072 19.5643C104.61 18.5229 104.38 17.3935 104.398 16.2544C104.398 11.1967 108.432 8.25684 113.25 8.25684C118.453 8.25684 121.924 11.93 121.924 16.3555C121.924 16.874 121.892 17.3545 121.86 17.8729H111.745C111.941 19.681 112.908 20.4839 114.387 20.4839C114.871 20.4803 115.347 20.3544 115.769 20.1178C116.191 19.8813 116.547 19.5418 116.803 19.131H121.86C120.773 22.6777 117.498 24.3784 113.781 24.3784ZM111.688 15.5273H115.481V15.1417C115.481 13.8204 115.159 12.4674 113.585 12.4674C113.201 12.4558 112.824 12.5691 112.51 12.7903C112.197 13.0115 111.964 13.3286 111.846 13.6939C111.68 14.2856 111.624 14.9028 111.682 15.5147L111.688 15.5273Z" fill="black"></path>
            <path d="M126.195 24.059H122.712V18.8875H126.164C126.581 20.2404 127.131 20.9485 128.452 20.9485C129.451 20.9485 130.064 20.5313 130.064 19.7536C130.064 19.2036 129.71 18.7863 129.034 18.4892L125.683 17.073C124.909 16.7631 124.246 16.2281 123.779 15.5371C123.313 14.8462 123.064 14.0312 123.066 13.1975C123.066 10.5549 125.677 8.23462 128.964 8.23462C130.352 8.25084 131.718 8.58156 132.96 9.20191V8.5697H136.469V13.4062H133.244C132.954 11.9584 132.372 11.244 131.215 11.244C130.374 11.244 129.729 11.6612 129.729 12.3377C129.729 12.9194 130.115 13.3998 130.924 13.7223L134.212 14.9867C136.374 15.8276 137.373 17.2121 137.373 19.0835C137.373 22.0486 134.844 24.3372 131.215 24.3372C129.603 24.3372 128.477 24.078 126.157 23.2435L126.195 24.059Z" fill="black"></path>
            <path d="M25.9544 1.46704H25.3601V24.0372H25.9544V1.46704Z" fill="black"></path>
            <path d="M19.2574 15.4535C18.8889 16.497 18.3042 17.4509 17.5416 18.2527C16.7789 19.0546 15.8555 19.6863 14.8318 20.1066V15.4535L17.3607 13.1586L14.8318 10.8952V7.69619C15.8763 7.67489 16.8715 7.24792 17.6067 6.50567C18.3419 5.76342 18.7593 4.76418 18.7706 3.71953C18.7706 0.975708 16.1532 0.00209168 14.6675 0.00209168C14.2653 -0.0102783 13.8633 0.0322617 13.4726 0.128535V0.261301C13.6686 0.261301 13.9594 0.22969 14.0542 0.22969C15.0847 0.22969 15.8624 0.716498 15.8624 1.65218C15.8562 1.85411 15.809 2.05266 15.7235 2.23571C15.638 2.41875 15.5161 2.58244 15.3652 2.71677C15.2143 2.85109 15.0376 2.95323 14.8459 3.01695C14.6542 3.08066 14.4515 3.1046 14.2502 3.08732C11.7213 3.08732 8.693 1.01996 5.43075 1.01996C2.52255 1.00732 0.537385 3.17583 0.537385 5.36962C0.537385 7.56342 1.80182 8.24622 3.12316 8.7267L3.15477 8.60026C2.91743 8.45028 2.72511 8.23886 2.59822 7.98842C2.47133 7.73797 2.41459 7.45785 2.43404 7.17777C2.4493 6.92796 2.51386 6.68363 2.62398 6.45888C2.73411 6.23414 2.88763 6.03341 3.07569 5.86826C3.26375 5.70312 3.48264 5.57683 3.71973 5.49668C3.95683 5.41652 4.20745 5.38408 4.45714 5.40124C7.20096 5.40124 11.6265 7.69619 14.3766 7.69619H14.6359V10.9268L12.107 13.1586L14.6359 15.4535V20.1572C13.5788 20.533 12.4638 20.7192 11.342 20.7072C7.07452 20.7072 4.38759 18.1215 4.38759 13.8287C4.37897 12.8127 4.51955 11.8009 4.80486 10.8257L6.93543 9.88999V19.3733L11.2661 17.4766V7.75941L4.88072 10.6044C5.17861 9.73458 5.646 8.93247 6.25588 8.24446C6.86575 7.55645 7.606 6.99621 8.43379 6.59613L8.40218 6.5013C4.13471 7.43698 0 10.6739 0 15.5167C0 21.1055 4.71635 25 10.2103 25C16.0267 25 19.3206 21.1245 19.3522 15.4725L19.2574 15.4535Z" fill="black"></path>
          </svg>
        </Flex>
        {/* Title row (left aligned) */}
        <Flex maxW="1100px" mx="auto" w="100%" align="center" justify="flex-start" borderTopWidth={1} borderColor="gray.200" py={8}>
          <Heading fontFamily="NYT Karnak" fontWeight="bold" fontSize={{ base: '28px', md: '44px' }}>
            Connections
          </Heading>
          <Text fontFamily="NYT Franklin Small" fontSize={{ base: '14px', md: '28px' }} ml={4} pt={2}>
            December 13, 2025
          </Text>
        </Flex>
      </Box>
    )
  }

  const ModernLove = () => (
    <Box w="100vw" minH="100vh" bg="white" color="black">
      <Flex mx="auto" w="100%" align="center" justify="center" pt={4} pb={4} borderBottomWidth={1} borderColor="gray.200" position="relative">
        {/* hamburger (three bars) - match header (positioned left while keeping logo centered) */}
        <Box as="button" aria-label="Open menu" position="absolute" left={5} top="50%" transform="translateY(-50%)" display="flex" alignItems="center" justifyContent="center" bg="transparent" border="0" p={0}>
          <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
            <rect x="0" y="0" width="20" height="2" rx="1" fill="black" />
            <rect x="0" y="6" width="20" height="2" rx="1" fill="black" />
            <rect x="0" y="12" width="20" height="2" rx="1" fill="black" />
          </svg>
        </Box>
        <svg className="nyt-logo" width="350" height="25" viewBox="0 0 138 25" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The New York Times">
          <title>The New York Times</title>
          <path d="M14.57,2.57C14.57,.55,12.65-.06,11.04,.01V.19c.96,.07,1.7,.46,1.7,1.11,0,.45-.32,1.01-1.28,1.01-.76,0-2.02-.45-3.2-.84-1.3-.45-2.54-.87-3.57-.87-2.02,0-3.55,1.5-3.55,3.36,0,1.5,1.16,2.02,1.63,2.21l.03-.07c-.3-.2-.49-.42-.49-1.06,0-.54,.39-1.26,1.43-1.26,.94,0,2.17,.42,3.8,.88,1.4,.39,2.91,.76,3.75,.87v3.28l-1.58,1.3,1.58,1.36v4.49c-.81,.46-1.75,.61-2.56,.61-1.5,0-2.88-.42-4.02-1.68l4.26-2.07V5.73l-5.2,2.32c.54-1.38,1.55-2.41,2.66-3.08l-.03-.08C3.31,5.73,.5,8.56,.5,12.06c0,4.19,3.35,7.3,7.22,7.3,4.19,0,6.65-3.28,6.61-6.75h-.08c-.61,1.33-1.63,2.59-2.78,3.25v-4.38l1.65-1.33-1.65-1.33v-3.28c1.53,0,3.11-1.01,3.11-2.96M5.8,14.13l-1.21,.61c-.74-.96-1.23-2.32-1.23-4.07,0-.72,.08-1.7,.32-2.39l2.14-.96-.03,6.8h0Zm19.47-5.76l-.81,.64-2.47-2.2-2.86,2.21V.48l-3.89,2.69c.45,.15,.99,.39,.99,1.43v11.81l-1.33,1.01,.12,.12,.67-.46,2.32,2.12,3.11-2.07-.1-.15-.79,.52-1.08-1.08v-7.12l.74-.54,1.7,1.48v6.19c0,3.92-.87,4.73-2.63,5.37v.1c2.93,.12,5.57-.87,5.57-5.89v-6.75l.88-.72-.12-.15h0Zm5.22,10.8l4.51-3.62-.12-.17-2.36,1.87-2.71-2.14v-1.33l4.68-3.3-2.36-3.67-5.2,2.86v6.8l-1.01,.79,.12,.15,.96-.76,3.5,2.54h-.01Zm-.69-5.67v-5.15l2.27,3.55-2.27,1.6ZM53.65,1.61c0-.32-.08-.59-.2-.96h-.07c-.32,.87-.67,1.33-1.68,1.33-.88,0-1.58-.54-1.95-.94,0,.03-2.96,3.42-2.96,3.42l.15,.12,.84-.96c.64,.49,1.21,1.06,2.63,1.08V13.34l-6.06-10.5c-.47-.79-1.28-1.97-2.66-1.97-1.63,0-2.86,1.4-2.66,3.77h.1c.12-.59,.47-1.33,1.18-1.33,.57,0,1.03,.54,1.3,1.03v3.38c-1.87,0-2.93,.87-2.93,2.34,0,.61,.45,1.94,1.72,2.17v-.07c-.17-.17-.34-.32-.34-.67,0-.57,.42-.88,1.18-.88,.12,0,.3,.03,.37,.05v4.38c-2.2,.03-3.89,1.23-3.89,3.31s1.7,2.88,3.47,2.78v-.07c-1.11-.12-1.68-.69-1.68-1.5,0-.88,.64-1.36,1.45-1.36s1.43,.52,1.95,1.11l2.96-3.33-.12-.12-.76,.87c-1.14-1.01-1.87-1.48-3.18-1.68V4.67l8.36,14.57h.45V4.72c1.6-.1,3.03-1.3,3.03-3.11m2.81,17.54l4.51-3.62-.12-.17-2.36,1.87-2.71-2.14v-1.33l4.68-3.3-2.36-3.67-5.2,2.86v6.8l-1.01,.79,.12,.15,.96-.76,3.5,2.54h0Zm-.69-5.67v-5.15l2.27,3.55-2.27,1.6Zm21.22-5.52l-.69,.52-1.97-1.68-2.29,2.07,.94,.88v7.72l-2.34-1.6v-6.26l.81-.57-2.41-2.24-2.24,2.07,.94,.88v7.46l-.15,.1-2.2-1.6v-6.13c0-1.43-.72-1.85-1.63-2.41-.76-.47-1.16-.91-1.16-1.63,0-.79,.69-1.11,.91-1.23-.79-.03-2.98,.76-3.03,2.76-.03,1.03,.47,1.48,.99,1.97,.52,.49,1.01,.96,1.01,1.83v6.01l-1.06,.84,.12,.12,1.01-.79,2.63,2.14,2.51-1.75,2.76,1.75,5.42-3.2v-6.95l1.21-.94-.1-.15h0Zm18.15-5.84l-1.03,.94-2.32-2.02-3.13,2.51V1.19h-.19V18.12c-.34-.05-1.06-.25-1.85-.37V3.58c0-1.03-.74-2.47-2.59-2.47s-3.01,1.56-3.01,2.91h.08c.1-.61,.52-1.16,1.13-1.16s1.18,.39,1.18,1.78v4.04c-1.75,.07-2.81,1.16-2.81,2.34,0,.67,.42,1.92,1.75,1.97v-.1c-.45-.19-.54-.42-.54-.67,0-.59,.57-.79,1.36-.79h.19v6.51c-1.5,.52-2.2,1.53-2.2,2.78,0,1.72,1.38,3.05,3.4,3.05,1.43,0,2.44-.25,3.75-.54,1.06-.22,2.21-.47,2.83-.47,.79,0,1.14,.35,1.14,.91,0,.72-.27,1.08-.69,1.21v.1c1.7-.32,2.69-1.3,2.69-2.83s-1.5-2.54-3.18-2.54c-.87,0-2.44,.27-3.72,.57-1.43,.32-2.66,.47-3.11,.47-.72,0-1.6-.32-1.6-1.28,0-.87,.72-1.56,2.49-1.56,.96,0,1.9,.15,3.08,.42,1.26,.27,2.12,.64,3.2,.64,1.5,0,2.71-.54,2.71-2.74V3.29l1.11-1.01-.12-.15h0Zm-4.24,6.78c-.27,.3-.59,.54-1.11,.54-.57,0-.87-.3-1.14-.54V3.81l.74-.59,1.5,1.28v4.41h0Zm0,2.41c-.25-.25-.57-.47-1.11-.47s-.91,.27-1.14,.47v-2.17c.22,.19,.59,.49,1.14,.49s.87-.25,1.11-.49v2.17Zm0,5.1c0,.84-.42,1.78-1.5,1.78-.17,0-.57-.03-.74-.05v-6.58c.25-.22,.57-.52,1.14-.52,.52,0,.81,.25,1.11,.52v4.86h0Zm8.78,2.74l5.03-3.13v-6.85l-3.25-2.39-5.03,2.88v6.78l-.99,.79,.1,.15,.81-.67,3.33,2.44h0Zm-.37-3.55v-7.3l2.51,1.87v7.3l-2.51-1.87Zm15.01-8.65c-.39,.27-.74,.42-1.11,.42-.39,0-.88-.25-1.14-.57,0,.03-1.87,2.02-1.87,2.02l-1.87-2.02-3.05,2.12,.1,.17,.81-.54,1.11,1.21v6.63l-1.33,1.01,.12,.12,.67-.46,2.49,2.12,3.15-2.09-.1-.15-.81,.49-1.28-1.16v-7.28c.52,.57,1.11,1.06,1.82,1.06,1.28,0,2.14-1.53,2.29-3.11m11.88,9.81l-.94,.59-5.2-7.76,.27-.37c.57,.34,1.08,.81,2.17,.81s2.47-1.14,2.59-3.23c-.27,.37-.81,.81-1.7,.81-.64,0-1.28-.42-1.67-.81l-3.55,5.22,4.71,7.17,3.42-2.27-.1-.17h0Zm-6.31,.19l-.79,.52-1.08-1.08V.48l-3.89,2.69c.45,.15,.99,.39,.99,1.43v11.81l-1.33,1.01,.12,.12,.67-.46,2.32,2.12,3.11-2.07-.1-.15h0Zm22.89-14.39c0-2.02-1.92-2.63-3.53-2.56V.19c.96,.07,1.7,.46,1.7,1.11,0,.45-.32,1.01-1.28,1.01-.76,0-2.02-.45-3.2-.84-1.3-.45-2.54-.87-3.57-.87-2.02,0-3.55,1.5-3.55,3.35,0,1.5,1.16,2.02,1.63,2.21l.03-.07c-.3-.2-.49-.42-.49-1.06,0-.54,.39-1.26,1.43-1.26,.94,0,2.17,.42,3.8,.88,1.4,.39,2.91,.76,3.75,.87v3.28l-1.58,1.3,1.58,1.36v4.49c-.81,.46-1.75,.61-2.56,.61-1.5,0-2.89-.42-4.02-1.68l4.26-2.07V5.73l-5.2,2.32c.54-1.38,1.55-2.41,2.66-3.08l-.03-.08c-3.08,.84-5.89,3.67-5.89,7.17,0,4.19,3.35,7.3,7.22,7.3,4.19,0,6.65-3.28,6.61-6.75h-.07c-.61,1.33-1.63,2.59-2.78,3.25v-4.38l1.65-1.33-1.65-1.33v-3.28c1.53,0,3.11-1.01,3.11-2.96m-8.78,11.56l-1.21,.61c-.74-.96-1.23-2.32-1.23-4.07,0-.72,.07-1.7,.32-2.39l2.14-.96-.03,6.8h0Zm11.93-12.31l-2.17,1.82,1.85,2.09,2.17-1.82-1.85-2.09Zm3.3,15.15l-.79,.52-1.08-1.08v-7.17l.91-.72-.12-.15-.76,.59-1.8-2.14-2.96,2.07,.1,.17,.74-.49,.99,1.23v6.61l-1.33,1.01,.12,.12,.67-.46,2.32,2.12,3.11-2.07-.1-.15h0Zm16.63-.1l-.74,.49-1.16-1.11v-7.03l.94-.72-.12-.15-.84,.64-2.47-2.2-2.78,2.17-2.44-2.17-2.74,2.14-1.85-2.14-2.96,2.07,.1,.17,.74-.49,1.06,1.21v6.61l-.81,.81,2.36,2,2.29-2.07-.94-.88v-7.04l.61-.45,1.7,1.48v6.16l-.79,.81,2.39,2,2.24-2.07-.94-.88v-7.04l.59-.47,1.72,1.5v6.06l-.69,.72,2.41,2.2,3.18-2.17-.1-.15h.02Zm8.6-1.5l-2.36,1.87-2.71-2.14v-1.33l4.68-3.3-2.36-3.67-5.2,2.86v6.93l3.57,2.59,4.51-3.62-.12-.17h0Zm-5.08-1.88v-5.15l2.27,3.55-2.27,1.6Zm14.12-.97l-2-1.53c1.33-1.16,1.8-2.63,1.8-3.69,0-.15-.03-.42-.05-.67h-.08c-.19,.54-.72,1.01-1.53,1.01s-1.26-.45-1.75-.99l-4.58,2.54v3.72l1.75,1.38c-1.75,1.55-2.09,2.51-2.09,3.4s.52,1.67,1.41,2.02l.07-.12c-.22-.19-.42-.32-.42-.79,0-.34,.35-.88,1.14-.88,1.01,0,1.63,.69,1.95,1.06,0-.03,4.38-2.69,4.38-2.69v-3.77h0Zm-1.03-3.05c-.69,1.23-2.21,2.44-3.11,3.13l-1.11-.94v-3.62c.45,.99,1.36,1.82,2.54,1.82,.69,0,1.14-.12,1.67-.39m-1.9,8.13c-.52-1.16-1.63-2-2.86-2-.3,0-1.21-.03-2,.46,.47-.79,1.87-2.21,3.65-3.28l1.21,1.01v3.8Z"></path>        </svg>
      </Flex>
      <Flex maxW="600px" mx="auto" w="100%" align="flex-start" justify="flex-start" pt={6} borderBottomWidth={1} borderColor="gray.200" pb={6}>
        <Stack spacing={2}>
          <Text fontSize="12px" fontWeight="bold" letterSpacing="1px">MODERN LOVE</Text>
          <Heading fontFamily="cheltenhamclassic" fontSize={{ base: '30px', md: '40px' }} fontWeight="light">
            Tiny Love Stories: ‘Your Title Here’
          </Heading>
          <Text fontFamily="cheltenhamclassic" maxW="700px" fontSize={{ base: '16px', md: '20px' }}>
            Modern Love in miniature, featuring reader-submitted stories of no more than 100 words. (This one is longer.)
          </Text>
        </Stack>
      </Flex>

      <Flex maxW="600px" mx="auto" w="100%" align="flex-start" justify="flex-start" pt={8}>
        <Text fontFamily="NYT Franklin Small" color="black">December 13, 2025</Text>
      </Flex>

      {/* Article title + paragraph (example from attachment) */}
      <Flex maxW="600px" mx="auto" w="100%" align="flex-start" justify="flex-start" pt={10}>
        <Stack spacing={4}>
          <Heading fontFamily="cheltenhamclassic" fontWeight="light" fontSize={{ base: '22px', md: '30px' }} >
            Your Article Here
          </Heading>
          <Text fontFamily="Georgia" fontSize={{ base: '16px', md: '20px' }} color="gray.800" >
            Your article goes here!
          </Text>
          <Text fontFamily="Georgia" fontSize={{ base: '16px', md: '20px' }} color="gray.800" fontStyle="italic" >
            — Your Name
          </Text>
          <Image src="header.png" alt="header" />
          <Text color="gray.600" fontFamily="Georgia" maxW="700px">
            Caption the picture here hehe
          </Text>
          <Box h="100px" />
        </Stack>
      </Flex>
    </Box>
  );

  // Home screen shown at root ('/'), and we keep the existing page for '/play'.
  const Home = () => (
    <Box w="100vw" minH="100vh" bg="#B3A7FE" color="black">
      {/* Keep the site header on the Home screen */}
      <Box bg="white">
        <Header />
      </Box>

      <Flex alignItems="center" justifyContent="center" minH="calc(100vh - 88px)">
        <Stack spacing={3} align="center">
          <Image src="/connections-icon.png" alt="connections icon" boxSize={{ base: '60px', md: '80px' }} />
          <Heading fontFamily="NYT Karnak" fontWeight="bold" fontSize={{ base: '28px', md: '44px' }}>
            Connections
          </Heading>
          <Text fontSize={{ base: '14px', md: '18px' }} color="gray.800">No need to subscribe for unlimited play.</Text>

          {/* Compact button stack: Play + Subscribe closer together */}
          <Stack spacing={2} align="center" mt={1}>
            <Button
              colorScheme="black"
              rounded="full"
              bg="black"
              color="white"
              py={6}
              width={{ base: '100px', md: '150px' }}
              onClick={() => {
                window.history.pushState({}, '', '/play');
                setPath('/play');
              }}
            >
              Play
            </Button>
            <Button
              colorScheme="black"
              variant="outline"
              rounded="full"
              borderWidth={1}
              py={6}
              width={{ base: '100px', md: '150px' }}
              onClick={() => window.open('https://www.nytimes.com/subscription', '_blank')}
            >
              Subscribe
            </Button>
          </Stack>

          {/* Compact date / metadata stack */}
          <Stack spacing={0} align="center" mt={2}>
            <Text fontFamily="NYT Franklin" fontSize={{ base: '12px', md: '16px' }} textAlign="center" maxW="300px" fontWeight="medium">
              December 13, 2025
            </Text>
            <Text fontFamily="NYT Franklin Small" fontSize={{ base: '12px', md: '14px' }} textAlign="center" maxW="300px">
              No. 917
            </Text>
            <Text fontFamily="NYT Franklin Small" fontSize={{ base: '12px', md: '14px' }} textAlign="center" maxW="300px">
              By Emily Chen
            </Text>
          </Stack>
        </Stack>
      </Flex>
    </Box>
  );

  // if user navigated to modern-love, show that page
  if (path === '/modern-love') {
    return (
      <ChakraProvider>
        <ModernLove />
      </ChakraProvider>
    );
  }

  // The existing main app UI becomes the Play screen (rendered at '/play')
  if (path === '/play') {
    return (
      <ChakraProvider>
        <Box w="100%" minH="100vh" overflowX="hidden">
          {/* NYT Games header (T Games logo) */}
          <Header />
          {/* Divider + icon row (icons aligned right) */}
          <Flex mx="auto" w="100%" align="center" justify="flex-end" borderTopWidth={1} borderBottomWidth={1} borderColor="gray.200" pt={4} paddingBottom={3} paddingTop={3} pr={65}>
            <HStack spacing={4} align="center">
              {/* lightbulb */}
              <Box as="span" aria-hidden="true">
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="25" viewBox="0 0 24 24" width="30" className="game-icon" data-testid="icon-forum">
                  <path fill="var(--text)" d="M15.4538 15.0078C17.2881 13.8544 18.5 11.818 18.5 9.5C18.5 5.91015 15.5899 3 12 3C8.41015 3 5.5 5.91015 5.5 9.5C5.5 11.818 6.71194 13.8544 8.54624 15.0078C9.37338 15.5279 10 16.4687 10 17.6014V20H14V17.6014C14 16.4687 14.6266 15.5279 15.4538 15.0078ZM16.5184 16.7009C16.206 16.8974 16 17.2323 16 17.6014V20C16 21.1046 15.1046 22 14 22H10C8.89543 22 8 21.1046 8 20V17.6014C8 17.2323 7.79404 16.8974 7.48163 16.7009C5.08971 15.1969 3.5 12.5341 3.5 9.5C3.5 4.80558 7.30558 1 12 1C16.6944 1 20.5 4.80558 20.5 9.5C20.5 12.5341 18.9103 15.1969 16.5184 16.7009ZM8 17H16V21C16 22.1046 15.1046 23 14 23H10C8.89543 23 8 22.1046 8 21V17Z"></path>
                </svg>
              </Box>

              {/* graph */}
              <Box as="span" aria-hidden="true">
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="4 4 24 24" width="30" className="game-icon" data-testid="icon-stats">
                  <path fill="var(--text)" d="M21.3332 14.6667V4H10.6665V12H2.6665V28H29.3332V14.6667H21.3332ZM13.3332 6.66667H18.6665V25.3333H13.3332V6.66667ZM5.33317 14.6667H10.6665V25.3333H5.33317V14.6667ZM26.6665 25.3333H21.3332V17.3333H26.6665V25.3333Z"></path>
                </svg>
              </Box>

              {/* question mark */}
              <Box as="span" aria-hidden="true">
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="2 2 28 28" width="30" className="game-icon" data-testid="icon-help">
                  <path fill="var(--text)" d="M15 24H17.6667V21.3333H15V24ZM16.3333 2.66666C8.97333 2.66666 3 8.63999 3 16C3 23.36 8.97333 29.3333 16.3333 29.3333C23.6933 29.3333 29.6667 23.36 29.6667 16C29.6667 8.63999 23.6933 2.66666 16.3333 2.66666ZM16.3333 26.6667C10.4533 26.6667 5.66667 21.88 5.66667 16C5.66667 10.12 10.4533 5.33332 16.3333 5.33332C22.2133 5.33332 27 10.12 27 16C27 21.88 22.2133 26.6667 16.3333 26.6667ZM16.3333 7.99999C13.3867 7.99999 11 10.3867 11 13.3333H13.6667C13.6667 11.8667 14.8667 10.6667 16.3333 10.6667C17.8 10.6667 19 11.8667 19 13.3333C19 16 15 15.6667 15 20H17.6667C17.6667 17 21.6667 16.6667 21.6667 13.3333C21.6667 10.3867 19.28 7.99999 16.3333 7.99999Z"></path>
                </svg>
              </Box>
            </HStack>
          </Flex>

          <Modal isOpen={showPrompt} onClose={() => setShowPrompt(false)} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Good job! Customize this as you please.</ModalHeader>

              <ModalBody>
                <Text>Add a heartfelt message... C'mon now</Text>
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" onClick={() => { setShowPrompt(false); goToModernLove(); }}>
                  Read today's article
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <Flex align="center" justify="center" py={8}>
            <Stack spacing={4} align="center" w="100%">
              <Text fontWeight="semibold">Create four groups of four!</Text>
              {/* Container to keep completed groups and the tile grid the same width */}
              <Box w={{ base: '92vw', md: '624px' }} mx="auto">
                <Stack>
                  {game.complete.map((group) => (
                    <Stack
                      spacing={1}
                      lineHeight={1}
                      rounded="lg"
                      align="center"
                      justify="center"
                      h="80px"
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

                  <SimpleGrid
                    display={{ base: 'grid', md: 'none' }}
                    columns={{ base: 4, md: 4 }}
                    spacing={4}
                    w="100%"
                    mx="auto"
                    px={{ base: 2, md: 0 }}
                  >
                  {game.items.map((item) => (
                    <AspectRatio ratio={1} w="100%">
                      <Button
                        w="100%"
                        h="100%"
                        bg="#efefe6"
                        fontSize={{ base: '11px', sm: '12px', md: '14px' }}
                        fontWeight="extrabold"
                        textTransform="uppercase"
                        onClick={() => game.toggleActive(item)}
                        isActive={game.activeItems.includes(item)}
                        whiteSpace="normal"
                        lineHeight={1.1}
                        px={2}
                        _active={{
                          bg: '#5a594e',
                          color: 'white',
                        }}
                      >
                        {item}
                      </Button>
                    </AspectRatio>
                  ))}
                </SimpleGrid>

                {/* Desktop / larger screens: preserve original rectangular tiles and font sizes */}
                <Box display={{ base: 'none', md: 'block' }}>
                  {chunk(game.items, 4).map((row, rowIdx) => (
                    <HStack key={`row-${rowIdx}`} spacing={3} justify="center" mb={3}>
                      {row.map((item) => (
                        <Button
                          key={item}
                          w="150px"
                          h="80px"
                          bg="#efefe6"
                          fontSize="19px"
                          fontWeight="extrabold"
                          textTransform="uppercase"
                          onClick={() => game.toggleActive(item)}
                          isActive={game.activeItems.includes(item)}
                          _active={{
                            bg: '#5a594e',
                            color: 'white',
                          }}
                        >
                          {item}
                        </Button>
                      ))}
                    </HStack>
                  ))}
                </Box>
              </Stack>
              </Box>
              <HStack align="baseline">
                <Text>Mistakes remaining:</Text>
                {[...Array(game.mistakesRemaining).keys()].map(() => (
                  <Circle bg="gray.800" size="12px" />
                ))}
              </HStack>
              <HStack>
                <Button
                  colorScheme="black"
                  variant="outline"
                  rounded="full"
                  py={6}
                  borderWidth="1px"
                  onClick={game.shuffle}
                >
                  Shuffle
                </Button>
                <Button
                  colorScheme="black"
                  variant="outline"
                  rounded="full"
                  py={6}
                  borderWidth="1px"
                  onClick={game.deselectAll}
                >
                  Deselect All
                </Button>
                <Button
                  colorScheme="black"
                  variant="outline"
                  rounded="full"
                  py={6}
                  borderWidth="1px"
                  isDisabled={game.activeItems.length !== 4}
                  onClick={game.submit}
                >
                  Submit
                </Button>
              </HStack>
            </Stack>
          </Flex>
        </Box>
      </ChakraProvider>
    );
  }

  // default route: show Home page
  return (
    <ChakraProvider>
      <Home />
    </ChakraProvider>
  );
};
