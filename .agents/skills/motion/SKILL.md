---
name: motion
description: Guides the implementation of high-performance UI animations, gestures, scroll-linked effects, and page transitions using the official Motion (motion/react) library.
---

# Motion (`motion.dev`) Animation Intelligence

## Core Motion Guidelines & Best Practices

1. **Importing in React Projects**
   - Always import from `motion/react` (modern standard) instead of legacy `framer-motion`:
     ```tsx
     import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
     ```

2. **Spring Physics & Natural Motion**
   - Favor physics-based springs over rigid linear tweens for natural UI feedback:
     ```tsx
     <motion.div
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ type: "spring", stiffness: 300, damping: 25 }}
     />
     ```

3. **Gestures & Interactive States**
   - Use built-in gesture props (`whileHover`, `whileTap`, `whileFocus`) rather than manual CSS/JS event listeners:
     ```tsx
     <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
       Click Me
     </motion.button>
     ```

4. **Exit Transitions & Shared Layouts**
   - Wrap unmounting components in `<AnimatePresence mode="popLayout">` to allow smooth exit animations.
   - Use the `layout` or `layoutId` prop for seamless morphing transitions across layout shifts.

5. **Accessibility & Reduced Motion**
   - Always ensure animations gracefully degrade or simplify when users enable system reduced-motion settings (`useReducedMotion()`).
