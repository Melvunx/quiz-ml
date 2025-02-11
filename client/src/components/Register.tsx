import useAuth from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { dateFormater, toastParams } from "@/lib/utils";
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
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import LoadingString from "./ui/loading-string";

export default function Register() {
  const { register } = useAuth();
  const { toast } = useToast();
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

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
      setValidationErrors([]);

      await registerMutation(validData);
    } catch (errors) {
      if (errors instanceof z.ZodError) {
        setValidationErrors(errors.errors.map((error) => error.message));
      }

      console.error("Unexpected error : ", errors);
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
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" name="email" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Mot de passe</Label>
            <Input id="password" type="password" name="password" />
          </div>
          {validationErrors.length > 0 && (
            <div className="mx-auto flex w-1/2 flex-col items-center justify-center">
              {validationErrors.map((error, index) => (
                <p key={index} className="italic text-red-500">
                  {error}
                </p>
              ))}
            </div>
          )}
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
