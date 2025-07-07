import React from 'react';
import { Sparkles } from 'lucide-react';
import { Product, PRODUCT_COLORS } from '../types';

interface ProductTagsProps {
  product: Product;
}

const ProductTags: React.FC<ProductTagsProps> = ({ product }) => {
  const getProductColors = () => {
    if (!product?.color) return [];
    const colorValues = product.color.split(',');
    return colorValues.map(value => 
      PRODUCT_COLORS.find(c => c.value === value.trim())
    ).filter(Boolean);
  };

  const isLightColor = (hex: string) => {
    // Remove # if present
    const color = hex.replace('#', '');
    
    // Convert to RGB
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    
    // Calculate brightness using YIQ formula
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // If brightness > 128, it's a light color
    return brightness > 128;
  };

  const getTextColor = (backgroundColor: string) => {
    return isLightColor(backgroundColor) ? '#374151' : '#FFFFFF';
  };

  const productColors = getProductColors();

  return (
    <div className="flex flex-wrap gap-2 mb-2">
      {product.decorated && (
        <span className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full px-2 py-1 shadow-md text-xs font-bold text-white">
          <Sparkles className="h-3 w-3 text-white" />
          <span>Decorated</span>
        </span>
      )}
      {productColors.length > 0 && productColors.map(color => (
        <span
          key={color?.value}
          className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium shadow-sm"
          style={{
            backgroundColor: color?.hex,
            color: getTextColor(color?.hex || '#000000'),
            border: isLightColor(color?.hex || '#000000') ? '1px solid #E5E7EB' : 'none'
          }}
        >
          {color?.name}
        </span>
      ))}
    </div>
  );
};

export default ProductTags;