import DOMPurify from 'dompurify';

export default function ItemRow({ content }: { content: string }) {
  const sanitizedHTML = DOMPurify.sanitize(content);

  return (
    <div className="flex items-start rounded message-hover">
      <div className="w-full">
        <div className="flex rounded hover:bg-gray-100 mt-0">
          <p className="flex-1 pr-4" dangerouslySetInnerHTML={{ __html: sanitizedHTML }}></p>
        </div>
      </div>
    </div>
  )
}