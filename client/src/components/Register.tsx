import useAuth from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { dateFormater, showError, toastParams } from "@/lib/utils";
import ErrorPage from "@/pages/ErrorPage";
import { RegisterUser, RegisterUserSchema } from "@/schema/auth";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const [errors, setErrors] = useState<string[]>([]);

  const {
    mutate: registerMutation,
    isPending: isCreatingUser,
    isError,
  } = useMutation({
    mutationKey: ["register"],
    mutationFn: async (credentials: RegisterUser) => {
      const { username, email, password } = credentials;
      await register(username, email, password);
    },
    onSuccess: () => {
      if (errors.length === 0) {
        toast(
          toastParams("User created !", `${dateFormater(new Date(Date.now()))}`)
        );
      }
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

  if (isError) return <ErrorPage />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Créer votre compte</CardTitle>
      </CardHeader>
      <CardDescription className="my-3 text-center">
        Créer votre compte afin de tester et vérifier votre quiz !
      </CardDescription>
      <CardContent className="space-y-2">
        <form id="registerForm" action={onRegisterAction}>
          <div className="space-y-1">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              className="placeholder:opacity-55"
              placeholder="User987"
            />
            {errors.length > 0 && (
              <ErrorInputMessage error={showError(errors, "4")} />
            )}
          </div>
          <div className="my-2 space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              className="placeholder:opacity-55"
              placeholder="exemple@gmail.com"
            />
            {errors.length > 0 && (
              <ErrorInputMessage error={showError(errors, "Email")} />
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Mot de passe</Label>
            <div className="flex items-center gap-2">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
              />
              <Button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Eye /> : <EyeOff />}
              </Button>
            </div>
            {errors.length > 0 && (
              <ErrorInputMessage error={showError(errors, "6")} />
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button type="submit" form="registerForm">
          {isCreatingUser ? (
            <LoadingString word="Création en cours" />
          ) : (
            "Créer votre compte"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
