import useMethods from 'use-methods';

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

const MAX_MISTAKES = 3;

export const difficultyColor = (difficulty: 1 | 2 | 3 | 4): string => {
  return {
    1: '#fbd400',
    2: '#b5e352',
    3: '#729eeb',
    4: '#bc70c4',
  }[difficulty];
};

export const chunk = <T,>(list: T[], size: number): T[][] => {
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

export const useGame = (options: Options) => {
  const initialState: State = {
    incomplete: options.groups,
    complete: [],
    items: shuffle(options.groups.flatMap((g) => g.items)),
    activeItems: [],
    mistakesRemaining: MAX_MISTAKES,
  };

  const [state, fns] = useMethods(methods, initialState);

  return {
    ...state,
    ...fns,
  };
};

export type Game = ReturnType<typeof useGame>;
