import Logo from "@/components/layout/Logo";
import Login from "@/components/Login";
import Register from "@/components/Register";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Auth() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-12">
      <Logo classname="text-xl" />
      <Tabs defaultValue="login" className="flex w-96 flex-col gap-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            className="font-regular-noto tracking-wide"
            value="login"
          >
            Se connecter
          </TabsTrigger>
          <TabsTrigger
            className="font-regular-noto tracking-wide"
            value="register"
          >
            Créer un compte
          </TabsTrigger>
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
