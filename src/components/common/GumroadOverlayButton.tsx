import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { GUMROAD_CONFIG } from '../../constants/gumroad';

interface GumroadOverlayButtonProps {
  plan: 'pro' | 'lifetime';
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const GumroadOverlayButton: React.FC<GumroadOverlayButtonProps> = ({
  plan,
  children,
  className = '',
  onClick,
}) => {
  const product = GUMROAD_CONFIG.products[plan];
  const url = product?.url || GUMROAD_CONFIG.storeUrl;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <a
      href={url}
      data-gumroad-single-product="true"
      className={`gumroad-button ${className}`}
      onClick={handleClick}
      target="_blank"
      rel="noreferrer"
    >
      {children || (
        <span className="flex items-center justify-center gap-1.5">
          <Sparkles size={14} />
          <span>{plan === 'lifetime' ? 'Get Lifetime Creator ($79)' : 'Get Pro Pass ($19)'}</span>
        </span>
      )}
    </a>
  );
};

export default GumroadOverlayButton;
