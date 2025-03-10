import useAuth from "@/hooks/use-auth";
import ErrorPage from "@/pages/ErrorPage";
import useAuthStore from "@/store/auth";
import clsx from "clsx";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ModeToggle } from "../ModeToggle";
import { Button, buttonVariants } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import LoadingString from "../ui/loading-string";
import Logo from "./Logo";

const CreateDropdownMenu = ({ disabled }: { disabled?: boolean }) => {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={disabled} asChild>
        <Button type="button" variant={disabled ? "default" : "secondary"}>
          Créer..
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="font-regular-funnel-display">
        <DropdownMenuLabel>Un quiz ou une question</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              setTimeout(() => navigate("/add-quizzes"), 250);
            }}
          >
            Quiz
            <DropdownMenuShortcut className="light:bg-slate-200 light:border-black rounded-full border p-1 italic">
              ctrl q
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setTimeout(() => navigate("/add-questions"), 250);
            }}
          >
            Question
            <DropdownMenuShortcut className="light:bg-slate-200 light:border-black rounded-full border p-1 italic">
              ctrl m
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default function Navbar() {
  const { logout } = useAuth();
  const { user, isAdmin } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  if (!user) {
    return <ErrorPage />;
  }

  return (
    <nav className="relative flex w-full items-center justify-between border-y-2 px-4 py-2 font-regular-funnel-display">
      <div className="flex text-lg font-bold">
        <Link to="/quiz-dashboard">
          <Logo classname="text-lg font-medium" />
        </Link>
      </div>
      <div className="ml-6 flex w-full max-w-lg items-center justify-between">
        <Link
          className={clsx("rounded-sm", buttonVariants({ variant: "ghost" }))}
          to="/quiz"
        >
          Quiz
        </Link>
        <Link
          className={clsx("rounded-none", buttonVariants({ variant: "ghost" }))}
          to="/quiz-questions"
        >
          Questions
        </Link>
        <Link
          className={clsx("rounded-none", buttonVariants({ variant: "ghost" }))}
          to="/quiz-results"
        >
          Résultas
        </Link>
        <Link
          className={clsx("rounded-none", buttonVariants({ variant: "ghost" }))}
          to="/quiz-start"
        >
          Quizer !
        </Link>
        <CreateDropdownMenu disabled={!isAdmin} />
      </div>
      <div className="flex w-full max-w-md items-center justify-evenly">
        <ModeToggle />
        <h1 className="font-regular-m-plus italic">{user.username}</h1>
        <Button
          variant="destructive"
          type="button"
          onClick={async () => {
            setIsLoading(true);
            await logout();
            setIsLoading(false);
          }}
        >
          {isLoading ? <LoadingString word="Déconnexion" /> : "Se déconnecter"}
        </Button>
      </div>
    </nav>
  );
}
