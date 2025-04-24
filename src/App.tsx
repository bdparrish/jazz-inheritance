import { useAccount } from "jazz-react";
import { MainContent } from './components/MainContent';
import { useState } from "react";
import { CreateList } from "./components/CreateList";
import { NavigationBar } from "./components/NavigationBar";

export function App() {
    const { me } = useAccount({
        resolve: {
            root: { 
                lists: {
                    $each: true
                } 
            },
        }
    });

    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!me?.root?.lists) return

    if (me.root.lists.length == 0) {
        return (
            <div className="flex justify-center items-center h-screen">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex-shrink-0 px-4 py-3 text-indigo-300 hover:bg-indigo-700 focus:outline-none"
                >
                    + Add list
                </button>
                <CreateList isOpen={isModalOpen} close={() => setIsModalOpen(false)} />
            </div>
        )
    }

    if (!me?.root?.lists) return

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-gray-100">
            <NavigationBar />

            <MainContent />
        </div>
    )
}
