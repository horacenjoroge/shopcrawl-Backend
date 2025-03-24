const mockProducts = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: 49.99,
      rating: 4.5,
      shippingCost: 5.99,
      paymentMethods: ["Credit Card", "PayPal"],
      image: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      name: "Smartphone Stand",
      price: 15.99,
      rating: 4.2,
      shippingCost: 2.99,
      paymentMethods: ["Credit Card", "Apple Pay"],
      image: "https://via.placeholder.com/150",
    },
    {
      id: 3,
      name: "Mechanical Keyboard",
      price: 79.99,
      rating: 4.8,
      shippingCost: 7.99,
      paymentMethods: ["Credit Card", "Google Pay"],
      image: "https://via.placeholder.com/150",
    },
  ];
  
  const fetchProducts = async (searchQuery) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const trimmedQuery = searchQuery.trim().toLowerCase(); // Trim whitespace & convert to lowercase
        const filteredProducts = mockProducts.filter((product) =>
          product.name.toLowerCase().includes(trimmedQuery)
        );
        resolve(filteredProducts);
      }, 1000); // Simulating network delay
    });
  };
  
module.exports = fetchProducts;
  