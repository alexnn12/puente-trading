'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HeartIcon } from 'lucide-react';

export default function AccionCard({ stock, price }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    alert (token);
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
        setIsFavorite(true);
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
        setIsFavorite(false);
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

  return (
    <Card key={stock.symbol}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>{stock.name}</span>
            <span className="text-sm font-normal text-gray-500">({stock.symbol})</span>
          </div>
          <button
            onClick={handleFavoriteClick}
            disabled={isLoading}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <HeartIcon 
              className={`w-4 h-4 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-500'} ${isLoading ? 'opacity-50' : ''}`} 
            />
          </button>
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