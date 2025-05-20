import React from 'react';
import './Blog.css';

const Blog: React.FC = () => {
    return (
        <div className="blog-container mx-auto px-4 py-8">
            {/* Blog Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800">IT Performance Monitoring Insights</h1>
                <p className="text-xl text-gray-600 mt-2">
                    Get tips, tricks and best practices for IT troubleshooting,
                    performance tuning and optimizations
                </p>
                <p className="text-gray-500 mt-1">An eG Innovations Blog</p>
            </div>

            {/* Recent Blog */}
            <div className="recent-blog mb-12 bg-white shadow-md rounded-lg overflow-hidden">
                <div className="md:flex">
                    <div className="md:flex-shrink-0">
                        {/* Placeholder for image */}
                        <div className="h-48 w-full md:w-56 bg-gray-300 object-cover flex items-center justify-center text-gray-600">Image Placeholder</div>
                    </div>
                    <div className="p-8">
                        <div className="uppercase tracking-wide text-sm text-blue-500 font-semibold">Recent Blog</div>
                        <h2 className="mt-1 text-xl leading-tight font-medium text-black">How to Monitor PowerShell Activity and Detect PowerShell Exploitation Vulnerabilities</h2>
                        <p className="mt-2 text-gray-500">
                            PowerShell has unfortunately become a favored tool for malicious attackers. Find out how to monitor PowerShell activity and execution policies and how to protect your systems from PowerShell exploitation attacks.
                        </p>
                        <a href="#" className="block mt-4 text-lg leading-tight font-semibold text-blue-600 hover:underline">Read the Blog</a>
                    </div>
                </div>
            </div>

            {/* Blog Content - Categories and Posts */}
            <div className="blog-content grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Filter by Category */}
                <div className="categories">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Filter by Category</h3>
                    <ul className="space-y-2 text-gray-600">
                        <li><a href="#" className="hover:underline">All</a></li>
                        <li><a href="#" className="hover:underline">.NET Monitoring</a></li>
                        <li><a href="#" className="hover:underline">Application Performance Monitoring (APM)</a></li>
                        {/* Add more categories as needed */}
                    </ul>
                </div>

                {/* Blog Post List */}
                <div className="blog-posts md:col-span-3 space-y-8">
                    {/* Example Blog Post Card */}
                    <div className="blog-post-card bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="p-6">
                            <div className="uppercase tracking-wide text-sm text-blue-500 font-semibold">Application Performance Monitoring (APM)</div>
                            <h3 className="mt-1 text-lg leading-tight font-medium text-black">Observability Best Practices: Balancing Sustainability and Cost in a Data-Driven World</h3>
                            <p className="mt-2 text-gray-500">
                                Discover observability best practices. Strike the right balance between system performance, sustainability, and cost-efficiency with data-driven insights.
                            </p>
                            <p className="mt-4 text-gray-500 text-sm">by Gita Rao Prasad | May 7, 2025</p>
                            <a href="#" className="block mt-4 text-md leading-tight font-semibold text-blue-600 hover:underline">Read the Blog</a>
                        </div>
                    </div>
                    {/* Repeat blog post cards for other posts */}

                    <div className="blog-post-card bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="p-6">
                            <div className="uppercase tracking-wide text-sm text-blue-500 font-semibold">Azure Monitoring</div>
                            <h3 className="mt-1 text-lg leading-tight font-medium text-black">Windows 365 vs. Azure Virtual Desktop: Which is Right for Your Business?</h3>
                            <p className="mt-2 text-gray-500">
                                Since the COVID-19 pandemic, organizations have shifted their workforce to remote and hybrid operations. This transition has birthed a new demand for cloud-based desktop solutions to let employees access their desktops from anywhere.
                            </p>
                            <p className="mt-4 text-gray-500 text-sm">by Nanda Kumar | April 30, 2025</p>
                            <a href="#" className="block mt-4 text-md leading-tight font-semibold text-blue-600 hover:underline">Read the Blog</a>
                        </div>
                    </div>

                </div>
            </div>

            {/* Load More Button */}
            <div className="text-center mt-12">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors duration-200">
                    Load more
                </button>
            </div>
        </div>
    );
};

export default Blog; 