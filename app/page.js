import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from "@/components/ui/input";

import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col  bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="flex-1 flex items-center justify-center p-4">
      <Card className="w-full md:w-1/3">
        <CardHeader>
          <CardTitle>            <Image src="/puente.svg" alt="Puente" width={120} height={120} className="mx-auto" />
          </CardTitle>
          <CardDescription className="text-center">
          Tu plataforma de trading para invertir y hacer crecer tu capital
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form >
            <div className="mb-4">
            <Input type="email" placeholder="Email" />

            </div>

            <div className="mb-4">
            <Input type="password" placeholder="Contraseña" />

            </div>

            <div className="flex justify-center">
              <Button >Entrar</Button>
            </div>
          </form>
        </CardContent>
        <CardFooter>
        <Button variant={"outline"}>
            Registrarse Ahora
          </Button>
        </CardFooter>
      </Card>
      
        
      
       
      </main>
    </div>
  );
}
