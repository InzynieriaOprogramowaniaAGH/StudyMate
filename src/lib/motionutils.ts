"use client";

import { Variants, easeIn, easeOut, easeInOut } from "framer-motion";

/**
 * Proste pojawienie się z dołu (fade + slide)
 */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: easeOut },
  },
};

/**
 * Fade bez przesunięcia
 */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.8, ease: easeOut },
  },
};

/**
 * Skalowanie z zanikiem
 */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: easeOut },
  },
};

/**
 * Opóźnione pojawienie się dzieci (np. w listach, sekcjach)
 */
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

/**
 * Pojawienie się z prawej (slide-in)
 */
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: easeOut },
  },
};

/**
 * Pojawienie się z lewej (slide-in)
 */
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: easeOut },
  },
};
