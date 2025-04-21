import { useAccount } from "jazz-react";
import { useState, useRef, useEffect } from "react";
import { Group } from "jazz-tools";
import { Item, ListOfItems } from "../schema";
import { XIcon } from "lucide-react";

/**
 * Component for creating a new direct task
 * Allows users to search and select workspace members to task
 */
export function CreateList({ isOpen, close }: { isOpen: boolean; close: () => void }) {
  const { me } = useAccount({
    root: {
      currentList: {
        items: []
      },
      draftItem: {},
    },
  });

  const [customName, setCustomName] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus the search input when modal opens
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  if (!me?.root?.currentList || !isOpen) return null;

  if (!me?.root?.currentList?.items) {
    const meGroup = Group.create({ owner: me })
    me.root.currentList!.items = ListOfItems.create([], { owner: meGroup })
  }

  const startItem = () => {
    const itemGroup = Group.create({ owner: me })

    const item = Item.create({
      name: 'test'
    }, { owner: itemGroup })

    me.root.currentList!.items.push(item)
    me.root.currentItem = item

    // Close the modal
    close();
  };

  return (
    <div id="create-item-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white text-black rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900">New Item</h3>
          <button
            onClick={close}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <XIcon />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-4">

          {/* Item name */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Item Name:
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter a name for this item"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={close}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={startItem}
              className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              Start Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}