'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExpandIcon, EyeIcon, HeartIcon, TrendingDownIcon, TrendingUpIcon } from 'lucide-react';
import useFavoritosStore from '@/components/estados/zustand_favoritos';
import { AccionesPopup } from './acciones_popup';

export default function AccionCard({ stock, price,  }) {
  const [isLoading, setIsLoading] = useState(false);
  const { favoritos, addFavorito, deleteFavorito, isFavorito, tipoDeCard } = useFavoritosStore();
  
  const isFavorite = isFavorito(stock.symbol);

  // Función para obtener el token del localStorage
  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  // Función para agregar a favoritos
  const addToFavorites = async () => {
    const token = getToken();
    if (!token) {
      console.error('No hay token de autenticación');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/usuario/favorito', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ simbolo: stock.symbol })
      });

      if (response.ok) {
        addFavorito(stock.symbol);
      } else {
        const error = await response.json();
        console.error('Error al agregar favorito:', error.message);
      }
    } catch (error) {
      console.error('Error de conexión:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para quitar de favoritos
  const removeFromFavorites = async () => {
    const token = getToken();
    if (!token) {
      console.error('No hay token de autenticación');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/usuario/favorito?simbolo=${stock.symbol}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        deleteFavorito(stock.symbol);
      } else {
        const error = await response.json();
        console.error('Error al quitar favorito:', error.message);
      }
    } catch (error) {
      console.error('Error de conexión:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para manejar el click en el corazón
  const handleFavoriteClick = () => {
    if (isLoading) return;
    
    if (isFavorite) {
      removeFromFavorites();
    } else {
      addToFavorites();
    }
  };

  // Vista de lista (compacta)
  if (tipoDeCard === 'listado') {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-6 flex-1 flex-wrap">
            <div className="w-16">
              <span className="font-semibold">{stock.symbol}</span>
            </div>
            <div className="flex-1 min-w-0 hidden md:block">
              <span className="text-sm text-gray-500 truncate">{stock.name}</span>
            </div>
            <div className="w-24 text-right">
              <span className="font-bold">
                {price && price.price ? `$${price.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'No disponible'}
              </span> 
            </div>
            <div className="w-20 text-right flex items-center justify-end gap-1">
              {price?.yesterdayChange !== undefined && price?.yesterdayChange !== null ? (
                <>
                  {price.yesterdayChange >= 0 ? (
                    <TrendingUpIcon className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDownIcon className="w-4 h-4 text-red-600" />
                  )}
                  <span className={`text-sm ${price.yesterdayChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {price.yesterdayChange >= 0 ? '+' : ''}${price.yesterdayChange.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-sm text-gray-500">N/A</span>
              )}
            </div>
            <div className="w-20 text-right flex items-center justify-end gap-1">
              {price?.weekChange !== undefined && price?.weekChange !== null ? (
                <>
                  {price.weekChange >= 0 ? (
                    <TrendingUpIcon className="w-3 h-3 text-green-600" />
                  ) : (
                    <TrendingDownIcon className="w-3 h-3 text-red-600" />
                  )}
                  <span className={`text-xs ${price.weekChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {price.weekChange >= 0 ? '+' : ''}${price.weekChange.toFixed(2)} 
                  </span>
                </>
              ) : (
                <span className="text-xs text-gray-500">N/A sem</span>
              )}
            </div>
          </div>
          
          <div className="ml-4">
            <button
              
              className="p-1 rounded-full hover:bg-gray-100 transition-colors mr-2"
            >
              <AccionesPopup stock={stock} price={price} />
              
            </button>
            <button
              onClick={handleFavoriteClick}
              disabled={isLoading}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <HeartIcon 
                className={`w-4 h-4 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-500'} ${isLoading ? 'opacity-50' : ''}`} 
              />
            </button>
          </div>
        </div>
      </Card>
    );
  }

  // Vista de ficha (completa) - como estaba antes
  return (
    <Card key={stock.symbol}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>{stock.name}</span>
            <span className="text-sm font-normal text-gray-500">({stock.symbol})</span>
          </div>
          <div className="flex items-center gap-1">
            <AccionesPopup stock={stock} price={price} />
            <button
              onClick={handleFavoriteClick}
              disabled={isLoading}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <HeartIcon 
                className={`w-4 h-4 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-500'} ${isLoading ? 'opacity-50' : ''}`} 
              />
            </button>
          </div>
        </CardTitle>
        <CardDescription>
          Precio actual de la acción de {stock.name.split(' ')[0]}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {price && price.price ? `$${price.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'No disponible'}
        </div>
        <p className="text-sm text-gray-500 mt-1">USD</p>
        
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Variación diaria:</span>
              <span>
              {price?.yesterdayChange ? `$${price.yesterdayChange.toFixed(2)}` : 'N/A'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Variación semanal:</span>
              <span>  
                  {price?.weekChange ? `$${price.weekChange.toFixed(2)}` : 'N/A'}
              </span>
            </div>
          </div>
      </CardContent>
    </Card>
  );
}