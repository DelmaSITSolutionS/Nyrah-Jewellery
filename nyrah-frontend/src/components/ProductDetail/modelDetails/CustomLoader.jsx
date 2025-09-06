import React from "react";

function CustomLoader() {
  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <div className="rounded-none px-3 py-2 w-14 h-10 skeleton"></div>
        <div className="rounded-none px-3 py-2 w-14 h-10 skeleton"></div>
        <div className="rounded-none px-3 py-2 w-14 h-10 skeleton"></div>
      </div>
      <div className="flex gap-3">
        <div className="w-12 h-12 rounded-full skeleton"></div>
        <div className="w-12 h-12 rounded-full skeleton"></div>
        <div className="w-12 h-12 rounded-full skeleton"></div>
        <div className="w-12 h-12 rounded-full skeleton"></div>
        <div className="w-12 h-12 rounded-full skeleton"></div>
        <div className="w-12 h-12 rounded-full skeleton"></div>
      </div>
      <div className="flex gap-3">
        <div className="rounded-none px-3 py-2 w-20 h-10 skeleton"></div>
        <div className="rounded-none px-3 py-2 w-20 h-10 skeleton"></div>
      </div>
    </div>
  );
}

export default CustomLoader;
