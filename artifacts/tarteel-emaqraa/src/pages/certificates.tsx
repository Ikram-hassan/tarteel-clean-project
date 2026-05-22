"use client";

import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Award, Download, Search, PlusCircle, CheckCircle, ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// التعديل الجوهري هنا: إضافة الشرطة السفلية الثانية لتطابق ملف Home
import islamicPattern from "@assets/Islamic_geometric_patterns__1774916076795.jpeg";

export default function Certificates() {
  const { t, dir } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();

  const isAdmin = user?.role === "admin";

  const mockCertificates = [
    { id: "CERT-001", student: "Omar Ali", type: "Ijaza - Hafs 'an Asim", date: "2023-10-15", status: "Active" },
    { id: "CERT-002", student: "Fatima Noor", type: "Tajweed Mastery", date: "2023-09-22", status: "Active" },
    { id: "CERT-003", student: "Ahmed Hassan", type: "Hifz Completion", date: "2023-08-10", status: "Active" },
  ];

  const handleIssueCertificate = () => {
    toast({
      title: t('success') || "Success",
      description: "Certificate has been issued and registered successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col" dir={dir}>
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-tarteel-maroon mb-2">
              {isAdmin ? "Certificate Management" : "My Certificates"}
            </h1>
            <p className="text-muted-foreground">
              {isAdmin 
                ? "Issue and verify student certifications and Ijazahs." 
                : "View and download your earned certificates."}
            </p>
          </div>
          
          {isAdmin && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-tarteel-maroon hover:bg-tarteel-maroon/90 text-white">
                  <PlusCircle className="mr-2 h-4 w-4" /> Issue New Certificate
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="font-serif text-2xl text-tarteel-maroon">Issue Certificate</DialogTitle>
                  <DialogDescription>
                    Generate a formal certificate with academic verification.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Student Name</Label>
                    <Input placeholder="Search student name..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Certificate Type</Label>
                    <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-tarteel-gold outline-none">
                      <option>{t('beginner')}</option>
                      <option>{t('intermediate')}</option>
                      <option>{t('advanced')}</option>
                      <option>Ijaza - Hafs 'an Asim</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date Issued</Label>
                    <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline">Cancel</Button>
                  <Button 
                    onClick={handleIssueCertificate}
                    className="bg-tarteel-gold hover:bg-tarteel-gold/90 text-tarteel-maroon font-bold"
                  >
                    Generate & Sign
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Registry Table */}
        <Card className="shadow-md overflow-hidden">
          <CardHeader className="bg-white border-b flex flex-col md:flex-row items-center justify-between gap-4 py-4">
            <CardTitle className="text-lg">Certificate Registry</CardTitle>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by ID or Name..." className="pl-8 h-9" />
            </div>
          </CardHeader>
          <CardContent className="p-0 bg-white">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/50">
                    <TableHead className="w-[120px]">Verify ID</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockCertificates.map((cert) => (
                    <TableRow key={cert.id} className="hover:bg-slate-50 transition-colors">
                      <TableCell className="font-mono text-xs font-bold text-tarteel-maroon">{cert.id}</TableCell>
                      <TableCell className="font-medium">{cert.student}</TableCell>
                      <TableCell>{cert.type}</TableCell>
                      <TableCell>{cert.date}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                          <CheckCircle size={12} /> {cert.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-tarteel-maroon hover:bg-tarteel-maroon/10">
                          <Download className="h-4 w-4 mr-1" /> PDF
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Visual Preview Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-serif font-bold text-tarteel-maroon mb-8">Certificate Design Preview</h2>
          <div className="max-w-4xl mx-auto bg-white p-8 md:p-16 relative border-[12px] border-double border-tarteel-maroon shadow-2xl overflow-hidden">
            {/* Watermark Background - Using the identical import from Home.tsx */}
            <div 
              className="absolute inset-0 opacity-[0.04] pointer-events-none"
              style={{ backgroundImage: `url(${islamicPattern})`, backgroundSize: '200px' }}
            />
            
            <div className="relative z-10 space-y-6">
              <div className="flex justify-center mb-4">
                <Award size={80} className="text-tarteel-gold" />
              </div>
              
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-tarteel-maroon tracking-tight">Tarteel E-Maqraa</h1>
                <p className="text-tarteel-gold font-bold tracking-[0.3em] uppercase text-sm">International Quranic Academy</p>
              </div>

              <div className="py-8">
                <p className="italic text-lg text-slate-500 mb-2">This is to certify that</p>
                <h2 className="text-4xl font-bold text-slate-900 border-b-2 border-tarteel-maroon inline-block px-12 pb-2 mb-6">
                  {user?.name || "Student Name"}
                </h2>
                <p className="italic text-lg text-slate-500 mb-2">has successfully attained the level of</p>
                <h3 className="text-2xl font-bold text-tarteel-maroon uppercase tracking-wide">
                  Ijaza in Hafs 'an Asim
                </h3>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}