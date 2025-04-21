import { useAccount, createInviteLink } from "jazz-react";
import {
  UsersIcon,
  PlusIcon,
  ChevronDownIcon,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function ListNavigationBar() {
  const { me } = useAccount({
    root: {
      lists: [{}],
      currentList: {},
    },
  });

  const [isPeopleMenuOpen, setIsPeopleMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Handle clicks outside of the menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Close the menu if the click is outside both the menu and the toggle button
      if (
        isPeopleMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsPeopleMenuOpen(false);
      }
    }

    // Add event listener when the menu is open
    if (isPeopleMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Clean up the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPeopleMenuOpen]);

  if (!me?.root?.currentList) return null;

  const togglePeopleMenu = () => {
    setIsPeopleMenuOpen(!isPeopleMenuOpen);
  };

  const createInvite = () => {
    const inviteLink = createInviteLink(me.root.currentList!, "writer")
    navigator.clipboard.writeText(inviteLink)
  }

  return (
    <div id="navbar-list-desktop" className="bg-indigo-700 px-4 py-2">
      {/* List Name - Desktop */}
      <div className="hidden md:flex items-center space-x-6">
        <a href="#" className="font-bold text-lg">{me.root.currentList.name}</a>

        {/* People Button with Dropdown */}
        <div id="list-people" className="relative">
          <button
            ref={buttonRef}
            onClick={togglePeopleMenu}
            className="hover:bg-indigo-600 px-3 py-1 rounded text-sm font-medium flex items-center"
          >
            <UsersIcon className="mr-1" /> People <ChevronDownIcon className="ml-1 h-4 w-4" />
          </button>

          {isPeopleMenuOpen && (
            <div
              id="list-people-menu"
              ref={menuRef}
              className="absolute top-10 left-0 bg-white rounded-md shadow-lg z-10 w-64 text-gray-800"
            >
              <div className="p-3 border-b border-gray-200">
                <h3 className="font-bold text-sm">People in {me.root.currentList.name}</h3>
              </div>

              <div className="max-h-64 overflow-y-auto">
                {me.root.currentList._owner.members.map((acct, index) => {
                  return acct.account?.profile?.name ?
                    <PeopleListItem
                      key={index}
                      name={acct.account!.profile!.name}
                      status=""
                    /> : null
                })}
              </div>

              <div className="p-2 border-t border-gray-200">
                <button
                  className="w-full flex items-center justify-center bg-indigo-600 text-white rounded-md px-3 py-2 hover:bg-indigo-700 transition-colors"
                  onClick={createInvite}
                >
                  <PlusIcon className="h-4 w-4 mr-2" /> Invite People
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper Components

const PeopleListItem = ({ name, status }: { name: string, status: string }) => (
  <div className="flex items-center px-4 py-2 hover:bg-gray-100">
    <img src="https://avatar.iran.liara.run/public" alt={name} className="h-8 w-8 rounded-full mr-3" />
    <div>
      <div className="font-medium">{name}</div>
      <div className="text-xs text-gray-500">{status}</div>
    </div>
  </div>
);