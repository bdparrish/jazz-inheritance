import { useAccount } from "jazz-react";
import { useState, useRef, useEffect } from "react";
import { Group } from "jazz-tools";
import { BaseAccount, Item, ListOfItems } from "../schema";
import { XIcon, SearchIcon } from "lucide-react";

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

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
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

  // Get workspace members from the current workspace
  const workspaceGroup = me.root.currentList._owner as Group;
  const workspaceMembers = workspaceGroup.members
    .filter(member => member.account?.profile?.name && member.account.id !== me.id)
    .map(member => ({
      id: member.account!.id,
      name: member.account!.profile!.name,
      account: member.account as BaseAccount
    }));

  // Filter members based on search query
  const filteredMembers = searchQuery.trim()
    ? workspaceMembers.filter(member =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : workspaceMembers;

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );

    setSearchQuery('')
  };

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
            <p className="mt-1 text-xs text-gray-500">
              Leave blank to use participant names
            </p>
          </div>

          {/* People search */}
          <div id="user-search" className="mb-4">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              To:
            </label>
            <div className="relative">
              <div className="flex flex-wrap items-center border border-gray-300 rounded-md p-2 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
                {selectedUsers.map(userId => {
                  const user = workspaceMembers.find(m => m.id === userId);
                  return user ? (
                    <div key={userId} className="flex items-center bg-indigo-100 text-indigo-800 rounded-full px-3 py-1 text-sm mr-2 mb-1">
                      {user.name}
                      <button
                        className="ml-1 text-indigo-500 hover:text-indigo-700"
                        onClick={() => toggleUserSelection(userId)}
                      >
                        ×
                      </button>
                    </div>
                  ) : null;
                })}
                <input
                  ref={searchInputRef}
                  type="text"
                  id="search"
                  placeholder={selectedUsers.length > 0 ? "" : "Search by name"}
                  className="flex-grow px-2 py-1 outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="absolute right-3 top-3 text-gray-400">
                <SearchIcon size={18} />
              </div>
            </div>
          </div>

          {/* User List */}
          <div id="user-list" className="max-h-60 overflow-y-auto border border-gray-200 rounded-md">
            {filteredMembers.length > 0 ? (
              filteredMembers.map(member => (
                <div
                  key={member.id}
                  className={`flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer ${selectedUsers.includes(member.id) ? 'bg-gray-100' : ''
                    }`}
                  onClick={() => toggleUserSelection(member.id)}
                >
                  <div className="flex-shrink-0">
                    <img src="https://avatar.iran.liara.run/public" alt={member.name} className="h-8 w-8 rounded-full" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{member.name}</p>
                  </div>
                  {selectedUsers.includes(member.id) && (
                    <div className="ml-auto">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500 text-center">
                No members found
              </div>
            )}
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
              disabled={selectedUsers.length === 0}
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