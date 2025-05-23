import { useEffect, useRef } from 'react';
import { useAccount } from 'jazz-react';
import { ListSidebar } from './ListSidebar';

export function MainContent() {
  const { me } = useAccount({
    resolve: {
      root: {
        currentList: {}
      },
    }
  });

  const containerRef = useRef<HTMLDivElement>(null);

  // Add effect to update UI when current direct task changes
  useEffect(() => {
    if (me?.root?.currentItem) {
      console.debug("Current Item changed:", me.root.currentItem.name);
    }
  }, [me?.root?.currentItem?.id]);

  return (
    <div ref={containerRef} className="flex flex-1 overflow-hidden">
      <div className="block w-64 bg-indigo-900 text-white flex-shrink-0 overflow-y-auto">
        <ListSidebar />
      </div>
    </div>
  );
};