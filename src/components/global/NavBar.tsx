"use client"

import Image from 'next/image'
import React, { useState } from 'react'
import { Menu } from 'lucide-react'
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import logOut from '@/lib/auth/logOut';

type navBarLink = {
  id: number,
  text: string,
  url?: string,
  isForNav: boolean
  onClick?: () => void
}

export default function NavBar() {

  const { data: session } = useSession();

  // State to manage the navbar's visibility
  const [nav, setNav] = useState(false);

  // Toggle function to handle the navbar's display
  const handleNav = () => {
    setNav(!nav);
  };

  // Array containing navigation items
  const navItems: navBarLink[] = 
  session?
  [
    { id: 1, text: session.user.username, url: '/profile', isForNav: true },
    { id: 2, text: 'Logout', url: '/api/auth/signout', isForNav: false, onClick: logOut },
  ]
    :
  [
    { id: 1, text: 'SignUp', url: '/signup', isForNav: true },
    { id: 2, text: 'Login', url: '/login', isForNav: true },
  ];

  return (
    <div className='bg-slate-700 flex justify-between items-center h-16 p-2 md:px-6 text-white '>
      <Link href={{
        pathname: "/",
        
      }} className='flex gap-2 items-center'>
        <Image 
          src="/img/mememundi.webp"
          alt="logo"
          width={48}
          height={48}
        />
        <h1 className='text-3xl font-bold'>Mememundi</h1>
      </Link>

      <ul className='hidden gap-4 md:flex'>
        {navItems.map(item => (
          <li
            key={item.id}
            className='duration-300 hover:text-gray-400 cursor-pointer w-18'
          >
            {
              item.isForNav && item.url ?
               <Link href={item.url}>{item.text}</Link>
              :
              <button onClick={item.onClick}>{item.text}</button>
            }
          </li>
        ))}
      </ul>

      <div onClick={handleNav} className='block hover:text-gray-400 duration-300 cursor-pointer md:hidden'>
        {nav ? <Menu className='text-gray-400' size={32} /> : <Menu size={32} />}
      </div>

      <ul
        className={
          nav
            ? 'fixed md:hidden left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-slate-800 ease-in-out duration-500 z-20'
            : 'ease-in-out w-[60%] duration-500 fixed top-0 bottom-0 left-[-100%] z-20'
        }
      >
        <h1 className='w-full text-3xl font-bold text-white m-4'>Menu</h1>

        {navItems.map(item => (
            item.isForNav && item.url ?
              <Link
                key={item.id}
                href={item.url}
              >
                <p className='w-full p-4 border-b hover:bg-blue-900 duration-300 hover:text-black cursor-pointer border-gray-600' >{item.text}</p>
              </Link>
            :
            <button
              key={item.id}
              onClick={item.onClick}
              className='w-full p-4 text-left border-b hover:bg-blue-900 duration-300 hover:text-black cursor-pointer border-gray-600'
            >
              <p >{item.text}</p>
            </button>
        ))}

        <button ></button>
      </ul>
    </div>
  );
};