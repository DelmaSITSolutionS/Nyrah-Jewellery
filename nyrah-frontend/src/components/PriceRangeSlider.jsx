import React from "react";
import { Range } from "react-range";

const MIN = 0;
const MAX = 100000;

export default function PriceRangeSlider({ priceRange, setPriceRange }) {
  return (
    <div className="w-full flex flex-col gap-4">

      {/* Range Slider */}
      <Range
        step={500}
        min={MIN}
        max={MAX}
        
        values={priceRange}
        onChange={(values) => setPriceRange(values)}
        renderTrack={({ props, children }) => {
          const [minVal, maxVal] = priceRange;
          const left = `${(minVal / MAX) * 100}%`;
          const width = `${((maxVal - minVal) / MAX) * 100}%`;

          return (
            <div
              {...props}
              style={{
                ...props.style,
                height: "3px",
                width: "95%",
                background: "#E5E7EB", // light gray
                borderRadius: "4px",
                position: "relative",
                margin:"0px .4rem",
                touchAction:"none"
              }}
            >
              {/* Colored fill between thumbs */}
              <div
                style={{
                  position: "absolute",
                  height: "3px",
                  left,
                  width,
                  backgroundColor: "#D98324", // your primary brand color
                  borderRadius: "4px",
                }}
              />
              {children}
            </div>
          );
        }}
        renderThumb={({ props, index }) => (
          <div
            {...props}
            key={index}
            style={{
              ...props.style,
              height: "15px",
              width: "15px",
              backgroundColor: "#D98324",
              borderRadius: "50%",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              touchAction:"none"
            }}
          >
          </div>
        )}
      />

      {/* Min / Max Display */}
      <div className="flex justify-between text-sm text-zinc-600">
        <span> ₹{priceRange[0].toLocaleString()}</span>
        <span> ₹{priceRange[1].toLocaleString()}</span>
      </div>
    </div>
  );
}
