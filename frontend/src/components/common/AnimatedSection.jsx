import React from 'react';
import { motion } from 'framer-motion';

const AnimatedSection = ({
    children,
    className = "",
    delay = 0,
    direction = "up",
    duration = 0.6,
    distance = 40,
    once = true
}) => {
    const variants = {
        hidden: {
            opacity: 0,
            y: direction === "up" ? distance : direction === "down" ? -distance : 0,
            x: direction === "left" ? distance : direction === "right" ? -distance : 0,
        },
        visible: {
            opacity: 1,
            y: 0,
            x: 0,
            transition: {
                duration: duration,
                delay: delay,
                ease: [0.25, 0.1, 0.25, 1],
            },
        },
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: once, amount: 0.2 }}
            variants={variants}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default AnimatedSection;
