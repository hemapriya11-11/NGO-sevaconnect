import { Link } from 'react-router-dom';
import {
  Search, Building2, MapPin, ArrowRight, Shield,
  Heart, Phone, CheckCircle, ChevronRight, Globe,
  Users, Eye, BookOpen, Leaf, Baby, Zap, HandHeart,
  Utensils
} from 'lucide-react';
import heroImage from '../assets/hero-image.jpg';
import { useState, useEffect, useRef } from 'react';
import { categories } from '../data/mockData';
import NGOCard from '../components/NGOCard.jsx';

/* ── Count-up hook ── */
const useCountUp = (target, duration = 1800) => {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      const t0 = performance.now();
      const tick = (now) => {
        const p = Math.min((now - t0) / duration, 1);
        const ease = p < .5 ? 2*p*p : -1+(4-2*p)*p;
        setVal(Math.floor(ease * target));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration]);
  return [val, ref];
};

const StatCard = ({ value, suffix, label, icon: Icon }) => {
  const [count, ref] = useCountUp(value);
  return (
    <div ref={ref} className="card-elevated p-6 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div>
        <div className="text-2xl font-bold text-foreground font-display tabular-nums">
          {count.toLocaleString()}{suffix}
        </div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
    </div>
  );
};

/* Category color palette — maps category.id to a Tailwind-compatible set */
const CAT_STYLES = [
  { bg: 'bg-blue-50',   border: 'border-blue-200',   icon: 'bg-blue-600',   title: 'text-blue-900',   sub: 'text-blue-600'   },
  { bg: 'bg-teal-50',   border: 'border-teal-200',   icon: 'bg-teal-700',   title: 'text-teal-900',   sub: 'text-teal-700'   },
  { bg: 'bg-amber-50',  border: 'border-amber-200',  icon: 'bg-amber-700',  title: 'text-amber-900',  sub: 'text-amber-700'  },
  { bg: 'bg-rose-50',   border: 'border-rose-200',   icon: 'bg-rose-700',   title: 'text-rose-900',   sub: 'text-rose-700'   },
  { bg: 'bg-violet-50', border: 'border-violet-200', icon: 'bg-violet-700', title: 'text-violet-900', sub: 'text-violet-700' },
  { bg: 'bg-green-50',  border: 'border-green-200',  icon: 'bg-green-700',  title: 'text-green-900',  sub: 'text-green-700'  },
  { bg: 'bg-pink-50',   border: 'border-pink-200',   icon: 'bg-pink-700',   title: 'text-pink-900',   sub: 'text-pink-700'   },
  { bg: 'bg-slate-50',  border: 'border-slate-200',  icon: 'bg-slate-600',  title: 'text-slate-900',  sub: 'text-slate-600'  },
];

const CAT_ICONS = [BookOpen, Heart, Utensils, Users, Baby, Leaf, HandHeart, Zap];

const CategoryCard = ({ category, index }) => {
  const style = CAT_STYLES[index % CAT_STYLES.length];
  const Icon  = category.icon
    ? null
    : CAT_ICONS[index % CAT_ICONS.length];

  return (
    <Link
      to={`/ngos?category=${category.id}`}
      className={`
        group relative flex flex-col gap-4 p-6 rounded-2xl border
        ${style.bg} ${style.border}
        hover:-translate-y-1.5 hover:shadow-lg
        transition-all duration-200 cursor-pointer no-underline overflow-hidden
      `}
    >
      {/* Decorative blob */}
      <div className={`
        absolute -bottom-5 -right-5 w-24 h-24 rounded-full opacity-10
        ${style.icon} transition-transform duration-300 group-hover:scale-125
      `} />

      {/* Icon */}
      <div className={`w-12 h-12 rounded-xl ${style.icon} flex items-center justify-center flex-shrink-0 relative z-10`}>
        {Icon
          ? <Icon className="w-6 h-6 text-white" />
          : <span className="text-xl">{category.emoji ?? '🏷️'}</span>
        }
      </div>

      {/* Text */}
      <div className="relative z-10">
        <div className={`font-bold text-sm leading-snug mb-1 ${style.title}`}>
          {category.name}
        </div>
        <div className={`text-xs font-medium ${style.sub}`}>
          {category.count ?? category.ngoCount ?? '—'} NGOs
        </div>
      </div>

      {/* Arrow */}
      <div className={`
        absolute bottom-4 right-4 w-7 h-7 rounded-full ${style.icon}
        flex items-center justify-center
        opacity-0 translate-x-1 translate-y-1
        group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0
        transition-all duration-200 z-10
      `}>
        <ChevronRight className="w-3.5 h-3.5 text-white" />
      </div>
    </Link>
  );
};

