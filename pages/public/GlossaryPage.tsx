
import React, { useState } from 'react';
import { Search, Book, Scale, Gavel, FileText, Users, Bookmark } from 'lucide-react';
import { glossaryTerms } from '../../data/glossaryData';

const GlossaryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'General', 'Civil', 'Criminal', 'Family', 'Business'];

  const filteredTerms = glossaryTerms.filter(term => {
    const matchesSearch = term.word.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          term.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Civil': return <Scale className="w-4 h-4" />;
      case 'Criminal': return <Gavel className="w-4 h-4" />;
      case 'Family': return <Users className="w-4 h-4" />;
      case 'Business': return <FileText className="w-4 h-4" />;
      default: return <Book className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Civil': return 'bg-blue-100 text-blue-700';
      case 'Criminal': return 'bg-red-100 text-red-700';
      case 'Family': return 'bg-pink-100 text-pink-700';
      case 'Business': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4 flex items-center justify-center gap-3">
            <Bookmark className="w-10 h-10 text-primary" />
            คลังความรู้ทางกฎหมาย
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            รวบรวมคำศัพท์และนิยามทางกฎหมายที่พบบ่อย เพื่อความเข้าใจเบื้องต้นสำหรับประชาชนทั่วไป
          </p>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ค้นหาคำศัพท์..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat 
                      ? 'bg-primary text-white shadow-md' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'All' ? 'ทั้งหมด' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Terms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTerms.length > 0 ? (
            filteredTerms.map((term, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all group animate-in fade-in duration-500">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                    {term.word}
                  </h3>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(term.category)}`}>
                    {getCategoryIcon(term.category)}
                    {term.category}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {term.definition}
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-slate-200 text-slate-500">
              ไม่พบคำศัพท์ที่ค้นหา
            </div>
          )}
        </div>

        <div className="mt-12 p-6 bg-blue-50 rounded-xl border border-blue-100 text-center">
            <p className="text-blue-800 text-sm">
                <strong>หมายเหตุ:</strong> คำนิยามเหล่านี้จัดทำขึ้นเพื่อความเข้าใจเบื้องต้นเท่านั้น ไม่สามารถใช้อ้างอิงในทางอรรถคดีได้อย่างเป็นทางการ หากมีข้อสงสัยเกี่ยวกับกฎหมาย โปรดปรึกษาทนายความ
            </p>
        </div>

      </div>
    </div>
  );
};

export default GlossaryPage;
