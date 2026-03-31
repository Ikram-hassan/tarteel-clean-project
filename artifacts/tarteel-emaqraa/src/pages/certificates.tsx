import { useLanguage } from "@/hooks/use-language";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Award, Download, Search, PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import islamicPattern from "@assets/Islamic_geometric_patterns__1774916076795.jpeg";

export default function Certificates() {
  const { t, dir } = useLanguage();

  const mockCertificates = [
    { id: "CERT-001", student: "Omar Ali", type: "Ijaza - Hafs 'an Asim", date: "2023-10-15", status: "Active" },
    { id: "CERT-002", student: "Fatima Noor", type: "Tajweed Mastery", date: "2023-09-22", status: "Active" },
    { id: "CERT-003", student: "Ahmed Hassan", type: "Hifz Completion", date: "2023-08-10", status: "Active" },
    { id: "CERT-004", student: "Khadija Said", type: "Ijaza - Qawa'id", date: "2023-07-05", status: "Active" },
  ];

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col" dir={dir}>
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-tarteel-maroon mb-2">Certificate Management</h1>
            <p className="text-muted-foreground">Issue and verify student certifications and Ijazahs.</p>
          </div>
          
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
                  Generate a new formal certificate. This will be added to the blockchain registry.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Student Name</Label>
                  <Input placeholder="Search student..." />
                </div>
                <div className="space-y-2">
                  <Label>Certificate Type</Label>
                  <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option>Tajweed Mastery</option>
                    <option>Hifz Completion</option>
                    <option>Ijaza - Hafs 'an Asim</option>
                    <option>Ijaza - Qawa'id</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Date Issued</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Teacher / Approver</Label>
                  <Input defaultValue="Sh. Abdullahi" disabled />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline">Cancel</Button>
                <Button className="bg-tarteel-gold hover:bg-tarteel-gold/90 text-tarteel-maroon">Generate Certificate</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white shadow-md border-t-4 border-tarteel-maroon">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Issued</p>
                  <h3 className="text-3xl font-bold text-tarteel-maroon">450</h3>
                </div>
                <div className="p-3 bg-tarteel-maroon/10 rounded-full">
                  <Award className="text-tarteel-maroon" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-md border-t-4 border-tarteel-gold">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">This Month</p>
                  <h3 className="text-3xl font-bold text-tarteel-maroon">12</h3>
                </div>
                <div className="p-3 bg-tarteel-gold/20 rounded-full">
                  <Award className="text-tarteel-gold" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-md border-t-4 border-[#E07B39]">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Pending Review</p>
                  <h3 className="text-3xl font-bold text-tarteel-maroon">5</h3>
                </div>
                <div className="p-3 bg-[#E07B39]/20 rounded-full">
                  <Award className="text-[#E07B39]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-md overflow-hidden">
          <CardHeader className="bg-white border-b flex flex-row items-center justify-between py-4">
            <CardTitle className="text-lg">Certificate Registry</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search registry..." className="pl-8 h-9" />
            </div>
          </CardHeader>
          <CardContent className="p-0 bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/50">
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Certificate Type</TableHead>
                  <TableHead>Date Issued</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCertificates.map((cert) => (
                  <TableRow key={cert.id}>
                    <TableCell className="font-mono text-xs">{cert.id}</TableCell>
                    <TableCell className="font-medium">{cert.student}</TableCell>
                    <TableCell>{cert.type}</TableCell>
                    <TableCell>{cert.date}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                        {cert.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-tarteel-maroon hover:text-tarteel-maroon hover:bg-tarteel-maroon/10">
                        <Download className="h-4 w-4 mr-1" /> PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Certificate Preview Demo */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-serif font-bold text-tarteel-maroon mb-6">Certificate Preview</h2>
          <div className="max-w-3xl mx-auto bg-white p-12 relative border-[16px] border-double border-tarteel-maroon shadow-2xl">
            <div 
              className="absolute inset-0 opacity-[0.03] bg-repeat pointer-events-none"
              style={{ backgroundImage: `url(${islamicPattern})`, backgroundSize: '200px' }}
            />
            <div className="absolute inset-4 border-2 border-tarteel-gold pointer-events-none" />
            
            <div className="relative z-10">
              <Award size={64} className="mx-auto text-tarteel-gold mb-6" />
              <h1 className="text-4xl font-serif font-bold text-tarteel-maroon mb-2">Tarteel E-Maqraa</h1>
              <p className="text-tarteel-gold font-bold tracking-widest uppercase mb-10">Certificate of Completion</p>
              
              <p className="italic text-lg text-muted-foreground mb-4">This is to certify that</p>
              <h2 className="text-3xl font-bold mb-4 border-b-2 border-tarteel-maroon pb-2 inline-block px-12">Omar Ali</h2>
              
              <p className="italic text-lg text-muted-foreground mb-4">has successfully completed</p>
              <h3 className="text-2xl font-bold text-tarteel-maroon mb-12">Ijaza - Hafs 'an Asim</h3>
              
              <div className="flex justify-between items-end mt-16 px-12">
                <div className="text-center">
                  <div className="w-48 border-b border-black mb-2 pb-2 font-handwriting text-xl">Sh. Abdullahi</div>
                  <p className="text-sm font-bold uppercase">Master Teacher</p>
                </div>
                <div className="text-center">
                  <div className="w-48 border-b border-black mb-2 pb-2">October 15, 2023</div>
                  <p className="text-sm font-bold uppercase">Date</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>
      
      <Footer />
    </div>
  );
}
