import useAuth from "@/hooks/use-auth";
import { apiErrorHandler } from "@/lib/utils";
import useErrorStore from "@/store/error";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
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
import ErrorInputMessage from "./ui/error-input-message";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import LoadingString from "./ui/loading-string";

export default function Login() {
  const { login } = useAuth();
  const { error } = useErrorStore();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

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
    onSuccess: () => navigate("/quiz-dashboard"),
    onError: (error) => apiErrorHandler(error),
  });

  const onLoginAction = async (data: FormData) => {
    const formData = {
      email: String(data.get("email")),
      password: String(data.get("password")),
    };

    setFormErrors({});

    let hasErrors = false;

    if (!formData.email) {
      setFormErrors((prev) => ({ ...prev, email: "Email est requis" }));
      hasErrors = true;
    }

    if (!formData.password) {
      setFormErrors((prev) => ({
        ...prev,
        password: "Le mot de passe est requis",
      }));
      hasErrors = true;
    }

    if (!hasErrors) {
      await loginMutation(formData);
    }
  };

  return (
    <Card className="font-regular-funnel-display">
      <CardHeader>
        <CardTitle>Connexion</CardTitle>
      </CardHeader>
      <CardDescription className="my-2 text-center leading-6">
        Connectez vous afin de tester des quizs et les créer vous même !
      </CardDescription>
      <CardContent className="space-y-2">
        <form id="loginForm" action={onLoginAction}>
          <div className="my-2 space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              className="placeholder:opacity-55"
              id="email"
              type="email"
              name="email"
              placeholder="exemple@gmail.com"
            />
            {error && error.includes("email") ? (
              <ErrorInputMessage error={error} />
            ) : (
              formErrors.email && <ErrorInputMessage error={formErrors.email} />
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Mot de passe</Label>{" "}
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
                {showPassword ? <EyeOff /> : <Eye />}
              </Button>
            </div>
            {error && error.includes("password") ? (
              <ErrorInputMessage error={error} />
            ) : (
              formErrors.password && (
                <ErrorInputMessage error={formErrors.password} />
              )
            )}
          </div>
          {formErrors.general ||
            (isError && (
              <ErrorInputMessage
                error={
                  formErrors.general ||
                  "Erreur de connexion. Veuillez réessayer."
                }
              />
            ))}
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          type="submit"
          className="font-regular-noto tracking-tight"
          form="loginForm"
        >
          {isLoging ? <LoadingString word="Connexion" /> : "Se connecter"}
        </Button>
      </CardFooter>
    </Card>
  );
}
