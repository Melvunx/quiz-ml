import Logo from "@/components/layout/Logo";
import Login from "@/components/Login";
import Register from "@/components/Register";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Auth() {
  return (
    <div className="relative flex min-h-screen items-center justify-center">
      <Logo classname="text-xl" />
      <Tabs defaultValue="login" className="flex w-96 flex-col gap-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Se connecter</TabsTrigger>
          <TabsTrigger value="register">Créer un compte</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Login />
        </TabsContent>
        <TabsContent value="register">
          <Register />
        </TabsContent>
      </Tabs>
    </div>
  );
}
