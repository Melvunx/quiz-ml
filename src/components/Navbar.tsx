import { ModeToggle } from "./ui/mode-toggle";

export const Navbar = () => {
  return (
    <>
      <nav className="flex items-center justify-evenly gap-3 py-4">
        <h1>Quiz creator</h1>
        <ModeToggle />
      </nav>
    </>
  );
};
