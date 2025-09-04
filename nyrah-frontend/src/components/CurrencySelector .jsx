import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrency } from "../redux/slices/currencySlice";

const CurrencySelector = ({ onSelect}) => {
  const [countries, setCountries] = useState([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const dispatch = useDispatch();

  // Allowed countries (PayPal supported + India)
  const allowedCountries = ["US", "GB", "CA", "AU", "JP", "DE", "FR", "IT", "ES", "IN"];

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=cca2,flags,currencies"
        );
        const data = await res.json();

        // Filter only allowed countries
        const filtered = data.filter((c) =>
          allowedCountries.includes(c.cca2)
        );

        const sorted = filtered.sort((a, b) =>
          a.cca2.localeCompare(b.cca2)
        );

        setCountries(sorted);

        // Set India as default
        const india = sorted.find((c) => c.cca2 === "IN");
        if (india) {
          dispatch(setCurrency(india))
          setSelected((india))
          if (onSelect) onSelect(india);
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, [onSelect]);

  const handleSelect = (country) => {
    setSelected(country);
    dispatch(setCurrency(country))
    setOpen(false);
    if (onSelect) onSelect(country);
  };

  return (
    <div
      className="relative "
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Selected value */}
      <div className="flex items-center justify-center p-1 cursor-pointer ">
        {selected &&
          <div className="flex items-center gap-2">
            <img
              src={selected.flags.png}
              alt={selected.cca2}
              className="w-6 h-4"
            />
            <span className="font-medium text-[.8rem]">{selected.cca2}</span>
          </div>}
        
        {selected && <span className="ml-1">▾</span>}
      </div>

      {/* Dropdown list */}
      {open && (
        <div className="absolute top-full left-0 w-full  bg-white  z-10">
          {countries.map((country) => (
            <div
              key={country.cca2}
              onClick={() => handleSelect(country)}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
            >
              <img
                src={country.flags.png}
                alt={country.cca2}
                className="w-6 h-4"
              />
              <span className="font-medium text-[.8rem]">{country.cca2}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


export default CurrencySelector;
