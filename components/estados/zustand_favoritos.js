import { create } from 'zustand';

const useFavoritosStore = create((set, get) => ({
  favoritos: [],

  // Establecer favoritos
  setFavoritos: (favoritos) => set({ favoritos }),

  // Obtener favoritos
  getFavoritos: () => get().favoritos,

  // Agregar favorito
  addFavorito: (simbolo) => {
    const currentFavoritos = get().favoritos;
    if (!currentFavoritos.includes(simbolo)) {
      set({ favoritos: [...currentFavoritos, simbolo] });
    }
  },

  // Eliminar favorito
  deleteFavorito: (simbolo) => {
    const currentFavoritos = get().favoritos;
    set({ favoritos: currentFavoritos.filter(fav => fav !== simbolo) });
  },

  // Verificar si es favorito
  isFavorito: (simbolo) => {
    return get().favoritos.includes(simbolo);
  }
}));

export default useFavoritosStore;

