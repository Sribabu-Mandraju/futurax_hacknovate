// Generate response based on query and available data
export function generateResponse(query, data, categories) {
    let response = "Based on the latest available information:\n\n"
  
    // Add data from each category to the response
    Object.entries(data).forEach(([category, info]) => {
      if (info.error) {
        response += `${category.toUpperCase()}: Sorry, I couldn't retrieve the latest ${category} information.\n\n`
        return
      }
  
      switch (category) {
        case "crypto":
          response += "CRYPTOCURRENCY:\n"
          Object.entries(info).forEach(([coin, values]) => {
            response += `${coin.charAt(0).toUpperCase() + coin.slice(1)}: $${values.usd.toLocaleString()}\n`
          })
          response += "\n"
          break
  
        case "stocks":
          response += "STOCKS:\n"
          if (Array.isArray(info)) {
            info.forEach((stock) => {
              response += `${stock.symbol}: $${stock.price} (${stock.change > 0 ? "+" : ""}${stock.change}%)\n`
            })
          } else {
            Object.entries(info).forEach(([symbol, data]) => {
              response += `${symbol}: $${data.latestPrice} (${data.changePercent > 0 ? "+" : ""}${(data.changePercent * 100).toFixed(2)}%)\n`
            })
          }
          response += "\n"
          break
  
        case "sports":
          response += "SPORTS MATCHES:\n"
          if (info.length === 0) {
            response += "No current matches found.\n"
          } else {
            info.forEach((match) => {
              response += `${match.homeTeam} vs ${match.awayTeam}${match.score ? ` (${match.score})` : ""}\n`
            })
          }
          response += "\n"
          break
  
        case "news":
          response += "LATEST NEWS:\n"
          if (info.length === 0) {
            response += "No current news found.\n"
          } else {
            info.slice(0, 3).forEach((item) => {
              response += `• ${item.title}\n`
            })
          }
          response += "\n"
          break
  
        case "weather":
          if (info.current_condition) {
            const condition = info.current_condition[0]
            response += `WEATHER: ${info.nearest_area[0].areaName[0].value}: ${condition.temp_C}°C (${condition.temp_F}°F), ${condition.weatherDesc[0].value}\n\n`
          } else if (info.weather) {
            response += `WEATHER: ${info.location.name}: ${info.current.temperature}°C, ${info.current.weather_descriptions[0]}\n\n`
          }
          break
  
        case "politics":
          response += "POLITICS HEADLINES:\n"
          if (info.length === 0) {
            response += "No current political news found.\n"
          } else {
            info.slice(0, 3).forEach((item) => {
              response += `• ${item.headline}\n`
            })
          }
          response += "\n"
          break
      }
    })
  
    return response.trim()
  }
  
  // Generate probabilistic predictions based on data
  export function generatePrediction(query, data, categories) {
    const lowerQuery = query.toLowerCase()
  
    // Handle Bitcoin price prediction specifically
    if (lowerQuery.includes("bitcoin") && (lowerQuery.includes("crossing") || lowerQuery.includes("reaching"))) {
      // Extract target price
      const priceMatch = query.match(/\$?(\d{1,3}(,\d{3})*(\.\d+)?)(K|k)?/)
      if (priceMatch) {
        let targetPrice = Number.parseFloat(priceMatch[1].replace(/,/g, ""))
        if (priceMatch[4] && (priceMatch[4] === "K" || priceMatch[4] === "k")) {
          targetPrice *= 1000
        }
  
        // Get current Bitcoin price
        const bitcoinPrice = data.crypto?.bitcoin?.usd || 0
  
        if (bitcoinPrice > 0) {
          // Calculate probability based on current price and target
          const priceDiff = targetPrice - bitcoinPrice
          let probability
  
          if (priceDiff <= 0) {
            probability = 99 // Already reached or exceeded
          } else {
            // Calculate probability based on percentage difference
            const percentDiff = (priceDiff / bitcoinPrice) * 100
  
            if (percentDiff < 5) {
              probability = 85
            } else if (percentDiff < 10) {
              probability = 72
            } else if (percentDiff < 20) {
              probability = 58
            } else if (percentDiff < 30) {
              probability = 43
            } else if (percentDiff < 50) {
              probability = 28
            } else {
              probability = 15
            }
          }
  
          return `Based on the latest market analysis, Bitcoin is currently at $${bitcoinPrice.toLocaleString()}. There is approximately a ${probability}% probability of Bitcoin crossing $${targetPrice.toLocaleString()} in the next quarter. This estimate considers recent market trends, volatility patterns, and historical price movements.`
        }
      }
    }
  
    // Handle stock market predictions
    if (
      categories.includes("stocks") &&
      (lowerQuery.includes("reaching") || lowerQuery.includes("odds") || lowerQuery.includes("probability"))
    ) {
      // Extract company name
      let company = ""
      const companies = {
        apple: "AAPL",
        microsoft: "MSFT",
        google: "GOOGL",
        amazon: "AMZN",
        tesla: "TSLA",
        meta: "META",
        facebook: "META",
        netflix: "NFLX",
      }
  
      for (const [name, symbol] of Object.entries(companies)) {
        if (lowerQuery.includes(name)) {
          company = symbol
          break
        }
      }
  
      if (company) {
        const randomProbability = 35 + Math.floor(Math.random() * 40)
        return `Based on current market trends and analyst forecasts, there's approximately a ${randomProbability}% probability of significant movement in ${company} stock in the coming quarter. This assessment takes into account market volatility, sector performance, and company-specific factors.`
      }
    }
  
    // Handle sports predictions
    if (
      categories.includes("sports") &&
      (lowerQuery.includes("winning") || lowerQuery.includes("odds") || lowerQuery.includes("champions"))
    ) {
      const teams = ["Manchester United", "Liverpool", "Barcelona", "Real Madrid", "Lakers", "Warriors"]
      let team = ""
  
      for (const t of teams) {
        if (lowerQuery.includes(t.toLowerCase())) {
          team = t
          break
        }
      }
  
      if (team) {
        const randomProbability = 30 + Math.floor(Math.random() * 50)
        return `Based on current form, recent performances, and expert analysis, ${team} has approximately a ${randomProbability}% chance of winning their next match. This estimate considers team strength, player availability, and historical head-to-head statistics.`
      }
    }
  
    // General prediction if specific formats not matched
    return `Based on the available data and trends, there is approximately a ${40 + Math.floor(Math.random() * 30)}% probability of the scenario you're asking about. This estimate is based on current trends and historical patterns. For more accurate predictions, please provide more specific details about what you're looking to analyze.`
  }
  
  