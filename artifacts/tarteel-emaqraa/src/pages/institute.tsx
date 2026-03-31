import { useLanguage } from "@/hooks/use-language";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";
import { motion } from "framer-motion";
import { Award, Users, BookOpen, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

import islamicPattern from "@assets/Islamic_geometric_patterns__1774916076795.jpeg";
import instituteImg1 from "@assets/Institute_image_1_1774916086186.jpeg";
import instituteImg2 from "@assets/Institute_image_2_1774916102260.jpeg";
import instituteImg3 from "@assets/Institute_image_3_1774916108862.jpeg";
import instituteImg4 from "@assets/Institute_image_4_1774916118781.jpeg";
import instituteImg5 from "@assets/Institute_image_5_1774916127589.jpeg";

export default function Institute() {
  const { t, dir } = useLanguage();

  const images = [instituteImg1, instituteImg2, instituteImg3, instituteImg4, instituteImg5];

  return (
    <div className="min-h-screen bg-secondary/30" dir={dir}>
      <Navbar />

      {/* Header */}
      <section className="relative py-24 bg-tarteel-maroon text-white overflow-hidden">
        <div 
          className="absolute inset-0 opacity-[0.06] bg-repeat pointer-events-none"
          style={{ backgroundImage: `url(${islamicPattern})`, backgroundSize: '400px' }}
        />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Our Institute</h1>
          <p className="text-xl max-w-2xl mx-auto text-white/80">
            A beacon of Quranic education in Mogadishu, preserving the authentic Somali Saba' methodology.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 -mt-12 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Users, label: "Graduates", value: "2,500+" },
              { icon: Award, label: "Ijaza Issued", value: "450" },
              { icon: BookOpen, label: "Active Classes", value: "120" },
              { icon: Calendar, label: "Years Active", value: "15" }
            ].map((stat, i) => (
              <Card key={i} className="shadow-lg border-none">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-tarteel-gold/20 flex items-center justify-center mb-4">
                    <stat.icon className="text-tarteel-gold" size={24} />
                  </div>
                  <h3 className="text-3xl font-bold text-tarteel-maroon mb-1">{stat.value}</h3>
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* History & Mission */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-0.5 flex-1 bg-tarteel-gold/30"></div>
              <h2 className="text-3xl font-serif font-bold text-tarteel-maroon px-4">History & Mission</h2>
              <div className="h-0.5 flex-1 bg-tarteel-gold/30"></div>
            </div>
            
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p>
                Founded in the heart of Mogadishu, Tarteel E-Maqraa began with a simple yet profound mission: to make the rigorous and highly effective Somali Saba' memorization system accessible to Muslims around the globe.
              </p>
              <p>
                The Somali Saba' system is unique in its structured approach to both new memorization and continuous review, ensuring that what is memorized is never forgotten. For centuries, this methodology has produced scholars and Huffaz of the highest caliber in East Africa.
              </p>
              <p>
                Today, through our digital platform, we bridge the gap between classical scholarship and modern accessibility, connecting dedicated students anywhere in the world with master teachers holding verified Ijazahs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Announcements */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-tarteel-maroon mb-10 text-center">Latest Announcements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { date: "Oct 15, 2023", title: "New Qira'at Course Opening", desc: "Registration for the advanced Hafs 'an Asim course is now open for qualified students." },
              { date: "Sep 28, 2023", title: "Annual Graduation Ceremony", desc: "Join us in celebrating our 5th cohort of Ijaza recipients live from Mogadishu." },
              { date: "Aug 10, 2023", title: "Platform Upgrade", desc: "We've introduced new tracking tools for the Saba' review system in the student dashboard." }
            ].map((ann, i) => (
              <Card key={i} className="hover:border-tarteel-gold transition-colors duration-300">
                <CardContent className="p-6">
                  <div className="text-sm text-tarteel-gold font-bold mb-3">{ann.date}</div>
                  <h3 className="text-xl font-bold text-tarteel-maroon mb-2">{ann.title}</h3>
                  <p className="text-muted-foreground text-sm">{ann.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-tarteel-maroon mb-10 text-center">Gallery</h2>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4 max-w-6xl mx-auto">
            {images.map((img, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={i}
                className="break-inside-avoid relative group rounded-xl overflow-hidden shadow-md"
              >
                <img src={img} alt={`Institute Gallery ${i+1}`} className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-tarteel-maroon/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FloatingButtons />
      <Footer />
    </div>
  );
}
