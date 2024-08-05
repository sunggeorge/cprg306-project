"use client";
import { useState } from "react";

const SearchBar = ({ onSearch, clearSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleReset = (e) => {
    e.preventDefault();
    setQuery("");
    clearSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        placeholder="Search for recipes..."
        required
      />
      <button
        type="submit"
        className="inline-flex items-center ml-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Search
      </button>
      <button
        onClick={handleReset}
        className="inline-flex items-center ml-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Reset
      </button>      
    </form>
  );
};

export default SearchBar;
