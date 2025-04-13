import { useEffect, useState } from 'react';

/**
 * スクロール方向を取得する
 * @returns スクロール方向
 */
export function useScrollDirection() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlHeader = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        // スクロールダウン時はヘッダーを非表示
        setIsVisible(false);
      } else {
        // スクロールアップ時
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlHeader);

    return () => {
      window.removeEventListener('scroll', controlHeader);
    };
  });

  return isVisible;
}
