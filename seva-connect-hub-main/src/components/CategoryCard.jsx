import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CategoryCard = ({ category }) => {
  return (
    <Link 
      to={`/ngos?category=${category.id}`}
      className="card-elevated p-6 group cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
          {category.icon}
        </div>
        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </div>
      
      <h3 className="font-display text-lg font-semibold text-foreground mb-2">
        {category.name}
      </h3>
      <p className="text-muted-foreground text-sm">
        {category.description}
      </p>
    </Link>
  );
};

export default CategoryCard;
