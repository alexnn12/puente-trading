import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    
    if (!symbol) {
      return Response.json(
        { message: "Symbol parameter is required" },
        { status: 400 }
      );
    }

    // Verificar si existe en la base de datos y si no han pasado 24 horas
    const existingAccion = await prisma.acciones.findFirst({
      where: { simbolo: symbol }
    });

    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Si existe y no han pasado 24 horas, devolver datos guardados
    if (existingAccion && existingAccion.actualizado && existingAccion.actualizado > twentyFourHoursAgo) {
      const globalQuoteData = JSON.parse(existingAccion.global_quote);
      const timeSeriesData = existingAccion.time_series_daily ? JSON.parse(existingAccion.time_series_daily) : null;
      
      let stockData = {
        symbol: symbol,
        price: parseFloat(globalQuoteData['05. price']) || 0,
        change: parseFloat(globalQuoteData['09. change']) || 0,
        changePercent: globalQuoteData['10. change percent'] || '0%',
        volume: parseInt(globalQuoteData['06. volume']) || 0,
        previousClose: parseFloat(globalQuoteData['08. previous close']) || 0,
        open: parseFloat(globalQuoteData['02. open']) || 0,
        high: parseFloat(globalQuoteData['03. high']) || 0,
        low: parseFloat(globalQuoteData['04. low']) || 0
      };

      // Agregar datos históricos si existen
      if (timeSeriesData) {
        const timeSeries = timeSeriesData['Time Series (Daily)'];
        if (timeSeries) {
          const dates = Object.keys(timeSeries).sort((a, b) => new Date(b) - new Date(a));
          
          let yesterdayChange = 0;
          if (dates.length >= 2) {
            const todayPrice = parseFloat(timeSeries[dates[0]]['4. close']);
            const yesterdayPrice = parseFloat(timeSeries[dates[1]]['4. close']);
            yesterdayChange = todayPrice - yesterdayPrice;
          }
          
          let weekChange = 0;
          if (dates.length >= 8) {
            const todayPrice = parseFloat(timeSeries[dates[0]]['4. close']);
            const weekAgoPrice = parseFloat(timeSeries[dates[7]]['4. close']);
            weekChange = todayPrice - weekAgoPrice;
          }
          
          stockData.yesterdayChange = yesterdayChange;
          stockData.weekChange = weekChange;
        }
      }

      return Response.json(
        { data: stockData },
        { status: 200 }
      );
    }

    // Si no existe o han pasado 24 horas, obtener datos de la API
    const simbolo ="IBM";
    const API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY || 'demo';
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
    console.log(url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      return Response.json(
        { message: "Error fetching stock data" },
        { status: 500 }
      );
    }
    
    const data = await response.json();
    const quote = data['Global Quote'];
    
    if (quote && Object.keys(quote).length > 0) {
      const stockData = {
        symbol: symbol,
        price: parseFloat(quote['05. price']) || 0,
        change: parseFloat(quote['09. change']) || 0,
        changePercent: quote['10. change percent'] || '0%',
        volume: parseInt(quote['06. volume']) || 0,
        previousClose: parseFloat(quote['08. previous close']) || 0,
        open: parseFloat(quote['02. open']) || 0,
        high: parseFloat(quote['03. high']) || 0,
        low: parseFloat(quote['04. low']) || 0
      };

      // Fetch daily time series data for historical comparison
      const timeSeriesUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`;
      console.log(timeSeriesUrl);
      const timeSeriesResponse = await fetch(timeSeriesUrl);
      let timeSeriesData = null;
      
      if (timeSeriesResponse.ok) {
        timeSeriesData = await timeSeriesResponse.json();
        const timeSeries = timeSeriesData['Time Series (Daily)'];
        
        if (timeSeries) {
          const dates = Object.keys(timeSeries).sort((a, b) => new Date(b) - new Date(a));
          
          // Get yesterday's data (second most recent date)
          let yesterdayChange = 0;
          if (dates.length >= 2) {
            const todayPrice = parseFloat(timeSeries[dates[0]]['4. close']);
            const yesterdayPrice = parseFloat(timeSeries[dates[1]]['4. close']);
            yesterdayChange = todayPrice - yesterdayPrice;
          }
          
          // Get one week ago data (7 trading days back)
          let weekChange = 0;
          if (dates.length >= 8) {
            const todayPrice = parseFloat(timeSeries[dates[0]]['4. close']);
            const weekAgoPrice = parseFloat(timeSeries[dates[7]]['4. close']);
            weekChange = todayPrice - weekAgoPrice;
          }
          
          // Add historical data to stockData
          stockData.yesterdayChange = yesterdayChange;
          stockData.weekChange = weekChange;
        }
      }

      // Guardar o actualizar en la base de datos
      try {
        if (existingAccion) {
          await prisma.acciones.update({
            where: { simbolo: symbol },
            data: {
              global_quote: JSON.stringify(quote),
              time_series_daily: timeSeriesData ? JSON.stringify(timeSeriesData) : null,
              actualizado: now
            }
          });
        } else {
          await prisma.acciones.create({
            data: {
              simbolo: symbol,
              global_quote: JSON.stringify(quote),
              time_series_daily: timeSeriesData ? JSON.stringify(timeSeriesData) : null,
              actualizado: now
            }
          });
        }
      } catch (dbError) {
        console.error('Error saving to database:', dbError);
        // Continuar y devolver los datos aunque no se puedan guardar
      }

      return Response.json(
        { data: stockData },
        { status: 200 }
      );
    } else {
      return Response.json(
        { message: "No data found for the specified symbol" },
        { status: 404 }
      );
    }
    
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return Response.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
