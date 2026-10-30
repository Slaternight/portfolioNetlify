import { useEffect, useState } from "react";

/**
 * Types each word, pauses, deletes it and moves to the next one.
 * With reduced motion it simply swaps whole words.
 */
export function useTypewriter(words, { typeSpeed = 85, deleteSpeed = 45, pause = 1400, reduced = false } = {}) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(reduced ? words[0] : "");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[index % words.length];

    if (reduced) {
      setText(word);
      const id = setTimeout(() => setIndex((i) => i + 1), pause + 600);
      return () => clearTimeout(id);
    }

    if (!deleting && text === word) {
      const id = setTimeout(() => setDeleting(true), pause);
      return () => clearTimeout(id);
    }
    if (deleting && text === "") {
      setDeleting(false);
      setIndex((i) => i + 1);
      return;
    }

    const id = setTimeout(
      () => setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1)),
      deleting ? deleteSpeed : typeSpeed
    );
    return () => clearTimeout(id);
  }, [words, index, text, deleting, typeSpeed, deleteSpeed, pause, reduced]);

  return text;
}
