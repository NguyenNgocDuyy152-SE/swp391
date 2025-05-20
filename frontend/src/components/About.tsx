import React from 'react';

const About: React.FC = () => {
    return (
        <div className="bg-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-8">About Our Reproductive Health Center</h1>
                </div>

                <div className="mt-12 space-y-12">
                    <div className="bg-gray-50 rounded-lg p-8 shadow-sm">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
                        <p className="text-gray-600 leading-relaxed">
                            At our Reproductive Health Center, we are dedicated to providing comprehensive, compassionate, and cutting-edge care for individuals and couples facing fertility challenges. Our mission is to help families grow through advanced reproductive technologies while maintaining the highest standards of medical excellence and patient care.
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-8 shadow-sm">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Expertise</h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            Our center specializes in a wide range of reproductive health services, including:
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                            <li>In Vitro Fertilization (IVF)</li>
                            <li>Intrauterine Insemination (IUI)</li>
                            <li>Fertility Preservation</li>
                            <li>Genetic Testing and Counseling</li>
                            <li>Male and Female Infertility Treatment</li>
                            <li>Reproductive Surgery</li>
                            <li>Fertility Assessment and Diagnosis</li>
                        </ul>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-8 shadow-sm">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Approach</h2>
                        <p className="text-gray-600 leading-relaxed">
                            We believe in a holistic approach to reproductive healthcare. Our team of experienced specialists combines medical expertise with emotional support to guide you through your fertility journey. We understand that each patient's situation is unique, and we develop personalized treatment plans that address your specific needs and goals.
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-8 shadow-sm">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">State-of-the-Art Facilities</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Our center is equipped with the latest technology and facilities to provide the highest quality of care. From advanced laboratory equipment to comfortable patient spaces, we ensure that every aspect of your treatment is conducted in a safe, supportive, and technologically advanced environment.
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-8 shadow-sm">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Commitment to You</h2>
                        <p className="text-gray-600 leading-relaxed">
                            We are committed to providing transparent, ethical, and patient-centered care. Our team is dedicated to supporting you throughout your fertility journey, offering both medical expertise and emotional guidance. We believe in open communication, ensuring that you are fully informed and comfortable with every step of your treatment process.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About; 