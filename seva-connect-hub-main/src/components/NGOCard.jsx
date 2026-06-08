import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { categories } from '../data/mockData';

const NGOCard = ({ ngo }) => {
  const category = categories.find(c => c.id === ngo.category);

  return (
    <div className="card-elevated overflow-hidden group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={ngo.image || category?.image} 
          alt={ngo.ngoName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/90 backdrop-blur-sm text-sm font-medium">
            <span>{category?.icon}</span>
            <span>{category?.name}</span>
          </span>
        </div>

        {/* Verified Badge */}
        {ngo.status === 'approved' && (
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-success text-success-foreground text-xs font-medium">
              <CheckCircle className="w-3.5 h-3.5" />
              Verified
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-display text-xl font-semibold text-foreground mb-2 line-clamp-1">
          {ngo.ngoName}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {ngo.mission}
        </p>

        {/* Quick Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="line-clamp-1">{ngo.areasOfOperation?.[0] || 'Unknown Region'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4 text-primary" />
            <span>{ngo.workingHours}</span>
          </div>
        </div>

        {/* Services Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {ngo.services?.slice(0, 2).map((service, index) => (
            <span 
              key={index}
              className="px-2.5 py-1 rounded-lg bg-accent text-accent-foreground text-xs font-medium"
            >
              {service}
            </span>
          ))}
          {ngo.services?.length > 2 && (
            <span className="px-2.5 py-1 rounded-lg bg-muted text-muted-foreground text-xs font-medium">
              +{ngo.services.length - 2} more
            </span>
          )}
        </div>

        {/* CTA */}
        <Link
          to={`/ngo/${ngo.id}`}
          className="inline-flex items-center gap-2 w-full justify-center px-4 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors group/btn"
        >
          <span>View Details & Contact</span>
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default NGOCard;
