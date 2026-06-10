import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, MapPin } from 'lucide-react';

const PHILIPPINES_CITIES = {
  'Luzon (72 Cities)': {
    'National Capital Region (Metro Manila)': ['Caloocan', 'Las Piñas', 'Makati', 'Malabon', 'Mandaluyong', 'Manila', 'Marikina', 'Muntinlupa', 'Navotas', 'Parañaque', 'Pasay', 'Pasig', 'Quezon City', 'San Juan', 'Taguig', 'Valenzuela'],
    'Region I (Ilocos Region)': ['Alaminos', 'Batac', 'Candon', 'Dagupan', 'Laoag', 'San Fernando (La Union)', 'Urdaneta', 'Vigan'],
    'Cordillera Administrative Region (CAR)': ['Baguio', 'Tabuk'],
    'Region II (Cagayan Valley)': ['Cauayan', 'Ilagan', 'Santiago', 'Tuguegarao'],
    'Region III (Central Luzon)': ['Angeles', 'Balanga', 'Baliwag', 'Cabanatuan', 'Gapan', 'Mabalacat', 'Malolos', 'Meycauayan', 'Muñoz', 'Olongapo', 'Palayan', 'San Fernando (Pampanga)', 'San Jose', 'San Jose del Monte', 'Tarlac City'],
    'Region IV-A (Calabarzon)': ['Antipolo', 'Bacoor', 'Biñan', 'Cabuyao', 'Calamba', 'Carmona', 'Cavite City', 'Dasmariñas', 'General Trias', 'Imus', 'Lipa', 'San Pablo', 'San Pedro', 'Santa Rosa', 'Santo Tomas', 'Tagaytay', 'Tanauan', 'Trece Martires'],
    'Region IV-B (Mimaropa)': ['Calapan', 'Puerto Princesa'],
    'Region V (Bicol Region)': ['Iriga', 'Legazpi', 'Ligao', 'Masbate City', 'Naga', 'Sorsogon City', 'Tabaco'],
  },
  'Visayas (39 Cities)': {
    'Region VI (Western Visayas)': ['Bacolod', 'Bago', 'Cadiz', 'Escalante', 'Himamaylan', 'Iloilo City', 'Kabankalan', 'La Carlota', 'Passi', 'Roxas City', 'Sagay', 'San Carlos (Negros Occidental)', 'Silay', 'Sipalay', 'Talisay (Negros Occidental)', 'Victorias'],
    'Region VII (Central Visayas)': ['Bais', 'Bayawan', 'Canlaon', 'Carcar', 'Cebu City', 'Danao', 'Dumaguete', 'Guihulngan', 'Lapu-Lapu', 'Mandaue', 'Naga (Cebu)', 'Tagbilaran', 'Talisay (Cebu)', 'Toledo', 'Tanjay'],
    'Region VIII (Eastern Visayas)': ['Baybay', 'Borongan', 'Calbayog', 'Catbalogan', 'Maasin', 'Ormoc', 'Tacloban'],
  },
  'Mindanao (38 Cities)': {
    'Region IX (Zamboanga Peninsula)': ['Dapitan', 'Dipolog', 'Isabela (Basilan)', 'Pagadian', 'Zamboanga City'],
    'Region X (Northern Mindanao)': ['Cagayan de Oro', 'El Salvador', 'Gingoog', 'Iligan', 'Malaybalay', 'Oroquieta', 'Ozamiz', 'Tangub', 'Valencia'],
    'Region XI (Davao Region)': ['Davao City', 'Digos', 'Mati', 'Panabo', 'Samal', 'Tagum'],
    'Region XII (Soccsksargen)': ['General Santos', 'Kidapawan', 'Koronadal', 'Tacurong'],
    'Region XIII (Caraga)': ['Bayugan', 'Butuan', 'Cabadbaran', 'Surigao City', 'Tandag'],
    'Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)': ['Cotabato City', 'Lamitan', 'Marawi'],
  }
};

export default function CitySearchModal({ onClose, onSelect }) {
  const [search, setSearch] = useState('');
  const [expandedIsland, setExpandedIsland] = useState(null);
  const [expandedRegion, setExpandedRegion] = useState(null);

  const filterCities = () => {
    const results = [];
    Object.entries(PHILIPPINES_CITIES).forEach(([island, regions]) => {
      Object.entries(regions).forEach(([region, cities]) => {
        cities.forEach(city => {
          if (city.toLowerCase().includes(search.toLowerCase())) {
            results.push({ island, region, city });
          }
        });
      });
    });
    return results;
  };

  const filteredCities = search ? filterCities() : null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl max-h-[80vh] overflow-hidden rounded-2xl"
          style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.3)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#00D4FF]" />
              <h2 className="font-heading font-bold text-white text-lg">Select City</h2>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search cities..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl font-body text-sm text-white focus:outline-none focus:border-[#00D4FF]"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
                autoFocus
              />
            </div>
          </div>

          {/* City List */}
          <div className="overflow-y-auto max-h-[50vh] p-4">
            {search ? (
              filteredCities?.length === 0 ? (
                <p className="text-white/40 text-sm text-center py-8">No cities found</p>
              ) : (
                <div className="space-y-4">
                  {filteredCities.map(({ island, region, city }, idx) => (
                    <button
                      key={idx}
                      onClick={() => { onSelect(city); onClose(); }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left"
                    >
                      <div className="flex-1">
                        <p className="font-body text-sm font-semibold text-white">{city}</p>
                        <p className="font-body text-xs text-white/40">{region} · {island}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )
            ) : (
              Object.entries(PHILIPPINES_CITIES).map(([island, regions]) => (
                <div key={island} className="mb-4">
                  <button
                    onClick={() => setExpandedIsland(expandedIsland === island ? null : island)}
                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors mb-2"
                  >
                    <span className="font-heading font-bold text-white text-sm">{island}</span>
                  </button>
                  
                  {(expandedIsland === island || !expandedIsland) && (
                    <div className="ml-4 space-y-2">
                      {Object.entries(regions).map(([region, cities]) => (
                        <div key={region} className="ml-4">
                          <button
                            onClick={() => setExpandedRegion(expandedRegion === region ? null : region)}
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors mb-1"
                          >
                            <span className="font-body text-xs font-semibold text-white/70">{region}</span>
                            <span className="font-body text-[10px] text-white/40">({cities.length} cities)</span>
                          </button>
                          
                          {(expandedRegion === region || !expandedRegion) && (
                            <div className="ml-4 grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                              {cities.map(city => (
                                <button
                                  key={city}
                                  onClick={() => { onSelect(city); onClose(); }}
                                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#00D4FF]/10 transition-colors text-left"
                                >
                                  <MapPin className="w-3 h-3 text-[#00D4FF]" />
                                  <span className="font-body text-xs text-white/80">{city}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}