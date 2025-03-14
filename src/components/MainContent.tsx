import { useRef } from 'react';
import { ListArea } from './ListArea';
import { ListSidebar } from './ListSidebar.tsx';

// Main Slack Clone Component
export function MainContent() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="flex flex-1 overflow-hidden">
      <ListSidebar />

      <div className="flex-grow flex flex-col bg-white overflow-hidden">
        <ListArea />
      </div>
    </div>
  );

};