const currencyConverter = async (selected = null, amount, currency=null) => {
  // if (!selected || !selected.currencies) {
  //   // fallback → just return INR price
  //   return Number(Number(amount).toFixed(2));
  // }

  try {
    const res = await fetch(
      "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/inr.json"
    );
    const data = await res.json();

    
    const targetKey = currency?currency.toLowerCase():Object.keys(selected.currencies)[0]?.toLowerCase();
   
    const rate = data.inr?.[targetKey];


    if (!rate) {
      // if rate not found → return INR price
       return Number(Number(amount).toFixed(2));
    }
    
    return Number((amount * rate).toFixed(2));
  } catch (error) {
    console.error("Currency API error:", error);
     return Number(Number(amount).toFixed(2)); // fallback to INR
  }
};

export default currencyConverter;