import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
  favorites: string[];
  addFavorite: (distributorId: string) => void;
  removeFavorite: (distributorId: string) => void;
  toggleFavorite: (distributorId: string) => void;
  isFavorite: (distributorId: string) => boolean;
}

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      
      addFavorite: (distributorId: string) => {
        set((state) => ({
          favorites: [...state.favorites, distributorId]
        }));
      },
      
      removeFavorite: (distributorId: string) => {
        set((state) => ({
          favorites: state.favorites.filter(id => id !== distributorId)
        }));
      },
      
      toggleFavorite: (distributorId: string) => {
        const { favorites } = get();
        if (favorites.includes(distributorId)) {
          get().removeFavorite(distributorId);
        } else {
          get().addFavorite(distributorId);
        }
      },
      
      isFavorite: (distributorId: string) => {
        return get().favorites.includes(distributorId);
      },
    }),
    {
      name: 'aqua-favorites',
    }
  )
);