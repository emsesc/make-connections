import { useEffect, useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { DAY_1, ROUTES } from './constants';
import { useGame } from './game';
import { HomeScreen } from './components/HomeScreen';
import { ModernLovePage } from './components/ModernLovePage';
import { PlayScreen } from './components/PlayScreen';

export const App = () => {
  const game = useGame({
    groups: DAY_1,
  });

  const [path, setPath] = useState<string>(window.location.pathname);
  const [showPrompt, setShowPrompt] = useState<boolean>(false);

  useEffect(() => {
    setShowPrompt(game.complete.length === DAY_1.length);
  }, [game.complete.length]);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const goToPath = (nextPath: string) => {
    window.history.pushState({}, '', nextPath);
    setPath(nextPath);
  };

  if (path === ROUTES.MODERN_LOVE) {
    return (
      <ChakraProvider>
        <ModernLovePage />
      </ChakraProvider>
    );
  }

  if (path === ROUTES.PLAY) {
    return (
      <ChakraProvider>
        <PlayScreen
          game={game}
          showPrompt={showPrompt}
          onClosePrompt={() => setShowPrompt(false)}
          onGoToModernLove={() => goToPath(ROUTES.MODERN_LOVE)}
        />
      </ChakraProvider>
    );
  }

  return (
    <ChakraProvider>
      <HomeScreen onPlay={() => goToPath(ROUTES.PLAY)} />
    </ChakraProvider>
  );
};
