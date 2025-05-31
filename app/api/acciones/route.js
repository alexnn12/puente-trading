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

    const API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY || 'demo';
    const simbolo ="IBM";
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${simbolo}&apikey=${API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      return Response.json(
        { message: "Error fetching stock data" },
        { status: 500 }
      );
    }
    
    const data = await response.json();
//    console.log('API Response:', data);
    const quote = data['Global Quote'];
//    console.log('Quote data:', quote);
    
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
      const timeSeriesUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${simbolo}&apikey=${API_KEY}`;
      const timeSeriesResponse = await fetch(timeSeriesUrl);
      
      if (timeSeriesResponse.ok) {
        const timeSeriesData = await timeSeriesResponse.json();
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
  }
}
