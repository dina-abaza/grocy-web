"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link'; 
import Activity from '@/app/loading';
const CategoryGrid = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://iraqi-e-store-api.vercel.app/api/categories');
        setCategories(response.data.categories || response.data);
        console.log("categories",response.data)
        setLoading(false);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <Activity />;
    return (
    <div className="max-w-7xl mx-auto px-4 py-6 mb-20" dir="rtl">
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {categories.map((category) => (
        
          <Link 
           href={{
            pathname: `/category/${category._id}`,
             query: { name: category.name },
             }}
            key={category._id} 
            className="relative overflow-hidden rounded-xl shadow-md bg-white aspect-square group transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
          
            <img 
              src={category.image || "/placeholder.jpg"} 
              alt={category.name || "تصنيف"}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

           
            <div className="absolute bottom-0 left-0 right-0 bg-black/40 group-hover:bg-black/60 backdrop-blur-[1px] py-2 text-center transition-colors duration-300">
              <span className="text-white font-bold text-xs md:text-lg">
                {category.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;