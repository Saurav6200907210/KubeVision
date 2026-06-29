import { useState, useEffect } from 'react';

export function useTypewriter(text: string, speed: number = 50, loop: boolean = false) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let i = 0;
    setIsTyping(true);
    setDisplayedText('');
    
    const typeWriter = () => {
      if (i < text.length) {
        setDisplayedText(text.substring(0, i + 1));
        i++;
        setTimeout(typeWriter, speed + (Math.random() * 50)); // Add slight randomization for realistic typing
      } else {
        setIsTyping(false);
        if (loop) {
          setTimeout(() => {
            i = 0;
            setDisplayedText('');
            setIsTyping(true);
            typeWriter();
          }, 3000); // pause before loop
        }
      }
    };

    const timeout = setTimeout(typeWriter, speed);
    return () => clearTimeout(timeout);
  }, [text, speed, loop]);

  return { displayedText, isTyping };
}
