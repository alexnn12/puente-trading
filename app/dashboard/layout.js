'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuSeparator,DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Image from 'next/image';

export default function DashboardLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/');
        return;
      }

      try {
        // Decode JWT token to check expiration
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;

        if (payload.exp < currentTime) {
          // Token expired
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/');
          return;
        }

        // Token is valid
        const userData = localStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
        setIsAuthenticated(true);
      } catch (error) {
        // Invalid token
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/');
        return;
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
     
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen">
      <header className="border-b bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center ">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem className=''>
                <Link href="/dashboard" legacyBehavior passHref>
                  <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                    <Image src="/puente.svg" alt="Puente" width={120} height={24} />
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>  
              <Avatar>
                <AvatarFallback className='bg-gray-50'>{user?.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent> 
              <DropdownMenuItem>
                {user && `Hola ${user.nombre}`}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>    
                <Link href="/dashboard/perfil" legacyBehavior passHref> 
                  Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className='container mx-auto px-8 py-4'>
        {children}
      </main>
    </div>
  );
}
