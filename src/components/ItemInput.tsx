import { KeyboardEvent, useCallback, useEffect } from "react";
import {
  AtSignIcon,
  BoldIcon,
  CodeIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  PaperclipIcon,
  Redo2Icon,
  SmileIcon,
  StrikethroughIcon,
  Undo2Icon,
} from "lucide-react";
import { Item, DraftItem } from "../schema"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Mention from '@tiptap/extension-mention'
import HardBreak from '@tiptap/extension-hard-break'
import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from 'prosemirror-state'
import './tip-tap.css'

export default function ItemInput({ item, onSend }: { item: Item | DraftItem, onSend?: () => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      HardBreak,
      NoNewLine,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: 'Type your message...',
      }),
      Mention.configure({
        HTMLAttributes: {
          class: 'mention',
        },
      }),
    ],
    content: item.content || '',
    onUpdate: ({ editor }) => {
      if (item) {
        item.content = editor.getHTML();
      }
    },
  });

  // Update the editor content when message.content changes from elsewhere
  useEffect(() => {
    if (editor && item.content !== editor.getHTML()) {
      editor.commands.setContent(item.content || '');
    }
  }, [item.content, editor]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Check if Enter key was pressed without Shift and onSend exists
    if (e.key === 'Enter' && !e.shiftKey && onSend) {
      e.preventDefault();
      onSend();
    }
  }, [onSend]);

  // Add the keydown handler to the editor
  useEffect(() => {
    if (editor) {
      const element = editor.view.dom;
      element.addEventListener('keydown', handleKeyDown as any);
      return () => {
        element.removeEventListener('keydown', handleKeyDown as any);
      };
    }
  }, [editor, handleKeyDown]);

  if (!editor) {
    return null;
  }

  return (
    <div className="text-black px-4 py-3 border-t flex-shrink-0">
      <div className="flex flex-col bg-gray-100 rounded-lg p-1">
        <div className="flex items-center mb-1 border-b pb-1">
          <FormatButton
            icon={<BoldIcon size={18} />}
            isActive={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
          />
          <FormatButton
            icon={<ItalicIcon size={18} />}
            isActive={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          />
          <FormatButton
            icon={<StrikethroughIcon size={18} />}
            isActive={editor.isActive('strike')}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          />
          <FormatButton
            icon={<CodeIcon size={18} />}
            isActive={editor.isActive('code')}
            onClick={() => editor.chain().focus().toggleCode().run()}
          />
          <FormatButton
            icon={<LinkIcon size={18} />}
            isActive={editor.isActive('link')}
            onClick={() => {
              const previousUrl = editor.getAttributes('link').href;
              const url = window.prompt('URL', previousUrl);

              // cancelled
              if (url === null) {
                return;
              }

              // empty
              if (url === '') {
                editor.chain().focus().extendMarkRange('link').unsetLink().run();
                return;
              }

              // update link
              editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
            }}
          />
          <div className="mx-1 h-5 border-l border-gray-300"></div>
          <FormatButton
            icon={<ListIcon size={18} />}
            isActive={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          />
          <FormatButton
            icon={<ListOrderedIcon size={18} />}
            isActive={editor.isActive('orderedList')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          />
          <div className="mx-1 h-5 border-l border-gray-300"></div>
          <FormatButton
            icon={<Undo2Icon size={18} />}
            disabled={!editor.can().chain().focus().undo().run()}
            onClick={() => editor.chain().focus().undo().run()}
          />
          <FormatButton
            icon={<Redo2Icon size={18} />}
            disabled={!editor.can().chain().focus().redo().run()}
            onClick={() => editor.chain().focus().redo().run()}
          />
        </div>

        <div className="flex-1 min-h-12 max-h-40 overflow-y-auto">
          <EditorContent
            editor={editor}
            className="w-full px-3 py-2 focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-between pt-1 border-t">
          <div className="flex">
            <FormatButton icon={<SmileIcon size={18} />} />
            <FormatButton icon={<AtSignIcon size={18} />} />
            <FormatButton icon={<PaperclipIcon size={18} />} />
          </div>
          {onSend && (
            <button
              className="bg-indigo-600 text-white rounded px-4 py-2 ml-2 hover:bg-indigo-700"
              onClick={onSend}
              disabled={!editor.getText().trim()}
            >
              Send
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Enhanced FormatButton with active state
const FormatButton = ({
  icon,
  onClick,
  isActive = false,
  disabled = false
}: {
  icon: React.ReactNode;
  onClick?: () => void;
  isActive?: boolean;
  disabled?: boolean;
}) => (
  <button
    className={`p-1 m-1 rounded ${isActive ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    onClick={onClick}
    disabled={disabled}
  >
    {icon}
  </button>
);

const NoNewLine = Extension.create({
  name: 'no_new_line',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('eventHandler'),
        props: {
          handleKeyDown: (view, event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              console.log("enter pressed")
              return true
            }
          }
          // … and many, many more.
          // Here is the full list: https://prosemirror.net/docs/ref/#view.EditorProps
        },
      }),
    ]
  },
})