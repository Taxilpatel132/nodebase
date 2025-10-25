import { SidebarTrigger } from "./ui/sidebar";

export const AppHeader = () => {
    return (
        <header className="flex h-14 px-4 shrink-0 items-center gap-2  border-b bg-background">
            <SidebarTrigger />
        </header>
    );
}