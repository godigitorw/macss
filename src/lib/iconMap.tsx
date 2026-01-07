import {
  FiHome,
  FiMapPin,
  FiShoppingBag,
  FiBriefcase,
  FiPackage,
  FiTrendingUp,
  FiGrid,
  FiMap,
  FiLayers,
  FiSquare,
  FiBox,
  FiArchive,
  FiShoppingCart,
  FiTruck,
  FiAnchor,
} from 'react-icons/fi';

export const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  FiHome,
  FiMapPin,
  FiShoppingBag,
  FiBriefcase,
  FiPackage,
  FiTrendingUp,
  FiGrid,
  FiMap,
  FiLayers,
  FiSquare,
  FiBox,
  FiArchive,
  FiShoppingCart,
  FiTruck,
  FiAnchor,
};

export const availableIcons = [
  { name: 'FiHome', label: 'Home' },
  { name: 'FiGrid', label: 'Building' },
  { name: 'FiMapPin', label: 'Map Pin' },
  { name: 'FiShoppingBag', label: 'Shopping Bag' },
  { name: 'FiBriefcase', label: 'Briefcase' },
  { name: 'FiPackage', label: 'Package' },
  { name: 'FiTrendingUp', label: 'Trending Up' },
  { name: 'FiMap', label: 'Map' },
  { name: 'FiLayers', label: 'Layers' },
  { name: 'FiSquare', label: 'Square' },
  { name: 'FiBox', label: 'Box' },
  { name: 'FiArchive', label: 'Archive' },
  { name: 'FiShoppingCart', label: 'Shopping Cart' },
  { name: 'FiTruck', label: 'Truck' },
  { name: 'FiAnchor', label: 'Anchor' },
];

export const getIconComponent = (iconName: string | null): React.ComponentType<{ className?: string }> => {
  if (!iconName || !iconMap[iconName]) {
    return FiHome; // Default fallback
  }
  return iconMap[iconName];
};
