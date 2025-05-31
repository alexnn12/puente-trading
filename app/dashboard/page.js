'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AccionCard from '@/components/acciones/acciones_card';
import useFavoritosStore from '@/components/estados/zustand_favoritos';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
  } from "@/components/ui/navigation-menu"
import { Grid3X3Icon, ListIcon } from 'lucide-react';

export default function Dashboard() {
  const [stockPrices, setStockPrices] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [favoritosState, setFavoritosState] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const { favoritos, setFavoritos, getFavoritos, addFavorito, deleteFavorito, isFavorito, clearFavoritos, tipoDeCard, setTipoDeCard } = useFavoritosStore();
  

  // Array de acciones a consultar
  const stocks = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.'
    },
   {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.'
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corporation'
    },
    {
      symbol: 'AMZN',
      name: 'Amazon.com Inc.'
    },
    {
      symbol: 'TSLA',
      name: 'Tesla Inc.'
    },
    {
      symbol: 'META',
      name: 'Meta Platforms Inc.'
    },
  ];

  // Filtrar acciones basado en el término de búsqueda y la pestaña activa
  const filteredStocks = stocks.filter(stock => {
    const matchesSearch = stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         stock.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'favoritos') {
      return matchesSearch && favoritos.includes(stock.symbol);
    }
    
    return matchesSearch;
  });

  useEffect(() => {
    const fetchStockPrices = async () => {
      try {
        const promises = stocks.map(async (stock) => {
          let url = `/api/acciones?symbol=${stock.symbol}`;
          console.log(url);
          const response = await fetch(url);
          
          if (response.ok) {
            const result = await response.json();
            if (result.data && result.data.price) {
              return {
                symbol: stock.symbol,
                price: result.data.price,
                yesterdayChange: result.data.yesterdayChange,
                weekChange: result.data.weekChange,
                open: result.data.open,
                high: result.data.high,
                low: result.data.low,
                volume: result.data.volume,
                
              };
            }
          }
          return { symbol: stock.symbol, price: null, yesterdayChange: null, weekChange: null, open: null, high: null, low: null, volume: null };
        });

        const results = await Promise.all(promises);
        const pricesData = {};
        results.forEach(result => {
          pricesData[result.symbol] = {
            price: result.price,
            yesterdayChange: result.yesterdayChange,
            weekChange: result.weekChange,
            open: result.open,
            high: result.high,
            low: result.low,
            volume: result.volume,
          };
        });
        
        setStockPrices(pricesData);
      } catch (error) {
        console.error('Error:', error);
        setError('Error de conexión. Intenta nuevamente.');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchFavoritos = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('/api/usuario/favorito', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const result = await response.json();
          setFavoritosState(result.data || []);
          setFavoritos(result.data.map(fav => fav.simbolo));

        }
      } catch (error) {
        console.error('Error fetching favoritos:', error);
      }
    };

    fetchStockPrices();
    fetchFavoritos();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando precios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Mercado de acciones</h1>
        <p className="text-gray-600">Precios actuales de acciones</p>
      </div>
      <div className="space-y-4">
      <NavigationMenu>
            <NavigationMenuList>
               <NavigationMenuItem>
                  <NavigationMenuLink 
                    className={`group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 cursor-pointer ${activeTab === 'dashboard' ? 'bg-accent text-accent-foreground' : ''}`}
                    onClick={() => setActiveTab('dashboard')}
                  >
                    Dashboard
                  </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                  <NavigationMenuLink 
                    className={`group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 cursor-pointer ${activeTab === 'favoritos' ? 'bg-accent text-accent-foreground' : ''}`}
                    onClick={() => setActiveTab('favoritos')}
                  >
                    Favoritos
                  </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search">Buscar por símbolo o nombre</Label>
          <Input
            id="search"
            type="text"
            placeholder="Ej: AAPL, Apple, Microsoft..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label>Tipo de vista:</Label>
            <div className="flex items-center gap-1 border rounded-md p-1">
            <button 
                onClick={() => setTipoDeCard('listado')}
                className={`p-2 rounded transition-colors ${tipoDeCard === 'listado' ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'}`}
                title="Vista de lista"
              >
                <ListIcon className="w-4 h-4" /> 
              </button>
              <button
                onClick={() => setTipoDeCard('ficha')}
                className={`p-2 rounded transition-colors ${tipoDeCard === 'ficha' ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'}`}
                title="Vista de fichas"
              >
                <Grid3X3Icon className="w-4 h-4" />
              </button>
             
            </div>
          </div>
        </div>
      </div>
      
      <div className={`grid grid-cols-1 md:grid-cols-${tipoDeCard === 'listado' ? '1' : '2'} gap-2`}>
        {filteredStocks.length > 0 ? (
          filteredStocks.map((stock) => {
            const price = stockPrices[stock.symbol];
            
            return (
              <AccionCard
                key={stock.symbol}
                stock={stock}
                price={price}
              />
            );
          })
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">
              {activeTab === 'favoritos' 
                ? 'No tienes acciones favoritas que coincidan con tu búsqueda.' 
                : 'No se encontraron acciones que coincidan con tu búsqueda.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
