export default function ItemRow({ content }: { content: string }) {

  return (
    <div className="flex items-start rounded message-hover">
      <div className="w-full">
        <div className="flex rounded hover:bg-gray-100 mt-0">
          <p className="flex-1 pr-4">{content}</p>
        </div>
      </div>
    </div>
  )
}