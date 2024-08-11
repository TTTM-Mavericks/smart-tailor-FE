import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import FooterComponent from '../../components/Footer/FooterComponent';
import HeaderComponent from '../../components/Header/HeaderComponent';

const AboutUs = () => {
    const controls = useAnimation();
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const [ref1, inView1] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const [ref2, inView2] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    useEffect(() => {
        if (inView) {
            controls.start('visible');
        }
    }, [controls, inView]);

    useEffect(() => {
        if (inView1) {
            controls.start('visible');
        }
    }, [controls, inView1]);

    useEffect(() => {
        if (inView2) {
            controls.start('visible');
        }
    }, [controls, inView2]);


    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    };

    const _handleProduct = () => {
        window.location.href = '/product'
    }

    const _handleDesign = () => {
        window.location.href = '/design_create'
    }

    return (
        <div className="bg-gradient-to-br from-orange-100 to-orange-200 min-h-screen">
            <HeaderComponent />
            {/* Hero Section */}
            <div className="relative h-screen flex items-center justify-center overflow-hidden bg-[#E96208]">
                <motion.div
                    className="z-20 text-center max-w-4xl px-4"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <motion.h1
                        className="text-5xl md:text-7xl font-bold text-white mb-6"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                    >
                        Redefining Fashion with 3D Technology
                    </motion.h1>
                    <motion.p
                        className="text-xl md:text-2xl text-white mb-8"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.4 }}
                    >
                        Experience the future of clothing design where innovation meets style
                    </motion.p>
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white text-[#E96208] px-8 py-3 rounded-full font-semibold text-lg hover:bg-orange-100 transition duration-300"
                        onClick={() => { window.location.href = '/' }}
                    >
                        Discover Our Process
                    </motion.button>
                </motion.div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                {/* About Us Section */}
                <motion.div
                    ref={ref}
                    initial="hidden"
                    animate={controls}
                    variants={fadeInUp}
                    className="mb-20"
                >
                    <h2 className="text-4xl font-bold text-[#E96208] mb-8 text-center">About Our 3D Clothing Design Studio</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <p className="text-lg text-gray-700">
                                Welcome to our innovative clothing design studio, where creativity meets technology. We specialize in creating unique, cutting-edge designs using advanced 3D modeling techniques.
                            </p>
                            <p className="text-lg text-gray-700">
                                Our team of expert designers and 3D artists work tirelessly to bring your fashion ideas to life, pushing the boundaries of what's possible in clothing design.
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-[#E96208] text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-700 transition duration-300"
                                onClick={_handleProduct}
                            >
                                Explore Our Designs
                            </motion.button>
                        </div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="relative h-96 w-full"
                        >
                            <div className="absolute inset-0 bg-orange-300 rounded-lg shadow-2xl transform rotate-3"></div>
                            <div className="absolute inset-0 bg-[#E96208] rounded-lg shadow-2xl -rotate-3"></div>
                            <div className="absolute inset-0 bg-white rounded-lg shadow-2xl flex items-center justify-center">
                                <span className="text-2xl font-bold text-[#E96208]">3</span>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Our Process Section */}
                <motion.div
                    ref={ref1}
                    initial="hidden"
                    animate={controls}
                    variants={fadeInUp}
                    className="mb-20"
                >
                    <h2 className="text-4xl font-bold text-[#E96208] mb-8 text-center">Our Process</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: 'Ideation', icon: '💡', description: 'We start with your vision, researching trends and sketching initial concepts.' },
                            { title: '3D Modeling', icon: '🖥️', description: 'Our 3D artists bring the designs to life, allowing for precise adjustments and visualizations.' },
                            { title: 'Refinement', icon: '✨', description: 'We perfect every detail, ensuring the final product exceeds expectations.' }
                        ].map((step, index) => (
                            <motion.div
                                key={step.title}
                                className="bg-white p-6 rounded-lg shadow-md"
                                whileHover={{ y: -5 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="text-4xl mb-4">{step.icon}</div>
                                <h3 className="text-xl font-semibold mb-2 text-[#E96208]">{step.title}</h3>
                                <p className="text-gray-600">{step.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Technology Showcase */}
                <motion.div
                    ref={ref2}
                    initial="hidden"
                    animate={controls}
                    variants={fadeInUp}
                    className="mb-20"
                >
                    <h2 className="text-4xl font-bold text-[#E96208] mb-8 text-center">Our Technology</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <motion.img
                            src="https://themewagon.github.io/malefashion/img/banner/banner-1.jpg"
                            alt="3D model of a garment"
                            className="rounded-lg shadow-xl"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                        />
                        <div className="space-y-6">
                            <h3 className="text-2xl font-semibold text-[#E96208]">State-of-the-Art 3D Modeling</h3>
                            <p className="text-lg text-gray-700">
                                Our studio utilizes the latest in 3D modeling software, allowing us to create hyper-realistic garment visualizations. This technology enables us to:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2">
                                <li>Experiment with fabrics and textures in real-time</li>
                                <li>Adjust fits and proportions with millimeter precision</li>
                                <li>Visualize garments on diverse body types</li>
                                <li>Reduce material waste in the prototyping phase</li>
                            </ul>
                        </div>
                    </div>
                </motion.div>

                {/* Call to Action */}
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                >
                    <h2 className="text-3xl font-bold text-[#E96208] mb-4">Ready to Bring Your Vision to Life?</h2>
                    <p className="text-xl text-gray-700 mb-8">Let's create something extraordinary together.</p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-[#E96208] text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-orange-700 transition duration-300"
                        onClick={_handleDesign}
                    >
                        Start Your Project
                    </motion.button>
                </motion.div>
            </div>

            {/* Footer */}
            <FooterComponent />
        </div>
    );
};

export default AboutUs;