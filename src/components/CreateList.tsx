import { useAccount } from "jazz-react";
import { Item, List, ListOfItems } from "../schema";
import { Group } from "jazz-tools";
import { useState } from "react";
import { ListForm } from "./ListForm";

export function CreateList({ isOpen, close }: { isOpen: boolean, close: () => void }) {
  const { me } = useAccount({
    resolve: {
      root: {
        lists: {
          $each: true
        }
      },
    }
  });

  const [errors, setErrors] = useState<string[]>([]);

  if (!me?.root?.lists) return;

  if (!isOpen) return null;

  const onSave = (name: string) => {
    const listGroup = Group.create({ owner: me })

    const list = List.create({
      name,
      items: ListOfItems.create([], listGroup)
    }, { owner: listGroup })

    const item = Item.create(
      {
        name: 'todo',
      },
      { owner: listGroup }
    )

    list.items = ListOfItems.create([list], { owner: listGroup })

    me.root!.lists!.push(list)
    me.root!.currentList = list
    me.root!.currentItem = item
  };

  return (
    <>
      <CreateListForm
        onSave={onSave}
        close={close}
        errors={errors}
      />
    </>
  );

}

function CreateListForm({ onSave, close, errors }: { onSave: (name: string) => void, close: () => void, errors: string[] }) {
  const addList = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave("test");
  };

  return <ListForm onSave={addList} onClose={close} errors={errors} />;
}