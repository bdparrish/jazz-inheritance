import { DraftItem, Item } from "../schema";

export default function ItemInput({ item, onSend }: { item: Item | DraftItem, onSend?: () => void }) {
  return (
    <div className="text-black px-4 py-3 border-t flex-shrink-0">
      <div className="flex items-center bg-gray-100 rounded-lg p-1">
        <div className="flex-1">
          <input
            type="text"
            placeholder={`item...`}
            className="w-full bg-transparent px-3 py-2 focus:outline-none"
            value={item.content}
            onChange={(e) => (item.content = e.target.value)}
          />
        </div>
        {onSend && (
          <button
            className="bg-indigo-600 text-white rounded px-4 py-2 ml-2 hover:bg-indigo-700"
            onClick={onSend}
          >
            Send
          </button>
        )}
      </div>
    </div>
  )
}