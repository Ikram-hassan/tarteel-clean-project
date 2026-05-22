import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Calendar,
  MessageSquare,
  User,
  Clock,
  CheckCheck,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Message {
  id: string;
  sender: string;
  recipient: string;
  content: string;
  timestamp: Date;
  read: boolean;
  type: "message" | "appointment";
}

interface Appointment {
  id: string;
  title: string;
  date: string;
  time: string;
  with: string;
  status: "pending" | "confirmed" | "cancelled";
}

export function AppointmentMessagingCenter() {
  const [activeTab, setActiveTab] = useState<"messages" | "appointments">(
    "messages",
  );
  const [messageContent, setMessageContent] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [showComposeMessage, setShowComposeMessage] = useState(false);

  // Mock data
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "Ahmed Ali",
      recipient: "You",
      content: "Assalamu Alaikum, when is the next class?",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      read: false,
      type: "message",
    },
    {
      id: "2",
      sender: "You",
      recipient: "Fatima Hassan",
      content: "Please review Surah Al-Fatiha for tomorrow's session.",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      read: true,
      type: "message",
    },
    {
      id: "3",
      sender: "Omar Mohamed",
      recipient: "You",
      content: "Can we reschedule today's appointment?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      read: false,
      type: "message",
    },
  ]);

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      title: "Placement Test",
      date: "2026-05-11",
      time: "10:00 AM",
      with: "Ahmed Ali",
      status: "pending",
    },
    {
      id: "2",
      title: "Ijaza Evaluation",
      date: "2026-05-12",
      time: "02:00 PM",
      with: "Fatima Hassan",
      status: "confirmed",
    },
    {
      id: "3",
      title: "Progress Review",
      date: "2026-05-13",
      time: "11:00 AM",
      with: "Omar Mohamed",
      status: "pending",
    },
  ]);

  const handleSendMessage = () => {
    if (!messageContent.trim() || !recipientName.trim()) return;

    // Double-name validation: Ensure at least first and last name
    const nameParts = recipientName.trim().split(/\s+/);
    if (nameParts.length < 2) {
      alert("Please enter both first and last name for the recipient.");
      return;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "You",
      recipient: recipientName,
      content: messageContent,
      timestamp: new Date(),
      read: false,
      type: "message",
    };

    setMessages([newMessage, ...messages]);
    setMessageContent("");
    setRecipientName("");
    setShowComposeMessage(false);
  };

  const handleConfirmAppointment = (id: string) => {
    setAppointments(
      appointments.map((apt) =>
        apt.id === id ? { ...apt, status: "confirmed" as const } : apt,
      ),
    );
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments(
      appointments.map((apt) =>
        apt.id === id ? { ...apt, status: "cancelled" as const } : apt,
      ),
    );
  };

  const getAppointmentStatusBadge = (status: Appointment["status"]) => {
    const colors = {
      pending: "bg-amber-100 text-amber-700 border-amber-300",
      confirmed: "bg-green-100 text-green-700 border-green-300",
      cancelled: "bg-red-100 text-red-700 border-red-300",
    };
    return (
      <Badge className={`${colors[status]} border capitalize`}>{status}</Badge>
    );
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const unreadCount = messages.filter(
    (m) => !m.read && m.recipient === "You",
  ).length;
  const pendingAppointments = appointments.filter(
    (a) => a.status === "pending",
  ).length;

  return (
    <div className="w-full">
      <Card className="border-2 border-gray-200">
        <CardHeader className="bg-gradient-to-r from-tarteel-maroon/10 to-tarteel-gold/10">
          <CardTitle className="text-tarteel-maroon flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Appointment & Messaging Center
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="messages" className="relative">
                <MessageSquare className="w-4 h-4 mr-2" />
                Messages
                {unreadCount > 0 && (
                  <Badge className="ml-2 bg-red-500 text-white text-xs px-2">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="appointments" className="relative">
                <Calendar className="w-4 h-4 mr-2" />
                Appointments
                {pendingAppointments > 0 && (
                  <Badge className="ml-2 bg-amber-500 text-white text-xs px-2">
                    {pendingAppointments}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Messages Tab */}
            <TabsContent value="messages" className="space-y-4">
              {/* Compose Message Button */}
              <Button
                onClick={() => setShowComposeMessage(!showComposeMessage)}
                className="w-full bg-tarteel-gold hover:bg-tarteel-gold/90"
              >
                <Send className="w-4 h-4 mr-2" />
                Compose New Message
              </Button>

              {/* Compose Message Form */}
              <AnimatePresence>
                {showComposeMessage && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Card className="border-2 border-tarteel-gold">
                      <CardContent className="pt-6 space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Recipient Name (Manual Input)
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              placeholder="Enter recipient name..."
                              value={recipientName}
                              onChange={(e) => setRecipientName(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Message
                          </label>
                          <Textarea
                            placeholder="Type your message here..."
                            value={messageContent}
                            onChange={(e) => setMessageContent(e.target.value)}
                            rows={4}
                            className="resize-none"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={handleSendMessage}
                            disabled={
                              !messageContent.trim() || !recipientName.trim()
                            }
                            className="flex-1 bg-tarteel-maroon hover:bg-tarteel-maroon/90"
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Send Message
                          </Button>
                          <Button
                            onClick={() => setShowComposeMessage(false)}
                            variant="outline"
                          >
                            Cancel
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Messages List */}
              <div className="space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No messages yet</p>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card
                        className={`border transition-all hover:shadow-md ${
                          !message.read && message.recipient === "You"
                            ? "border-tarteel-gold bg-tarteel-gold/5"
                            : "border-gray-200"
                        }`}
                      >
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-tarteel-maroon/20 flex items-center justify-center">
                                <User className="w-4 h-4 text-tarteel-maroon" />
                              </div>
                              <div>
                                <p className="font-semibold text-sm">
                                  {message.sender}
                                </p>
                                <p className="text-xs text-gray-500">
                                  To: {message.recipient}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">
                                {formatTimestamp(message.timestamp)}
                              </span>
                              {message.read && (
                                <CheckCheck className="w-4 h-4 text-blue-500" />
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 mt-2">
                            {message.content}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            </TabsContent>

            {/* Appointments Tab */}
            <TabsContent value="appointments" className="space-y-4">
              {appointments.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No appointments scheduled</p>
                </div>
              ) : (
                appointments.map((appointment, index) => (
                  <motion.div
                    key={appointment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="border-2 border-gray-200 hover:border-tarteel-gold transition-all">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="font-bold text-lg text-tarteel-maroon mb-1">
                              {appointment.title}
                            </h4>
                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{appointment.date}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{appointment.time}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>With: {appointment.with}</span>
                              </div>
                            </div>
                          </div>
                          {getAppointmentStatusBadge(appointment.status)}
                        </div>

                        {appointment.status === "pending" && (
                          <div className="flex gap-2 mt-4">
                            <Button
                              onClick={() =>
                                handleConfirmAppointment(appointment.id)
                              }
                              size="sm"
                              className="flex-1 bg-green-600 hover:bg-green-700"
                            >
                              <CheckCheck className="w-4 h-4 mr-1" />
                              Confirm
                            </Button>
                            <Button
                              onClick={() =>
                                handleCancelAppointment(appointment.id)
                              }
                              size="sm"
                              variant="destructive"
                              className="flex-1"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
