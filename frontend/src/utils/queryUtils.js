// Categorize the query based on content
export function categorizeQuery(query) {
    const lowerQuery = query.toLowerCase()
  
    // Define category patterns
    const patterns = {
      crypto: [
        "bitcoin",
        "crypto",
        "ethereum",
        "btc",
        "eth",
        "cryptocurrency",
        "blockchain",
        "token",
        "coin",
        "dogecoin",
      ],
      stocks: ["stock", "nasdaq", "dow", "sp500", "s&p", "market", "share", "price", "nyse", "index", "tesla", "apple"],
      sports: ["sports", "match", "game", "team", "player", "score", "odds", "betting", "championship", "tournament"],
      news: ["news", "headline", "current events", "breaking", "article", "report"],
      weather: ["weather", "temperature", "forecast", "rain", "snow", "climate", "humidity"],
      politics: ["politics", "election", "government", "congress", "president", "vote", "policy", "candidate"],
    }
  
    const matchedCategories = []
  
    // Check for probability/odds-related queries
    const isProbabilityQuery =
      lowerQuery.includes("odds") ||
      lowerQuery.includes("probability") ||
      lowerQuery.includes("chance") ||
      lowerQuery.includes("likelihood") ||
      lowerQuery.includes("crossing") ||
      lowerQuery.includes("reaching")
  
    // Detect all matching categories
    for (const [category, keywords] of Object.entries(patterns)) {
      if (keywords.some((keyword) => lowerQuery.includes(keyword))) {
        matchedCategories.push(category)
      }
    }
  
    if (isProbabilityQuery) {
      matchedCategories.push("prediction")
    }
  
    // Return all matched categories or default to general
    return matchedCategories.length > 0 ? matchedCategories : ["general"]
  }
  
  // Extract city name from weather-related queries
  export function extractCity(query) {
    const lowerQuery = query.toLowerCase()
    if (lowerQuery.includes("weather in ")) {
      const parts = query.split("weather in ")
      if (parts.length > 1) {
        return parts[1].split(" ")[0] // Get the first word after "weather in"
      }
    }
    return null
  }
  
  