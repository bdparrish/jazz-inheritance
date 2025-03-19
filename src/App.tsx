import { useAccount } from "jazz-react";
import { MainContent } from './components/MainContent';

export function App() {
    const { me } = useAccount({
        root: { lists: [{}] },
    });

    if (!me?.root?.lists) {
        console.debug("App - lists are not set")
        return
    }

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-gray-100">
            <MainContent />
        </div>
    )
}
