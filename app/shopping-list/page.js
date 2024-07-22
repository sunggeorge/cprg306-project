"use client";
import { useState, useEffect } from "react";
import { getItems, addItem } from "../_services/shopping-list-service.js";
import NewItem from "./new-item.js";
import ItemList from "./item-list.js";
//import itemsData from "./items.json";
import MealIdeas from "./meal-ideas.js";
import { useUserAuth } from "../_utils/auth-context";
import { redirect } from 'next/navigation'

export default function Page() {

  const [itemList, setItemList] = useState([]);
  const [selectedItemName, setSelectedItemName] = useState("");
  const { user, gitHubSignIn, firebaseSignOut } = useUserAuth();

  const loadItems = async () => {
    console.log("Loading items...");
    console.log(user);
    const items = await getItems(user.uid);
    setItemList(items);
  }

  useEffect(() => {
    if (!user) {
        redirect('/week-10/')
    } else {
        loadItems();
    }
    }, [user]);

  //Update the handleAddItem function to call the addItem function to add the item to the shopping list. Use user.uid as the userId parameter. Use the id returned from addItem to set the id of the new item. Use setItems to set the state of items to include the new item.
  async function handleAddItem(newItem) {
    // setItemList([...itemList, newItem]);
    try {
      const id = await addItem(user.uid, newItem);
      newItem.id = id;
      setItemList((prevItemList) => [...prevItemList, newItem]);
    } catch (error) {
        console.error("Failed to add new item:", error);
    }
  }

  function handleSelect(item) {
    let temp = item.name;
    temp = temp.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
    temp = temp.split(',')[0].trim();
    setSelectedItemName(temp);
  }

  return (

    <main className="bg-slate-950 p-2 m-2 flex">
        <div className="p-2 m-2">
            {user ? (
                <button className="border p-2 border-yellow-500" onClick={firebaseSignOut}>Sign Out</button>
            ) : (
                <button className="border p-2 border-yellow-500" onClick={gitHubSignIn}>Sign In with GitHub</button>
            )}
        </div>

        <div className="max-w-sm w-full">
            <h2 className="text-3xl font-bold mb-4">Shopping List</h2>
            <h3 className="text-xl font-bold">Add New Item</h3>
            <NewItem addItem={handleAddItem} />
            <ItemList items={itemList} onItemSelect={handleSelect} />
        </div>
        <div className="max-w-sm w-full">
            <MealIdeas ingredient={selectedItemName} />
        </div>
    </main>
  );
}