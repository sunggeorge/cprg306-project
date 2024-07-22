import Link from "next/link";


export default function Item({id, name, quantity, category, onSelect}){

    return(

        <div onClick={onSelect}>
        <li key={id} 
            className="p-2 m-4 bg-slate-900 text-yellow-400 max-w-sm hover:bg-teal-400 cursor-pointer">
            <p className="text-xl font-bold">{name}</p>
            <p className="text-sm">Buy {quantity} in {category}</p>
        </li>
        </div>
    );
}