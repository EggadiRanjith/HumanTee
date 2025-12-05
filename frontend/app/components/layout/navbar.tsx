"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
    return (
        <nav className="w-full bg-[#0c0c0c]/90 backdrop-blur-md border-b border-white/10 fixed top-0 left-0 z-50">
            <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-4">

                {/* LEFT — BRAND LOGO */}
                <motion.div
                    whileHover={{ scale: 1.08, rotateX: 8, rotateY: -8 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="flex items-center gap-2 cursor-pointer"
                >
                    <Image
                        src="/logo.png"
                        alt="Brand"
                        width={40}
                        height={40}
                        className="rounded-md shadow-md"
                    />
                    <span className="text-white font-semibold text-lg tracking-wide">
                        YourBrand
                    </span>
                </motion.div>

                {/* MIDDLE — NAV LINKS */}
                <div className="hidden md:flex items-center gap-8">
                    {["Store", "Orders"].map((item) => (
                        <motion.div
                            key={item}
                            whileHover={{ scale: 1.15, rotateX: 10, rotateY: 10 }}
                            transition={{ duration: 0.25 }}
                        >
                            <Link
                                href={`/${item.toLowerCase()}`}
                                className="text-white/90 hover:text-white font-medium tracking-wide"
                            >
                                {item}
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* RIGHT — PROFILE + CART */}
                <div className="flex items-center gap-6">
                    {["Profile", "Cart"].map((item) => (
                        <motion.div
                            key={item}
                            whileHover={{ scale: 1.2, rotateX: 8, rotateY: -8 }}
                            transition={{ duration: 0.25 }}
                        >
                            <Link
                                href={`/${item.toLowerCase()}`}
                                className="text-white/90 hover:text-white font-medium tracking-wide"
                            >
                                {item}
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </nav>
    );
}
