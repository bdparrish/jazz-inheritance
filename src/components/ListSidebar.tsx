import {
  PlusIcon,
} from "lucide-react";
import { useState } from "react";
import { createInviteLink, useAccount } from "jazz-react";
import { List } from "../schema";
import { ID } from "jazz-tools";
import { CreateList } from "./CreateList";

export function ListSidebar() {
  const { me } = useAccount({
    root: {
      lists: [{}]
    },
  });

  const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);

  if (!me?.root?.lists) {
    console.debug("ListSidebar - lists are not set")
    return
  }

  const setCurrentList = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const foundList = me?.root?.lists.find((list: List) => {
      if (list.id == e?.currentTarget.dataset.id) {
        return list
      }
    })

    if (foundList) {
      me!.root!.currentList = foundList
    }
  }

  const createInvite = () => {
    const inviteLink = createInviteLink(me.root.currentList!, "writer")
    navigator.clipboard.writeText(inviteLink)
  }

  return (
    <div className="w-64 bg-indigo-900 text-white flex-shrink-0 overflow-y-auto">
      <div className="px-4 py-2 flex justify-between items-center border-b border-indigo-800">
        <h2 className="font-bold">Lists</h2>
        <button className="text-indigo-400 hover:text-white" onClick={() => setIsChannelModalOpen(true)}>
          <PlusIcon />
        </button>
        <CreateList isOpen={isChannelModalOpen} close={() => setIsChannelModalOpen(false)} />
      </div>

      {/* Lists */}
      <div className="px-2">
        {me.root.lists.length > 0 ? (
          me.root.lists.map((list) =>
            list ? (
              <div key={list.id}>
                <ListButton
                  name={list.name}
                  isActive={list.id == me!.root!.currentList!.id}
                  id={list.id}
                  onClick={setCurrentList}
                />
                <span>{list._owner.members.length}</span>
                {me.canAdmin(list) ? (
                  <button
                    className="w-full flex items-center justify-center bg-indigo-600 text-white rounded-md px-3 py-2 hover:bg-indigo-700 transition-colors"
                    onClick={createInvite}
                  >
                    Invite
                  </button>
                ) : null
                }
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

const ListButton = ({ name, isActive, id, onClick }: { name: string, isActive: boolean, id: ID<List>, onClick: (e: React.MouseEvent<HTMLButtonElement>) => void }) => (
  <button
    className={`flex items-center px-2 py-1 my-1 rounded ${isActive ? 'text-white bg-indigo-600' : 'text-indigo-300'} channel-hover`}
    data-id={id}
    onClick={onClick}
  >
    {name}
  </button>
);