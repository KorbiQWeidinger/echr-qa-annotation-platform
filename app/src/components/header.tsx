import { useLogin } from "@/contexts/login";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";

export const Header = () => {
  const { logout } = useLogin();

  return (
    <header className="sticky top-0 flex h-16 min-h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      <h1 className="text-xl font-semibold">ECHR-QA Annotation Platform</h1>
      <div className="flex items-center gap-4">
        <ModeToggle />
        <Button onClick={logout}>Log Out</Button>
      </div>
    </header>
  );
};
