
import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Gavel, HeartHandshake, Building2, BookOpen, ArrowRight, FileText } from 'lucide-react';
import { CaseType } from '../../types';
import GlossaryTooltip from '../../components/GlossaryTooltip';

const ServicesPage: React.FC = () => {
  const services = [
    {
      title: "คดีแพ่งและพาณิชย์",
      desc: (
        <>
          ให้คำปรึกษาและว่าความคดีผิดสัญญา, <GlossaryTooltip word="ละเมิด" />, <GlossaryTooltip word="กู้ยืม" />, <GlossaryTooltip word="เช่าซื้อ" />, ที่ดิน และหนี้สินต่างๆ
        </>
      ),
      icon: <Briefcase className="w-12 h-12 text-primary" />,
      color: "bg-blue-50",
      type: CaseType.CIVIL
    },
    {
      title: "คดีอาญา",
      desc: (
        <>
          ต่อสู้คดีอาญาทุกประเภท <GlossaryTooltip word="ประกันตัว" /> ร้องทุกข์กล่าวโทษ หรือขอ<GlossaryTooltip word="รอลงอาญา" /> ด้วยความยุติธรรม
        </>
      ),
      icon: <Gavel className="w-12 h-12 text-red-600" />,
      color: "bg-red-50",
      type: CaseType.CRIMINAL
    },
    {
      title: "คดีครอบครัวและมรดก",
      desc: (
        <>
          <GlossaryTooltip word="การหย่า" text="ฟ้องหย่า" />, แบ่ง<GlossaryTooltip word="สินสมรส" />, <GlossaryTooltip word="อำนาจปกครอง" text="อำนาจปกครองบุตร" />, รับรองบุตร และ<GlossaryTooltip word="ผู้จัดการมรดก" text="จัดการมรดก" />
        </>
      ),
      icon: <HeartHandshake className="w-12 h-12 text-pink-500" />,
      color: "bg-pink-50",
      type: CaseType.FAMILY
    },
    {
      title: "กฎหมายธุรกิจ",
      desc: (
        <>
          จดทะเบียนบริษัท, ร่าง<GlossaryTooltip word="สัญญา" text="สัญญาทางธุรกิจ" />, ที่ปรึกษากฎหมายประจำบริษัท, ทรัพย์สินทางปัญญา และคดี<GlossaryTooltip word="ล้มละลาย" />
        </>
      ),
      icon: <Building2 className="w-12 h-12 text-emerald-600" />,
      color: "bg-emerald-50",
      type: CaseType.CORPORATE
    }
  ];

  return (
    <div className="bg-white py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-6">ขอบเขตการให้บริการ</h1>
          <p className="text-lg text-slate-600">
            ครอบคลุมทุกมิติทางกฎหมาย ด้วยทีมงานมืออาชีพที่มีประสบการณ์เฉพาะด้าน
            เพื่อให้ท่านได้รับผลลัพธ์ที่ดีที่สุด
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {services.map((service, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-6 p-8 rounded-2xl border border-slate-100 hover:shadow-lg transition-all duration-300">
              <div className={`shrink-0 flex items-center justify-center w-20 h-20 rounded-2xl ${service.color}`}>
                {service.icon}
              </div>
              <div className="flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-slate-800 mb-3">{service.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-4 flex-grow">{service.desc}</p>
                <div className="flex items-center gap-4 mt-auto">
                    <Link 
                        to="/contact" 
                        state={{ type: service.type }}
                        className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition shadow-sm"
                    >
                        <FileText className="w-4 h-4 mr-2" />
                        ขอใบเสนอราคา
                    </Link>
                    <button className="text-primary font-medium hover:text-primary-dark hover:underline text-sm">
                        อ่านเพิ่มเติม
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Glossary Integration Info */}
        <div className="mt-16 bg-gradient-to-r from-slate-50 to-white rounded-2xl p-8 border border-slate-200 flex flex-col md:flex-row items-center gap-6 shadow-sm">
            <div className="bg-white p-4 rounded-full shadow-sm text-primary">
                <BookOpen className="w-8 h-8" />
            </div>
            <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold text-slate-900 mb-2">คำศัพท์กฎหมายน่ารู้</h3>
                <p className="text-slate-600">
                    ท่านสามารถนำเมาส์ไปวางบนคำที่มีเส้นประ (เช่น <GlossaryTooltip word="นิติกรรม" />) เพื่อดูความหมายของคำศัพท์ทางกฎหมายได้ทันที หรือค้นหาคำศัพท์เพิ่มเติมได้ที่คลังความรู้
                </p>
            </div>
            <Link to="/glossary" className="flex items-center gap-2 text-primary font-semibold hover:underline bg-white px-6 py-3 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all whitespace-nowrap">
                ดูคำศัพท์ทั้งหมด <ArrowRight className="w-4 h-4" />
            </Link>
        </div>

      </div>
    </div>
  );
};

export default ServicesPage;
