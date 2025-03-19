import { useAccount, useCoState } from "jazz-react";
import { DraftItem, DraftList, List, ListOfItems } from "../schema";
import { Group, ID } from "jazz-tools";
import { useState } from "react";
import { ListForm } from "./ListForm";
import { Errors } from "./Errors";

export function CreateList({ isOpen, close }: { isOpen: boolean, close: () => void }) {
  const { me } = useAccount({
    root: { draftList: {} },
  });

  const [errors, setErrors] = useState<string[]>([]);

  if (!me?.root?.draftList) {
    console.debug("CreateList - draftList is not set")
    return
  }

  if (!isOpen) return null

  const onSave = (draft: DraftList) => {
    const validation = draft.validate();
    setErrors(validation.errors);
    if (validation.errors.length > 0) {
      return;
    }

    const draftGroup = draft._owner as Group
    const itemsGroup = Group.create({ owner: me })
    itemsGroup.extend(draftGroup)

    const meGroup = Group.create({ owner: me })

    draft.items = ListOfItems.create([], { owner: itemsGroup })

    me!.root!.lists!.push(draft as List)
    me!.root!.currentList = draft as List
    me!.root!.draftList = DraftList.create(
      {
        name: ''
      },
      { owner: meGroup },
    )
    me.root.draftItem = DraftItem.create(
      {
        content: ''
      },
      { owner: meGroup },
    )

    close()
  };

  return (
    <>
      {errors && <Errors errors={errors} />}
      <CreateChannelForm
        id={me?.root?.draftList?.id}
        onSave={onSave}
        close={close}
        errors={errors}
      />
    </>
  );

}

function CreateChannelForm({ id, onSave, close, errors }: { id: ID<DraftList>, onSave: (draft: DraftList) => void, close: () => void, errors: string[] }) {
  const draft = useCoState(DraftList, id);

  if (!draft) return

  const addChannel = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(draft);
  };

  return <ListForm list={draft} onSave={addChannel} onClose={close} errors={errors} />;
}