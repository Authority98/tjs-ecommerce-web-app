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
            color: color?.value === 'white' ? '#374151' : '#FFFFFF',
            border: color?.value === 'white' ? '1px solid #E5E7EB' : 'none'
          }}
        >
          {color?.name}
        </span>
      ))}
    </div>
  );
};

export default ProductTags;