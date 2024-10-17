// File path: C:\Users\63936\Documents\GitHub\capstone\capstone-final\src\product-page-component\Category.jsx
import React from 'react';

const Category = () => {
    return (
        <div className="absolute left-0 top-full w-full bg-white shadow-lg z-50"> {/* w-full to match the entire navbar */}
            <div className="p-6 grid grid-cols-4 gap-4 max-w-screen-xl mx-auto">  {/* Inner content remains centered */}
                <div>
                    <h3 className="font-bold text-lg mb-4">Category 1</h3>
                    <ul>
                        <li><a href="#category1-sub1" className="text-gray-700 hover:text-gray-900">Subcategory 1</a></li>
                        <li><a href="#category1-sub2" className="text-gray-700 hover:text-gray-900">Subcategory 2</a></li>
                        <li><a href="#category1-sub3" className="text-gray-700 hover:text-gray-900">Subcategory 3</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-4">Category 2</h3>
                    <ul>
                        <li><a href="#category2-sub1" className="text-gray-700 hover:text-gray-900">Subcategory 1</a></li>
                        <li><a href="#category2-sub2" className="text-gray-700 hover:text-gray-900">Subcategory 2</a></li>
                        <li><a href="#category2-sub3" className="text-gray-700 hover:text-gray-900">Subcategory 3</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-4">Category 3</h3>
                    <ul>
                        <li><a href="#category3-sub1" className="text-gray-700 hover:text-gray-900">Subcategory 1</a></li>
                        <li><a href="#category3-sub2" className="text-gray-700 hover:text-gray-900">Subcategory 2</a></li>
                        <li><a href="#category3-sub3" className="text-gray-700 hover:text-gray-900">Subcategory 3</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-4">Category 4</h3>
                    <ul>
                        <li><a href="#category4-sub1" className="text-gray-700 hover:text-gray-900">Subcategory 1</a></li>
                        <li><a href="#category4-sub2" className="text-gray-700 hover:text-gray-900">Subcategory 2</a></li>
                        <li><a href="#category4-sub3" className="text-gray-700 hover:text-gray-900">Subcategory 3</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Category;
