
import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, Phone, Mail, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Scale className="h-6 w-6 text-accent" />
              <span className="text-xl font-bold">ชนะชัย ทนายความ</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              มุ่งมั่นให้ความยุติธรรมและบริการทางกฎหมายด้วยความเป็นมืออาชีพ ซื่อสัตย์ และโปร่งใส
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-accent-light">เมนูลัด</h3>
            <ul className="space-y-2 text-slate-300 text-sm">
                <li><Link to="/" className="hover:text-white transition">หน้าแรก</Link></li>
                <li><Link to="/about" className="hover:text-white transition">เกี่ยวกับเรา</Link></li>
                <li><Link to="/services" className="hover:text-white transition">บริการของเรา</Link></li>
                <li><Link to="/glossary" className="hover:text-white transition">คลังความรู้กฎหมาย</Link></li>
                <li><Link to="/client-portal" className="hover:text-white transition font-medium text-accent">Client Portal</Link></li>
                <li><Link to="/admin/login" className="hover:text-white transition text-slate-500">สำหรับเจ้าหน้าที่ (Admin)</Link></li>
            </ul>
          </div>
          
          {/* Column 3: Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-accent-light">ติดต่อเรา</h3>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-slate-500 mt-0.5 shrink-0" />
                <span className="text-sm">123 อาคารยุติธรรม ถ.รัชดาภิเษก จตุจักร กทม. 10900</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-slate-500 shrink-0" />
                <span className="text-sm">02-123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-slate-500 shrink-0" />
                <span className="text-sm">contact@chanachai-law.com</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-accent-light">เวลาทำการ</h3>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li className="flex justify-between">
                <span>จันทร์ - ศุกร์</span>
                <span>08:30 - 17:30</span>
              </li>
              <li className="flex justify-between">
                <span>เสาร์</span>
                <span>09:00 - 12:00</span>
              </li>
              <li className="flex justify-between text-slate-500">
                <span>อาทิตย์</span>
                <span>ปิดทำการ</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-6 text-center text-slate-500 text-sm">
          <p>&copy; {year} Chana Chai Law Firm. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