/* Steps */
const STEPS = [
  { icon: Search,    num: '01', title: 'Search & Discover', desc: 'Browse NGOs by category, location, or service — sign in to access.' },
  { icon: Users,     num: '02', title: 'Review Profiles',   desc: 'Access verified profiles, services, contact info, and ratings.' },
  { icon: MapPin,    num: '03', title: 'Connect & Visit',   desc: 'Call directly or visit in person with the address and phone on every listing.' },
];

const Home = () => {
  const [featuredNGOs, setFeaturedNGOs] = useState([]);

  useEffect(() => {
    fetch('/api/ngos?status=approved')
      .then(r => r.json())
      .then(d => setFeaturedNGOs(d.slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <div className="animate-fade-in">

      {/* ══════════════════════════════════════
          HERO — matches bg-primary header like dashboard
      ══════════════════════════════════════ */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-primary">

        {/* Hero image with overlay */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Community support"
            className="w-full h-full object-cover object-center opacity-40"
          />
          {/* subtle pattern overlay */}
          <div className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
              backgroundSize: '32px 32px',
              color: 'white'
            }}
          />
        </div>

        {/* Content */}
        <div className="relative container-custom px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="max-w-3xl animate-slide-up">

            {/* Eyebrow badge — like dashboard status badge */}
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8
              bg-secondary/20 text-secondary border border-secondary/30">
              <Shield className="w-4 h-4" />
              Trusted Platform for Verified NGOs
            </span>

            {/* Headline */}
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-[1.0] tracking-tight">
              Connecting<br />
              <span className="text-secondary italic">Communities</span><br />
              with NGOs
            </h1>

            <p className="text-primary-foreground/70 text-lg sm:text-xl mb-8 leading-relaxed max-w-xl">
              Discover verified non-governmental organisations across India.
              Access contact details, services and addresses —{' '}
              <strong className="text-primary-foreground font-semibold">sign in to view details.</strong>
            </p>

            {/* Trust chips */}
            <div className="flex flex-wrap gap-3 mb-10">
              {[
                { icon: CheckCircle, text: '500+ Verified NGOs' },
                { icon: MapPin,      text: '50+ Cities' },
                { icon: Globe,       text: 'Always Free' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-primary-foreground/65 text-sm">
                  <Icon className="w-4 h-4 text-secondary" />
                  {text}
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/ngos"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl
                  bg-secondary text-secondary-foreground font-bold text-base
                  hover:bg-secondary/90 hover:-translate-y-0.5 hover:shadow-xl
                  transition-all duration-200 shadow-lg"
              >
                <Search className="w-5 h-5" />
                Find NGOs Near You
              </Link>
              <Link
                to="/register-ngo"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl
                  bg-primary-foreground/10 text-primary-foreground font-semibold text-base border border-primary-foreground/20
                  hover:bg-primary-foreground/18 hover:-translate-y-0.5
                  transition-all duration-200 backdrop-blur-sm"
              >
                <Building2 className="w-5 h-5" />
                Register Your NGO
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ══════════════════════════════════════
          STATS ROW — card-elevated like dashboard quick stats
      ══════════════════════════════════════ */}
      <section className="bg-background">
        <div className="container-custom px-4 sm:px-6 lg:px-8 -mt-8 pb-0 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard value={500}   suffix="+" label="Verified NGOs"   icon={Shield} />
            <StatCard value={50}    suffix="+" label="Cities Covered"   icon={MapPin} />
            <StatCard value={10000} suffix="+" label="People Helped"    icon={Heart}  />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════ */}
      <section className="section-padding bg-background">
        <div className="container-custom px-4 sm:px-6 lg:px-8">

          {/* Section header */}
          <div className="mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Simple Process</p>
            <h2 className="font-display text-4xl font-bold text-foreground mb-3 leading-tight">How It Works</h2>
            <p className="text-muted-foreground max-w-md">
              Sign in to browse, find, and connect with verified NGOs in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((step, i) => (
              <div
                key={step.title}
                className="card-elevated p-8 group hover:-translate-y-1 hover:shadow-xl transition-all duration-200 animate-slide-up relative overflow-hidden"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Ghost step number */}
                <span className="absolute top-4 right-6 font-display text-7xl font-black text-primary/5 leading-none select-none">
                  {step.num}
                </span>

                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-5">Step {step.num}</p>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5
                  group-hover:bg-primary group-hover:scale-110 transition-all duration-200">
                  <step.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors duration-200" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          BROWSE BY FOCUS AREA — redesigned categories
      ══════════════════════════════════════ */}
      <section className="section-padding bg-accent/40">
        <div className="container-custom px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Focus Areas</p>
              <h2 className="font-display text-4xl font-bold text-foreground mb-2 leading-tight">
                Browse by<br className="sm:hidden" /> Focus Area
              </h2>
              <p className="text-muted-foreground text-sm">Find NGOs working in causes that matter to you</p>
            </div>
            <Link
              to="/ngos"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary
                border-b border-primary/40 pb-0.5 hover:gap-3 transition-all duration-150"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Category grid — 4 col desktop, 2 col tablet, 1 col mobile */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.07}s` }}
              >
                <CategoryCard category={category} index={index} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURED NGOs
      ══════════════════════════════════════ */}
      {featuredNGOs.length > 0 && (
        <section className="section-padding bg-background">
          <div className="container-custom px-4 sm:px-6 lg:px-8">

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Featured</p>
                <h2 className="font-display text-4xl font-bold text-foreground mb-2 leading-tight">Verified NGOs</h2>
                <p className="text-muted-foreground text-sm">Independently verified by our team</p>
              </div>
              <Link
                to="/ngos"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary
                  border-b border-primary/40 pb-0.5 hover:gap-3 transition-all duration-150"
              >
                View All NGOs <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredNGOs.map((ngo, index) => (
                <div
                  key={ngo._id || index}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.12}s` }}
                >
                  <NGOCard ngo={ngo} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          TRUST PILLARS — card-elevated like dashboard
      ══════════════════════════════════════ */}
      <section className="section-padding bg-accent/40 border-t border-border">
        <div className="container-custom px-4 sm:px-6 lg:px-8">

          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Why SevaConnect</p>
            <h2 className="font-display text-4xl font-bold text-foreground mb-2 leading-tight">
              Built on Trust
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: 'Independent Verification',
                desc: 'Every NGO undergoes a structured verification process — documents, leadership, and services — before appearing on the platform.',
                color: 'bg-primary/10',
                iconColor: 'text-primary',
              },
              {
                icon: Heart,
                title: 'Free for Everyone',
                desc: 'SevaConnect is 100% free for both users and NGOs. No subscriptions, no hidden fees, no ads — ever.',
                color: 'bg-secondary/15',
                iconColor: 'text-secondary',
              },
              {
                icon: Phone,
                title: 'Offline-Ready',
                desc: 'Every listing includes a phone number and physical address so you can get help even without internet access.',
                color: 'bg-accent',
                iconColor: 'text-accent-foreground',
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className="card-elevated p-8 group hover:-translate-y-1 hover:shadow-xl transition-all duration-200"
              >
                <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-5
                  group-hover:scale-110 transition-transform duration-200`}>
                  <item.icon className={`w-6 h-6 ${item.iconColor}`} />
                </div>
                <h3 className="font-semibold text-foreground text-base mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA BANNER — bg-primary like dashboard header
      ══════════════════════════════════════ */}
      <section className="bg-primary py-20 relative overflow-hidden">
        {/* Pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '28px 28px',
            color: 'white'
          }}
        />

        <div className="relative container-custom px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">

              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                  bg-secondary/20 text-secondary border border-secondary/30 text-xs font-bold uppercase tracking-wider mb-6">
                  <Building2 className="w-3.5 h-3.5" />
                  For NGOs
                </div>
                <h2 className="font-display text-4xl sm:text-5xl font-bold text-primary-foreground mb-4 leading-tight">
                  Are You an NGO?<br />
                  <span className="text-secondary italic">Join SevaConnect.</span>
                </h2>
                <p className="text-primary-foreground/65 text-base leading-relaxed max-w-md">
                  Register your organisation to reach thousands of people across India who need your help.
                  Get independently verified — completely free.
                </p>
              </div>

              <div className="flex flex-col gap-3 flex-shrink-0">
                <Link
                  to="/register-ngo"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl
                    bg-secondary text-secondary-foreground font-bold text-base
                    hover:bg-secondary/90 hover:-translate-y-0.5 hover:shadow-xl
                    transition-all duration-200 shadow-lg"
                >
                  <Building2 className="w-5 h-5" />
                  Register Your NGO
                </Link>
                <Link
                  to="/ngos"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl
                    bg-primary-foreground/10 text-primary-foreground font-semibold text-base border border-primary-foreground/20
                    hover:bg-primary-foreground/18 hover:-translate-y-0.5
                    transition-all duration-200"
                >
                  <Search className="w-5 h-5" />
                  Explore NGOs
                </Link>

                {/* Trust row below buttons */}
                <div className="flex flex-wrap gap-4 mt-2">
                  {['Free Forever', 'Verified Listings', 'Pan India'].map(label => (
                    <div key={label} className="flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-secondary" />
                      <span className="text-primary-foreground/50 text-xs font-medium">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          OFFLINE STRIP
      ══════════════════════════════════════ */}
      <section className="bg-background border-t border-border py-6">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-foreground text-sm">Prefer Offline Help?</div>
                <div className="text-muted-foreground text-xs mt-0.5">
                  Every listing has a phone number & address — no internet needed
                </div>
              </div>
            </div>

            <Link
              to="/ngos"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                bg-primary text-primary-foreground font-semibold text-sm
                hover:bg-primary/90 hover:-translate-y-0.5 transition-all duration-200 flex-shrink-0"
            >
              Find NGOs with Offline Support
              <ArrowRight className="w-4 h-4" />
            </Link>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;