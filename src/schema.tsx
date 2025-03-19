import { Account, CoList, CoMap, Group, co } from "jazz-tools";

export class Item extends CoMap {
    content = co.string;
}

export class DraftItem extends CoMap {
    content = co.optional.string;

    validate() {
        const errors: string[] = [];

        if (!this.content) {
            errors.push("Please enter content.");
        }

        return {
            errors,
        };
    }
}

export class ListOfItems extends CoList.Of(co.ref(Item)) { }

export class List extends CoMap {
    name = co.string;
    items = co.ref(ListOfItems)
}

export class DraftList extends CoMap {
    name = co.optional.string
    items = co.optional.ref(ListOfItems)

    validate() {
        const errors: string[] = [];

        if (!this.name) {
            errors.push("Please enter a name.");
        }

        return {
            errors,
        };
    }
}

export class ListOfLists extends CoList.Of(co.ref(List)) { }

export class LoopAccountRoot extends CoMap {
    lists = co.ref(ListOfLists);
    draftList = co.ref(DraftList);
    draftItem = co.ref(DraftItem)
    currentList = co.optional.ref(List)
}

export class LoopAccount extends Account {
    root = co.ref(LoopAccountRoot);

    async migrate() {
        const meGroup = Group.create({ owner: this })

        if (!this._refs.root) {
            this.root = LoopAccountRoot.create(
                {
                    draftList: DraftList.create(
                        {},
                        { owner: meGroup }
                    ),
                    draftItem: DraftItem.create(
                        {
                            content: '',
                        },
                        { owner: meGroup }
                    ),
                    lists: ListOfLists.create([], { owner: meGroup })
                },
                { owner: meGroup },
            );
        }
    }
}