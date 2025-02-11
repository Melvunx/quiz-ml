import useAuth from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { dateFormater, showError, toastParams } from "@/lib/utils";
import { RegisterUser, RegisterUserSchema } from "@/schema/auth";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import ErrorInputMessage from "./ui/error-input-message";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import LoadingString from "./ui/loading-string";

export default function Register() {
  const { register } = useAuth();
  const { toast } = useToast();
  const [errors, setErrors] = useState<string[]>([]);

  const {
    mutate: registerMutation,
    isPending: isCreatingUser,
    isSuccess,
    isError,
  } = useMutation({
    mutationKey: ["register"],
    mutationFn: async (credentials: RegisterUser) => {
      const { username, email, password } = credentials;
      await register(username, email, password);
    },
  });

  const onRegisterAction = async (data: FormData) => {
    const formData = {
      username: String(data.get("username")),
      email: String(data.get("email")),
      password: String(data.get("password")),
    };

    try {
      const validData = RegisterUserSchema.parse(formData);
      setErrors([]);

      await registerMutation(validData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.errors.map((error) => error.message));
      }
      if (process.env.NODE_ENV === "development") console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Créer votre compte !</CardTitle>
      </CardHeader>
      <CardDescription>
        Créer votre compte afin de tester et vérifier votre quiz !
      </CardDescription>
      <CardContent className="space-y-2">
        <form id="registerForm" action={onRegisterAction}>
          <div className="space-y-1">
            <Label htmlFor="username">Username</Label>
            <Input id="username" name="username" />
            {errors.length > 0 ? (
              <ErrorInputMessage error={showError(errors, "4")} />
            ) : null}
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" name="email" />
            {errors.length > 0 ? (
              <ErrorInputMessage error={showError(errors, "Email")} />
            ) : null}
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Mot de passe</Label>
            <Input id="password" type="password" name="password" />
            {errors.length > 0 ? (
              <ErrorInputMessage error={showError(errors, "6")} />
            ) : null}
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          form="registerForm"
          onClick={() => {
            if (isSuccess) {
              toast(
                toastParams(
                  "User created !",
                  `${dateFormater(new Date(Date.now()))}`
                )
              );
            }
          }}
        >
          {isCreatingUser ? (
            <LoadingString word="Création en cours" />
          ) : (
            "Créer votre compte"
          )}
        </Button>

        {isError && (
          <p className="font-semibold tracking-wide text-red-500">
            Erreur de connexion. Veuillez réessayer.
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
