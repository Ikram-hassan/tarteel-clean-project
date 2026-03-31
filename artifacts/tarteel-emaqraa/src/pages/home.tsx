import { Link } from "wouter";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";
import { BookOpen, GraduationCap, Award, Shield, CheckCircle2, ChevronRight, Star } from "lucide-react";

import islamicPattern from "@assets/Islamic_geometric_patterns__1774916076795.jpeg";
import logoImg from "@assets/b5631c0e-bdc3-4a08-8584-9e6cbfec8cc2_1774916046934.jpg";
import instituteImg1 from "@assets/Institute_image_1_1774916086186.jpeg";

export default function Home() {
  const { t, dir } = useLanguage();

  return (
    <div className="min-h-screen bg-secondary/30" dir={dir}>
      <Navbar />

      {/* Hero Section */}
      {/* وصف القسم بالعربية: القسم الرئيسي والترحيب */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-tarteel-maroon py-20">
        <div 
          className="absolute inset-0 opacity-[0.06] bg-repeat pointer-events-none"
          style={{ backgroundImage: `url(${islamicPattern})`, backgroundSize: '400px' }}
        />
        <div className="absolute top-0 left-0 w-full h-4 bg-tarteel-gold" />
        <div className="absolute bottom-0 left-0 w-full h-4 bg-tarteel-gold" />
        
        <div className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center">
          <motion.img 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            src={logoImg} 
            alt="Logo" 
            className="w-40 h-40 md:w-56 md:h-56 rounded-full border-4 border-tarteel-gold shadow-2xl mb-8 object-cover"
          />
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white max-w-5xl leading-tight mb-8"
          >
            {t('heroTagline')}
          </motion.h1>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <Button asChild size="lg" className="bg-[#E07B39] hover:bg-[#E07B39]/90 text-white px-10 py-8 text-xl rounded-full shadow-xl">
              <Link href="/register">{t('startLearning')}</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* How to Register */}
      {/* وصف القسم بالعربية: كيفية التسجيل */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-tarteel-maroon mb-4">{t('howToRegister')}</h2>
            <div className="w-24 h-1.5 bg-tarteel-gold mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: t('step1'), desc: "Select Student or Teacher" },
              { icon: BookOpen, title: t('step2'), desc: "Complete your profile" },
              { icon: CheckCircle2, title: t('step3'), desc: "Admin verification" },
              { icon: GraduationCap, title: t('step4'), desc: "Join your classes" },
            ].map((step, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={i}
                className="relative flex flex-col items-center text-center group"
              >
                <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-6 border-2 border-tarteel-gold group-hover:bg-tarteel-gold group-hover:text-white transition-colors duration-300">
                  <step.icon size={40} className="text-tarteel-maroon group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold text-tarteel-maroon mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.desc}</p>
                {i < 3 && <ChevronRight className="hidden md:block absolute top-12 -right-8 text-tarteel-gold/50" size={32} />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Levels */}
      {/* وصف القسم بالعربية: مستويات التعلم */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-tarteel-maroon mb-4">{t('learningLevels')}</h2>
            <div className="w-24 h-1.5 bg-tarteel-gold mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-t-4 border-t-[#E07B39] shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-8 flex flex-col items-center text-center">
                <BookOpen size={48} className="text-[#E07B39] mb-6" />
                <h3 className="text-2xl font-bold text-tarteel-maroon mb-4">{t('beginner')}</h3>
                <p className="text-muted-foreground mb-6">Foundational rules of Tajweed and correct pronunciation of letters.</p>
                <ul className="space-y-2 text-left w-full text-sm text-foreground/80">
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-tarteel-gold" /> Makharij Al-Huroof</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-tarteel-gold" /> Sifat Al-Huroof</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-tarteel-gold" /> Ahkam Al-Nun & Mim</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-tarteel-gold shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-tarteel-gold text-white text-xs font-bold px-3 py-1 rounded-full uppercase">Popular</div>
              <CardContent className="pt-8 flex flex-col items-center text-center">
                <GraduationCap size={48} className="text-tarteel-gold mb-6" />
                <h3 className="text-2xl font-bold text-tarteel-maroon mb-4">{t('intermediate')}</h3>
                <p className="text-muted-foreground mb-6">6 intensive levels of memorization (Hifz) and consistent review using the Saba' system.</p>
                <ul className="space-y-2 text-left w-full text-sm text-foreground/80">
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-tarteel-gold" /> Daily New Hifz</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-tarteel-gold" /> Recent Review (Saba')</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-tarteel-gold" /> Old Review</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-tarteel-maroon shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-8 flex flex-col items-center text-center">
                <Award size={48} className="text-tarteel-maroon mb-6" />
                <h3 className="text-2xl font-bold text-tarteel-maroon mb-4">{t('advanced')}</h3>
                <p className="text-muted-foreground mb-6">Scholarly certification in Qira'at with a connected chain (Sanad) to the Prophet ﷺ.</p>
                <ul className="space-y-2 text-left w-full text-sm text-foreground/80">
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-tarteel-gold" /> Hafs 'an Asim</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-tarteel-gold" /> Qawa'id</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-tarteel-gold" /> Diraayah</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-tarteel-gold rounded-3xl translate-x-4 translate-y-4" />
              <img src={instituteImg1} alt="Institute" className="relative rounded-3xl object-cover w-full h-[500px] shadow-2xl z-10" />
            </div>
            <div>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-tarteel-maroon mb-6">{t('aboutUs')}</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Based in Mogadishu, Somalia, Tarteel E-Maqraa is a pioneering digital institution bringing the classical Somali Saba' memorization system to the global stage. We combine centuries of scholarly tradition with modern technology to produce exceptionally skilled students of the Quran.
              </p>
              <Button asChild variant="outline" className="border-tarteel-maroon text-tarteel-maroon hover:bg-tarteel-maroon hover:text-white px-8">
                <Link href="/institute">Discover Our History</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-tarteel-maroon text-white relative">
        <div 
          className="absolute inset-0 opacity-[0.03] bg-repeat pointer-events-none"
          style={{ backgroundImage: `url(${islamicPattern})`, backgroundSize: '400px' }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">{t('testimonials')}</h2>
            <div className="w-24 h-1.5 bg-tarteel-gold mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-white/5 border-none text-white backdrop-blur-sm">
                <CardContent className="pt-8">
                  <div className="flex gap-1 mb-6 text-tarteel-gold">
                    {[1,2,3,4,5].map(s => <Star key={s} size={20} fill="currentColor" />)}
                  </div>
                  <p className="text-white/80 text-lg italic mb-6">"An unprecedented initiative that preserves the authentic methodology of our scholars while making it accessible to students worldwide."</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-tarteel-gold/20 flex items-center justify-center font-bold text-xl">S</div>
                    <div>
                      <h4 className="font-bold">Sheikh Abdullahi</h4>
                      <p className="text-sm text-tarteel-gold">Senior Quran Scholar</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <FloatingButtons />
      <Footer />
    </div>
  );
}
