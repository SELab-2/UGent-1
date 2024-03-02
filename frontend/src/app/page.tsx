"use client"

import Image from "next/image";
import React, { useState, useEffect } from 'react';


export default function Home() {
  

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/groups/');
        if (response.ok) {
          const json = await response.json();
          setData(json);
        } else {
          console.error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Deployment test:</h1>
      <p>{JSON.stringify(data)}</p>
    </main>
  );
}
