import { useAccount, useCoState } from 'jazz-react';
import { co, Group, ID } from 'jazz-tools';
import { DraftItem, Item } from '../schema';
import ItemRow from "./ItemRow";
import ItemInput from "./ItemInput";

// Message Area Component to show all channel content
export function ListArea() {
  const { me } = useAccount({
    root: {
      currentList: {
        items: [{}],
        draftItem: {}
      }
    },
  });

  if (!me?.root?.currentList?.items) return

  const sendItem = (draft: DraftItem) => {
    const validation = draft.validate()
    if (validation.errors.length > 0) {
      return;
    }

    const listGroup = me.root.currentList?._owner as Group
    const group = Group.create()
    group.extend(listGroup)

    me.root.currentList!.items!.push(draft as Item)

    me.root.currentList!.draftItem = DraftItem.create(
      {
        content: ''
      },
      { owner: group },
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Item List */}
      <div className="flex-1 overflow-y-auto px-6 py-4" style={{ maxHeight: "calc(100vh - 220px)" }}>
        {me.root.currentList.items.length > 0 ? (
          me.root.currentList.items.map((item: co<Item | null>) => {
            if (!item) return null;

            return item ? (
              <ItemRow
                key={item.id}
                content={item.content}
              />
            ) : null
          })
        ) : (
          null
        )}
      </div>

      {/* Message Input */}
      <CreateItemInput id={me.root.currentList.draftItem!.id} onSave={sendItem} />
    </div>
  );

};

function CreateItemInput({ id, onSave }: { id: ID<DraftItem>, onSave: (draft: DraftItem) => void }) {
  const draft = useCoState(DraftItem, id, {});

  if (!draft) return;

  const sendMessage = () => {
    onSave(draft);
  };

  return <ItemInput item={draft} onSend={sendMessage} />;
}