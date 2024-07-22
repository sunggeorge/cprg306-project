// import { collection, getDocs, addDoc, query } from "firebase/firestore";
import { collection, getDocs, addDoc, query } from 'firebase/firestore/lite';
import { db } from "../_utils/firebase";

//Add the getItems function
//This async function retrieves all items for a specific user from Firestore. 
//It takes a userId as a parameter, and uses it to query a subcollection named items under a document in the users collection with the same userId. 
//It fetches the documents in the items subcollection, and for each document, it adds an object to the items array containing the document ID and data. It then returns this items array.
export async function getItems(userId) {
    console.log('getItems called');
    console.log(db); 
    const items = [];
    const q = query(collection(db, `users/${userId}/items`));
    console.log('ready to load:');
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot);
    querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
    });
    return items;
}

// Add the addItem function
// This function adds a new item to a specific user's list of items in Firestore. 
// It takes a userId and an item as parameters. It uses the userId to reference the items subcollection of a document in the users collection, 
// and then adds the item to this subcollection. It returns the id of the newly created document.
export async function addItem(userId, item) {
    const docRef = await addDoc(collection(db, `users/${userId}/items`), item);
    return docRef.id;
}