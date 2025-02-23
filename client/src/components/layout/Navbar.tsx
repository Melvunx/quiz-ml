import useAuth from "@/hooks/use-auth";
import ErrorPage from "@/pages/ErrorPage";
import userAuthStore from "@/store/auth";
import clsx from "clsx";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

const CreateDropdownMenu = () => {
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="secondary">
          Créer..
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Créer un quiz ou une question</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              setTimeout(() => navigate("/add-quizzes"), 250);
            }}
          >
            Quiz
            <DropdownMenuShortcut>ctrl q</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setTimeout(() => navigate("/add-questions"), 250);
            }}
          >
            Question
            <DropdownMenuShortcut>ctrl m</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default function Navbar() {
  const { logout } = useAuth();
  const { user } = userAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  if (!user) {
    return <ErrorPage />;
  }

  return (
    <nav className="flex w-full items-center justify-between border-y-2 px-4 py-2">
      <div className="flex text-lg font-bold">
        <Link to="/quiz-dashboard">
          <Logo />
        </Link>
      </div>
      <div className="flex w-1/3 items-center justify-between">
        <Link
          className={clsx("rounded-none", buttonVariants({ variant: "ghost" }))}
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
        <CreateDropdownMenu />
      </div>
      <div className="flex items-center gap-10">
        <h1 className="italic">{user.username}</h1>
        <Button
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
