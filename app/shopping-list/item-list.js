"use client";
import Item from "./item.js";
import { useState } from "react";

export default function ItemList({items, onItemSelect}) {

  const [sortBy, setSortBy] = useState("name");

    const products = [...items].sort((a, b) => {
      if (sortBy === 'name') {
        return (a.name.localeCompare(b.name) || a.category.localeCompare(b.category));
      } else if (sortBy === 'category') {
        return (a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
      }

      return 0;
    });

  const clickEvent = (e) => {

    setSortBy(e.target.name)
  
  }

  return (
    <div className="mt-8">
    <label htmlFor="sort">Sort by:</label>
    <button name="name"
      className= {sortBy == 'name' ? 'week-5-active' : 'week-5-inactive'}
      onClick={clickEvent}>Name</button>
    <button name="category" 
      className= {sortBy == 'category' ? 'week-5-active' : 'week-5-inactive'}
      onClick={clickEvent}>Category</button>

      <ul>

        {products.map((item) => ( 
          <Item
            key={item.id} // No warning challenge
            id={item.id}
            name={item.name}
            quantity={item.quantity}
            category={item.category}
            onSelect={() => onItemSelect(item)}
          />
        ))}

      </ul>
    </div>

  );
}
