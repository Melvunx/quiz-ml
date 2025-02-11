import useAuth from "@/hooks/use-auth";
import { apiErrorHandler } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import LoadingString from "./ui/loading-string";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const {
    mutate: loginMutation,
    isPending: isLoging,
    isError,
  } = useMutation({
    mutationKey: ["login"],
    mutationFn: async (credentials: { email: string; password: string }) => {
      const { email, password } = credentials;
      await login(email, password);
    },
    onSuccess: () => navigate("/dashboard"),
    onError: (error) => console.error(error),
  });

  const onLoginAction = async (data: FormData) => {
    const formData = {
      email: String(data.get("email")),
      password: String(data.get("password")),
    };

    setError(null);

    try {
      await loginMutation(formData);
    } catch (error) {
      const errorResponse = apiErrorHandler(error);
      setError(errorResponse.error as string);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connexion</CardTitle>
      </CardHeader>
      <CardDescription>
        Connectez vous afin de tester des quizs et les créer vous même !
      </CardDescription>
      <CardContent className="space-y-2">
        <form id="loginForm" action={onLoginAction}>
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" name="email" />
            {error ? (
              error.includes("email") ? (
                <p className="italic text-red-500">{error}</p>
              ) : null
            ) : null}
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Mot de passe</Label>
            <Input id="password" type="password" name="password" />
            {error ? (
              error.includes("password") ? (
                <p className="italic text-red-500">{error}</p>
              ) : null
            ) : null}
          </div>
          {isError && (
            <p className="font-semibold tracking-wide text-red-500">
              Erreur de connexion. Veuillez réessayer.
            </p>
          )}
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" form="loginForm">
          {isLoging ? <LoadingString word="Connexion..." /> : "Se connecter"}
        </Button>
      </CardFooter>
    </Card>
  );
}
