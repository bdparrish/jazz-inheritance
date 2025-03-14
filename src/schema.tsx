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
    draftItem = co.ref(DraftItem)
    currentItem = co.ref(Item)
}

export class DraftList extends CoMap {
    name = co.optional.string
    items = co.optional.ref(ListOfItems)
    draftItem = co.optional.ref(DraftItem)
    currentItem = co.optional.ref(Item)

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
    currentList = co.optional.ref(List)
}

export class LoopAccount extends Account {
    root = co.ref(LoopAccountRoot);

    async migrate() {
        if (!this._refs.root) {
            this.root = LoopAccountRoot.create(
                {
                    draftList: DraftList.create(
                        {},
                        {
                            owner: Group.create({ owner: this }),
                        }
                    ),
                    lists: ListOfLists.create([])
                },
                { owner: this },
            );
        }
    }
}