import { Account, CoList, CoMap, Group, co } from "jazz-tools";

export class Item extends CoMap {
    name = co.string;
}

export class ListOfItems extends CoList.Of(co.ref(Item)) { }

export class List extends CoMap {
    name = co.string;
    items = co.ref(ListOfItems)
}

export class ListOfLists extends CoList.Of(co.ref(List)) { }

export class BaseAccountRoot extends CoMap {
    lists = co.ref(ListOfLists);
    currentList = co.optional.ref(List)
    currentItem = co.optional.ref(Item)
}

export class BaseAccount extends Account {
    root = co.ref(BaseAccountRoot);

    async migrate(this: BaseAccount) {
        const meGroup = Group.create({ owner: this })

        if (this.root === undefined) {
            this.root = BaseAccountRoot.create(
                {
                    lists: ListOfLists.create([], meGroup)
                },
                meGroup,
            );
        }
    }
}