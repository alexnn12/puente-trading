'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AccionCard from '@/components/acciones/acciones_lista';

export default function Dashboard() {
  const [stockPrices, setStockPrices] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  // Filtrar acciones basado en el término de búsqueda
  const filteredStocks = stocks.filter(stock => 
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                weekChange: result.data.weekChange
              };
            }
          }
          return { symbol: stock.symbol, price: null, yesterdayChange: null, weekChange: null };
        });

        const results = await Promise.all(promises);
        const pricesData = {};
        results.forEach(result => {
          pricesData[result.symbol] = {
            price: result.price,
            yesterdayChange: result.yesterdayChange,
            weekChange: result.weekChange
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

    fetchStockPrices();
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
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Precios actuales de acciones</p>
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
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <p className="text-gray-500">No se encontraron acciones que coincidan con tu búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
