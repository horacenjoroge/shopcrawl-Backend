// In your search route handler
router.post('/search', auth, async (req, res) => {
  try {
    const { query } = req.body;
    const userId = req.user.id; // From auth middleware
    
    // Perform the search operation using RapidAPI
    const searchResults = await performRapidAPISearch(query);
    
    // Save the search query to history
    const newSearchHistory = new SearchHistory({
      userId,
      query,
      timestamp: new Date(),
      // Extract an image URL from the RapidAPI results, if available
      imageUrl: extractImageFromResults(searchResults)
    });
    
    await newSearchHistory.save();
    
    // Return search results
    res.json(searchResults);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Function to perform search via RapidAPI
async function performRapidAPISearch(query) {
  try {
    const response = await axios({
      method: 'GET',
      url: 'https://api.example.com/search', // Replace with your RapidAPI endpoint
      headers: {
        'x-rapidapi-host': 'api.example.com',
        'x-rapidapi-key': process.env.RAPIDAPI_KEY
      },
      params: {
        q: query,
        // Add any other parameters required by the API
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('RapidAPI search error:', error);
    throw error;
  }
}

// Function to extract an image URL from search results
function extractImageFromResults(results) {
  // This will depend on the structure of your RapidAPI response
  // Example:
  if (results && results.items && results.items.length > 0 && results.items[0].image) {
    return results.items[0].image.url;
  }
  return null;
}