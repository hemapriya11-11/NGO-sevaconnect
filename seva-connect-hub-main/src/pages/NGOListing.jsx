import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import NGOCard from '../components/NGOCard.jsx';
import SearchFilters from '../components/SearchFilters.jsx';

const NGOListing = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  
  const [filters, setFilters] = useState({
    search: '',
    category: initialCategory,
    location: ''
  });

  const [ngos, setNgos] = useState([]);

  useEffect(() => {
    const fetchNGOs = async () => {
      try {
        const response = await fetch('/api/ngos?status=approved');
        const data = await response.json();
        setNgos(data);
      } catch (error) {
        console.error('Failed to fetch NGOs', error);
      }
    };
    fetchNGOs();
  }, []);

  const filteredNGOs = useMemo(() => {
    return ngos.filter(ngo => {
      // Only show approved NGOs
      if (ngo.status !== 'approved') return false;

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          (ngo.ngoName && ngo.ngoName.toLowerCase().includes(searchLower)) ||
          (ngo.mission && ngo.mission.toLowerCase().includes(searchLower)) ||
          (ngo.services && ngo.services.some(s => s.toLowerCase().includes(searchLower)));
        if (!matchesSearch) return false;
      }

      // Category filter
      if (filters.category && ngo.category !== filters.category) {
        return false;
      }

      // Location filter
      if (filters.location) {
        const matchesLocation = ngo.areasOfOperation?.some(area => 
          filters.location.toLowerCase().includes(area.toLowerCase()) ||
          area.toLowerCase().includes(filters.location.toLowerCase())
        );
        if (!matchesLocation) return false;
      }

      return true;
    });
  }, [filters]);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="bg-primary py-16">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="w-8 h-8 text-secondary" />
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary-foreground">
              Find Verified NGOs
            </h1>
          </div>
          <p className="text-primary-foreground/80 text-lg max-w-2xl">
            Browse our directory of verified NGOs. Get contact details and visit them directly for offline support.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          {/* Filters */}
          <div className="mb-10">
            <SearchFilters filters={filters} setFilters={setFilters} />
          </div>

          {/* Results */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredNGOs.length}</span> verified NGOs
            </p>
          </div>

          {filteredNGOs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNGOs.map((ngo, index) => (
                <div 
                  key={ngo.id} 
                  className="animate-slide-up" 
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <NGOCard ngo={ngo} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Building2 className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                No NGOs Found
              </h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or search terms
              </p>
              <button
                onClick={() => setFilters({ search: '', category: '', location: '' })}
                className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default NGOListing;
