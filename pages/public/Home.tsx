import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ShieldCheck, Scale, Users, BookOpen } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/1920/1080?grayscale&blur=2" 
            alt="Law office background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              สำนักงานกฎหมาย<br/>
              <span className="text-accent">ชนะชัย ทนายความ</span>
            </h1>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
              เรามุ่งมั่นในการให้บริการทางกฎหมายที่มีคุณภาพ ซื่อสัตย์ และเป็นธรรม 
              ดูแลทุกคดีด้วยความเอาใจใส่และมืออาชีพ
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/contact" 
                className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-slate-900 bg-accent hover:bg-accent-light transition-colors"
              >
                ปรึกษาทนายความ
              </Link>
              <Link 
                to="/services" 
                className="inline-flex justify-center items-center px-6 py-3 border border-slate-500 text-base font-medium rounded-md text-white hover:bg-white/10 transition-colors"
              >
                บริการของเรา
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features / Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">ทำไมต้องเลือกชนะชัย?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              ประสบการณ์กว่า 20 ปีในการว่าความและการให้คำปรึกษาทางกฎหมาย คือเครื่องพิสูจน์ความสำเร็จของเรา
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-primary/10 w-14 h-14 rounded-lg flex items-center justify-center mb-6 text-primary">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">เชี่ยวชาญและแม่นยำ</h3>
              <p className="text-slate-600">ทีมทนายความที่มีความเชี่ยวชาญเฉพาะด้าน พร้อมวิเคราะห์ข้อกฎหมายอย่างละเอียด</p>
            </div>

            <div className="bg-slate-50 p-8 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-primary/10 w-14 h-14 rounded-lg flex items-center justify-center mb-6 text-primary">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">ดูแลดุจญาติมิตร</h3>
              <p className="text-slate-600">เราให้ความสำคัญกับลูกความทุกท่าน พร้อมรับฟังและแก้ไขปัญหาด้วยความเข้าใจ</p>
            </div>

            <div className="bg-slate-50 p-8 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-primary/10 w-14 h-14 rounded-lg flex items-center justify-center mb-6 text-primary">
                <Scale className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">โปร่งใส ยุติธรรม</h3>
              <p className="text-slate-600">ชัดเจนในค่าใช้จ่ายและขั้นตอนการดำเนินงาน ยึดมั่นในจรรยาบรรณวิชาชีพ</p>
            </div>
          </div>
        </div>
      </section>

      {/* Glossary Promo Section */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1 text-center md:text-left">
                 <div className="inline-flex items-center gap-2 text-primary font-bold mb-2 justify-center md:justify-start w-full">
                    <BookOpen className="w-5 h-5" />
                    <span className="uppercase tracking-wider text-sm">Legal Knowledge</span>
                 </div>
                 <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">คลังความรู้ทางกฎหมาย</h2>
                 <p className="text-slate-600 leading-relaxed max-w-2xl">
                    เรารวบรวมคำศัพท์และนิยามทางกฎหมายที่สำคัญ เพื่อให้ท่านเข้าใจสิทธิและหน้าที่ของตนเองได้ดียิ่งขึ้น 
                    ศึกษาข้อมูลเบื้องต้นก่อนรับคำปรึกษา
                 </p>
              </div>
              <div className="shrink-0">
                 <Link 
                   to="/glossary" 
                   className="inline-flex items-center justify-center px-6 py-3 border border-slate-300 text-base font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 hover:text-primary hover:border-primary transition-all shadow-sm"
                 >
                   ค้นหาคำศัพท์ <ArrowRight className="ml-2 w-5 h-5" />
                 </Link>
              </div>
           </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="bg-primary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-8 md:mb-0 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">ต้องการความช่วยเหลือทางกฎหมายด่วน?</h2>
            <p className="text-blue-200">ทีมงานของเราพร้อมให้คำปรึกษาเบื้องต้นฟรี ผ่านระบบ AI หรือติดต่อเจ้าหน้าที่</p>
          </div>
          <Link 
            to="/contact"
            className="inline-flex items-center bg-white text-primary px-8 py-3 rounded-md font-semibold hover:bg-slate-100 transition-colors shadow-lg"
          >
            ติดต่อเราทันที <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;