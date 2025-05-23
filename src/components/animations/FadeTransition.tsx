// src/components/animations/FadeTransition.tsx - Fixed version with faster transition
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

interface FadeTransitionProps {
  show: boolean;
  backgroundColor?: string;
  duration?: number;
  onComplete?: () => void;
}

const TransitionOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 999;
  pointer-events: none; // Allow clicking through the overlay
`;

// Eased content container - MODIFIED to remove min-height
const ContentContainer = styled(motion.div)`
  width: 100%;
  /* Removed min-height: 100vh which was causing the spacing issue */
`;

const FadeTransition: React.FC<FadeTransitionProps> = ({ 
  show, 
  backgroundColor = "#ffffff", 
  duration = 0.4, // Default to faster 0.4s duration
  onComplete 
}) => {
  const [isAnimating, setIsAnimating] = useState(show);
  
  useEffect(() => {
    if (show) {
      setIsAnimating(true);
    }
  }, [show]);
  
  const handleAnimationComplete = () => {
    if (!show) {
      setIsAnimating(false);
      if (onComplete) onComplete();
    }
  };
  
  return (
    <AnimatePresence>
      {(show || isAnimating) && (
        <TransitionOverlay
          key="fade-transition"
          initial={{ opacity: 1 }}
          animate={{ opacity: show ? 1 : 0 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: duration,
            ease: "easeInOut"
          }}
          style={{ backgroundColor }}
          onAnimationComplete={handleAnimationComplete}
        />
      )}
    </AnimatePresence>
  );
};

// Export a content revealer that will be used to wrap the main content
// MODIFIED to remove min-height
export const ContentRevealer: React.FC<{
  visible: boolean;
  children: React.ReactNode;
  delay?: number;
}> = ({ visible, children, delay = 0.05 }) => { // Minimal delay
  return (
    <ContentContainer
      initial={{ opacity: 0, y: 30 }}
      animate={{ 
        opacity: visible ? 1 : 0, 
        y: visible ? 0 : 30 
      }}
      transition={{
        opacity: { duration: 0.25, delay: delay, ease: "easeOut" }, // Faster fade in
        y: { duration: 0.3, delay: delay, ease: [0.16, 1, 0.3, 1] } // Faster movement
      }}
    >
      {children}
    </ContentContainer>
  );
};

export default FadeTransition;