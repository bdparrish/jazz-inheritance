import { useState } from "react";
import { CreateList } from "./CreateItem";
import { useAccount } from "jazz-react";
import { List } from "../schema";
import { ID } from "jazz-tools";

export function ListList() {
  const { me } = useAccount({
    root: {
      lists: [{}]
    },
  });

  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isMobileView, _] = useState(window.innerWidth < 768);

  if (!me?.root?.lists) return null;

  const setCurrentList = (e: React.MouseEvent<HTMLButtonElement>): void => {
    me.root!.currentList = me.root!.lists!.find((list: List) => {
      if (list.id == e?.currentTarget.dataset.id) {
        return list
      }
    })
  }

  return (
    <div className={`${isMobileView ? 'flex-col' : 'flex overflow-x-auto scrollbar-hide'}`}>
      <div className={`flex-shrink-0 bg-indigo-900 ${isMobileView ? 'py-2 px-4' : 'px-4 py-3'} font-bold`}>
        Lists
      </div>

      <div className={`${isMobileView ? 'mt-2' : 'flex'}`}>
        {me.root.lists.length > 0 ? (
          me.root.lists.map((list) =>
            list ? (
              <ListButton
                key={list.id}
                name={list.name}
                isActive={list.id == me!.root!.currentList!.id}
                id={list.id}
                onClick={setCurrentList}
              />
            ) : null,
          )
        ) : (
          null
        )}
        <button
          onClick={() => setIsListModalOpen(true)}
          className={`${isMobileView
            ? 'w-full text-left px-4 py-2 mt-2 rounded text-indigo-300 hover:bg-indigo-700'
            : 'flex-shrink-0 px-4 py-3 text-indigo-300 hover:bg-indigo-700'}`}
        >
          + Add list
        </button>
        <CreateList isOpen={isListModalOpen} close={() => setIsListModalOpen(false)} />
      </div>
    </div>
  )
}

// Helper Components
const ListButton = ({
  name,
  isActive,
  id,
  onClick
}: {
  name: string,
  isActive: boolean,
  id: ID<List>,
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void,
}) => (
  <button
    className={`flex-shrink-0 px-4 py-3 hover:bg-indigo-700 ${isActive ? 'font-medium border-b-2 border-white' : ''}`}
    data-id={id}
    onClick={onClick}
  >
    {name}
  </button>
);