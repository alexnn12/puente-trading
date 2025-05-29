import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="text-center space-y-8 max-w-2xl">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
            ¡Bienvenido a Puente!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Tu plataforma para conectar y crear experiencias increíbles
          </p>
          <Button>
            hola
          </Button>
        </div>
        
      
       
      </main>
    </div>
  );
}
