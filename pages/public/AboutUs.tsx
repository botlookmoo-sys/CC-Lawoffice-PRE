
import React from 'react';
import { Target, Heart, Shield, Award, History, Users, Scale } from 'lucide-react';

const AboutUs: React.FC = () => {
  const values = [
    {
      title: "ความซื่อสัตย์ (Integrity)",
      desc: "เรายึดมั่นในความถูกต้องและจริยธรรมวิชาชีพเป็นหัวใจสำคัญในการทำงานทุกขั้นตอน",
      icon: <Shield className="w-8 h-8 text-primary" />,
    },
    {
      title: "ความรับผิดชอบ (Accountability)",
      desc: "เราดูแลคดีของท่านอย่างเต็มกำลังความสามารถและรับผิดชอบต่อผลลัพธ์ด้วยความโปร่งใส",
      icon: <Target className="w-8 h-8 text-primary" />,
    },
    {
      title: "ความเห็นอกเห็นใจ (Empathy)",
      desc: "เราเข้าใจถึงความทุกข์ร้อนของลูกความ และพร้อมดูแลด้วยความเมตตาเหมือนคนในครอบครัว",
      icon: <Heart className="w-8 h-8 text-primary" />,
    },
  ];

  const partners = [
    {
      name: "นายชนะชัย ยุติธรรม",
      role: "ผู้ก่อตั้งและทนายความอาวุโส",
      bio: "ด้วยประสบการณ์กว่า 30 ปี ในคดีแพ่งและพาณิชย์ ท่านเป็นผูวางรากฐานและปรัชญาการทำงานที่เน้นความยุติธรรมเป็นที่ตั้งให้แก่สำนักงาน",
      img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=500",
    },
    {
      name: "นางสาววิไล รักษา",
      role: "หุ้นส่วนผู้จัดการ",
      bio: "เชี่ยวชาญกฎหมายครอบครัวและมรดก มีความละเอียดอ่อนในการจัดการปัญหาความขัดแย้งในครอบครัวและการเจรจาประนีประนอม",
      img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=500",
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-slate-900 py-24">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1920" 
            alt="Law firm background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">เกี่ยวกับเรา</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            สำนักงานกฎหมายที่มีความมุ่งมั่นในการสร้างความเป็นธรรมและให้บริการทางกฎหมายที่เป็นเลิศแก่สังคมไทย
          </p>
        </div>
      </section>

      {/* History Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-primary font-bold mb-4">
                <History className="w-5 h-5" />
                <span className="uppercase tracking-wider">Our History</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">กว่า 2 ทศวรรษแห่งความสำเร็จ</h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  สำนักงานกฎหมายชนะชัยทนายความ ก่อตั้งขึ้นในปี พ.ศ. 2545 โดยทนายชนะชัย ยุติธรรม ด้วยอุดมการณ์ที่ต้องการเห็นสำนักงานกฎหมายที่สามารถเป็นที่พึ่งพาให้กับประชาชนได้อย่างแท้จริง
                </p>
                <p>
                  จากจุดเริ่มต้นเล็กๆ ที่มีทนายความเพียง 2 ท่าน เราได้เติบโตจนกลายเป็นสำนักงานกฎหมายชั้นนำที่ได้รับความไว้วางใจจากทั้งบุคคลธรรมดาและองค์กรธุรกิจระดับประเทศ ด้วยประวัติผลงานที่โดดเด่นในการคลี่คลายคดีซับซ้อนมากกว่า 5,000 คดี
                </p>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=800" 
                alt="Law books" 
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-accent p-8 rounded-2xl hidden md:block">
                <p className="text-4xl font-bold text-slate-900">22+</p>
                <p className="text-slate-800 font-medium">ปีแห่งประสบการณ์</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">พันธกิจและค่านิยมของเรา</h2>
            <p className="text-slate-600">เราไม่ได้แค่ว่าความ แต่เราสร้างทางออกที่ยั่งยืนให้แก่ลูกความของเรา</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  {v.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{v.title}</h3>
                <p className="text-slate-600">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founding Partners */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-primary font-bold mb-4">
              <Users className="w-5 h-5" />
              <span className="uppercase tracking-wider">Founding Partners</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900">ทนายความผู้ร่วมก่อตั้ง</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {partners.map((p, i) => (
              <div key={i} className="flex flex-col md:flex-row gap-8 items-center md:items-start group">
                <div className="shrink-0 w-64 h-80 rounded-2xl overflow-hidden shadow-lg transition-transform group-hover:-translate-y-2">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-center md:text-left pt-4">
                  <h3 className="text-2xl font-bold text-slate-900 mb-1">{p.name}</h3>
                  <p className="text-primary font-bold mb-4">{p.role}</p>
                  <p className="text-slate-600 leading-relaxed italic border-l-4 border-slate-200 pl-4">
                    "{p.bio}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards/Recognition (Optional) */}
      <section className="py-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-12 grayscale opacity-50">
          <div className="flex items-center gap-2 font-bold text-slate-400">
            <Award className="w-8 h-8" />
            <span className="text-lg">ISO 9001:2015</span>
          </div>
          <div className="flex items-center gap-2 font-bold text-slate-400">
            <Shield className="w-8 h-8" />
            <span className="text-lg">สภาทนายความแห่งประเทศไทย</span>
          </div>
          <div className="flex items-center gap-2 font-bold text-slate-400">
             <Scale className="w-8 h-8" />
             <span className="text-lg">เนติบัณฑิตยสภา</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
