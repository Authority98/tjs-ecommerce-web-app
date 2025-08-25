import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Sparkles } from 'lucide-react';
import Loader from '../components/Loader';
import PageLayout from '../components/PageLayout';

interface EventCategory {
  id: string
  name: string
  description: string
  display_order: number
  is_active: boolean
}

const EventsPage: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('event_categories')
        .select('*, event_services(*)');
      
      if (error) {
        console.error('Error fetching categories:', error);
      } else {
        setCategories(data);
      }
      setLoading(false);
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <PageLayout>
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-white mb-6" style={{fontFamily: 'Dancing Script', fontWeight: 500, fontSize: '30px', lineHeight: '39px', color: '#d9a66c'}}>
              Explore Our Events
            </h1>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-dosis">
              Event Services
            </h2>
            <p className="text-xl text-white max-w-3xl mx-auto">
              Select a category to view our event services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <div key={category.id} className="group">
                <Link to={`/events/${category.id}`}>
                  <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl border border-white/20 dark:border-gray-700/30 h-full bg-opacity-95 backdrop-blur-sm`}>
                    <div className="relative p-8 text-center">
                      <div className="mx-auto mb-6 relative flex items-center justify-center">
                        <div className={`w-24 h-24 bg-rose-500/20 rounded-3xl flex items-center justify-center shadow-lg`}>
                          <Sparkles className="h-12 w-12 text-white" />
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-white mb-4 font-dosis">
                        {category.name}
                      </h3>
                      
                      <p className="text-gray-300 leading-relaxed mb-8 px-2">
                        {category.description}
                      </p>
                      
                      <div className={`inline-flex items-center px-8 py-4 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold rounded-2xl shadow-lg`}>
                        <span>View Services</span>
                        <span className="ml-2">→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default EventsPage;