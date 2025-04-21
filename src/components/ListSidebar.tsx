import {
  PlusIcon,
} from "lucide-react";
import { useState } from "react";
import { useAccount } from "jazz-react";
import { Item } from "../schema";
import { ID } from "jazz-tools";
import { CreateList } from "./CreateItem";

export function ListSidebar() {
  const { me } = useAccount({
    root: {
      lists: [{
        items: []
      }]
    },
  });

  const [isItemModalOpen, setIsItemModalOpen] = useState(false);

  if (!me?.root?.currentList?.items) {
    return
  }

  const setCurrentItem = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const foundItem = me.root.currentList!.items!.find((item: Item) => {
      if (item.id == e?.currentTarget.dataset.id) {
        return item
      }
    })

    if (foundItem) {
      me!.root!.currentItem = foundItem
    }
  }

  return (
    <div className="w-64 bg-indigo-900 text-white flex-shrink-0 overflow-y-auto">
      <div className="px-4 py-2 flex justify-between items-center border-b border-indigo-800">
        <h2 className="font-bold">Items</h2>
        <button className="text-indigo-400 hover:text-white" onClick={() => setIsItemModalOpen(true)}>
          <PlusIcon />
        </button>
        <CreateList isOpen={isItemModalOpen} close={() => setIsItemModalOpen(false)} />
      </div>

      {/* Lists */}
      <div className="px-2">
        {me.root.currentList!.items!.length > 0 ? (
          me.root.currentList!.items!.map((item) =>
            item ? (
              <div key={item.id}>
                <ItemButton
                  item={item}
                  isActive={me.root.currentItem! && item.id == me.root.currentItem.id}
                  id={item.id}
                  onClick={setCurrentItem}
                />
              </div>
            ) : null,
          )
        ) : (
          null
        )}
      </div>
    </div>
  );
};

const ItemButton = ({ item, isActive, id, onClick }: { item: Item, isActive: boolean, id: ID<Item>, onClick: (e: React.MouseEvent<HTMLButtonElement>) => void }) => (
  <button
    className={`flex items-center px-2 py-1 my-1 rounded ${isActive ? 'text-white bg-indigo-600' : 'text-indigo-300'} item-hover`}
    data-id={id}
    onClick={onClick}
  >
    {item.name} {"(" + item._owner.members.length + " members)"}
  </button>
);