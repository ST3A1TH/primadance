import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { handleDbError } from "@/lib/error-handler";
import { format, addDays, startOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth } from "date-fns";
import { ChevronLeft, ChevronRight, Trash2, Plus, Edit2, Check, X, Users, Lock, Unlock, Eye } from "lucide-react";

interface Booking {
  id: string;
  schedule_id: string;
  booking_date: string;
  client_name: string;
  client_phone: string;
  client_email: string;
  status: string;
  created_at: string;
}

interface ScheduleEntry {
  id: string;
  day_of_week: number;
  time: string;
  class_name: string;
}

interface BookingSetting {
  id?: string;
  schedule_id: string;
  max_participants: number;
}

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [settings, setSettings] = useState<BookingSetting[]>([]);
  const [closedDates, setClosedDates] = useState<{ id: string; date: string; reason: string | null }[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  // Add booking form state
  const [addForm, setAddForm] = useState({ schedule_id: "", booking_date: "", client_name: "", client_phone: "", client_email: "" });
  const [editForm, setEditForm] = useState({ client_name: "", client_phone: "", client_email: "", status: "" });

  const fetchAll = async () => {
    const [bRes, sRes, stRes, cdRes] = await Promise.all([
      supabase.from("bookings").select("*").order("booking_date").order("created_at"),
      supabase.from("schedule").select("id, day_of_week, time, class_name").order("day_of_week").order("sort_order"),
      supabase.from("booking_settings").select("*"),
      supabase.from("closed_dates").select("*").order("date"),
    ]);
    if (bRes.data) setBookings(bRes.data);
    if (sRes.data) setSchedule(sRes.data);
    if (stRes.data) setSettings(stRes.data);
    if (cdRes.data) setClosedDates(cdRes.data);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  // Calendar helpers
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = useMemo(() => {
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const startPad = (monthStart.getDay() + 6) % 7;
    const padded: (Date | null)[] = Array(startPad).fill(null).concat(days);
    return padded;
  }, [currentDate]);

  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [currentDate]);

  const getBookingsForDay = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return bookings.filter(b => b.booking_date === dateStr);
  };

  const isDateClosed = (date: Date) => {
    return closedDates.some(cd => cd.date === format(date, "yyyy-MM-dd"));
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) toast.error(handleDbError(error));
    else { toast.success("Deleted"); fetchAll(); }
  };

  const handleStatusToggle = async (booking: Booking) => {
    const newStatus = booking.status === "completed" ? "confirmed" : "completed";
    const { error } = await supabase.from("bookings").update({ status: newStatus }).eq("id", booking.id);
    if (error) toast.error(handleDbError(error));
    else fetchAll();
  };

  const handleAdd = async () => {
    if (!addForm.schedule_id || !addForm.booking_date || !addForm.client_name || !addForm.client_phone || !addForm.client_email) {
      toast.error("Fill all fields"); return;
    }
    const { error } = await supabase.from("bookings").insert(addForm);
    if (error) toast.error(handleDbError(error));
    else { toast.success("Added"); setShowAddModal(false); setAddForm({ schedule_id: "", booking_date: "", client_name: "", client_phone: "", client_email: "" }); fetchAll(); }
  };

  const handleEditSave = async () => {
    if (!editingBooking) return;
    const { error } = await supabase.from("bookings").update(editForm).eq("id", editingBooking.id);
    if (error) toast.error(error.message);
    else { toast.success("Updated"); setEditingBooking(null); fetchAll(); }
  };

  const toggleClosedDate = async (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const existing = closedDates.find(cd => cd.date === dateStr);
    if (existing) {
      await supabase.from("closed_dates").delete().eq("id", existing.id);
      toast.success("Date opened");
    } else {
      await supabase.from("closed_dates").insert({ date: dateStr });
      toast.success("Date closed");
    }
    fetchAll();
  };

  const updateMaxParticipants = async (scheduleId: string, value: number) => {
    const existing = settings.find(s => s.schedule_id === scheduleId);
    if (existing) {
      await supabase.from("booking_settings").update({ max_participants: value }).eq("schedule_id", scheduleId);
    } else {
      await supabase.from("booking_settings").insert({ schedule_id: scheduleId, max_participants: value });
    }
    fetchAll();
  };

  if (loading) return <p className="text-muted-foreground text-sm">Loading...</p>;

  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button onClick={() => {
            if (view === "month") setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
            else if (view === "week") setCurrentDate(addDays(currentDate, -7));
            else setCurrentDate(addDays(currentDate, -1));
          }} className="p-2 text-muted-foreground hover:text-foreground transition-colors"><ChevronLeft className="w-4 h-4" /></button>
          <span className="font-display text-xl text-foreground min-w-[200px] text-center">
            {view === "month" && currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            {view === "week" && `${format(weekDays[0], "MMM d")} - ${format(weekDays[6], "MMM d, yyyy")}`}
            {view === "day" && format(currentDate, "EEEE, MMMM d, yyyy")}
          </span>
          <button onClick={() => {
            if (view === "month") setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
            else if (view === "week") setCurrentDate(addDays(currentDate, 7));
            else setCurrentDate(addDays(currentDate, 1));
          }} className="p-2 text-muted-foreground hover:text-foreground transition-colors"><ChevronRight className="w-4 h-4" /></button>
        </div>
        <div className="flex items-center gap-2">
          {(["month", "week", "day"] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-4 py-1.5 text-xs font-body uppercase tracking-widest border transition-colors ${view === v ? "border-foreground text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>
              {v}
            </button>
          ))}
          <button onClick={() => setShowAddModal(true)} className="ml-2 flex items-center gap-2 px-4 py-1.5 bg-foreground text-background text-xs font-body uppercase tracking-widest hover:bg-foreground/90 transition-colors">
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>
      </div>

      {/* Month View */}
      {view === "month" && (
        <div>
          <div className="grid grid-cols-7 gap-px bg-border">
            {dayLabels.map(d => (
              <div key={d} className="bg-background p-2 text-center text-xs text-muted-foreground font-body">{d}</div>
            ))}
            {calendarDays.map((day, i) => {
              if (!day) return <div key={i} className="bg-background p-2 min-h-[100px]" />;
              const dayBookings = getBookingsForDay(day);
              const closed = isDateClosed(day);
              return (
                <div key={i} className={`bg-background p-2 min-h-[100px] border-t border-border cursor-pointer hover:bg-muted/20 transition-colors ${!isSameMonth(day, currentDate) ? "opacity-30" : ""} ${closed ? "bg-destructive/5" : ""}`}
                  onClick={() => { setSelectedDay(day); setView("day"); setCurrentDate(day); }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-body ${isSameDay(day, new Date()) ? "bg-foreground text-background w-6 h-6 flex items-center justify-center rounded-full" : "text-foreground"}`}>{day.getDate()}</span>
                    {closed && <Lock className="w-3 h-3 text-destructive" />}
                  </div>
                  {dayBookings.slice(0, 3).map(b => {
                    const slot = schedule.find(s => s.id === b.schedule_id);
                    return (
                      <div key={b.id} className={`text-[10px] font-body px-1 py-0.5 mb-0.5 truncate ${b.status === "completed" ? "text-muted-foreground line-through" : "text-foreground bg-muted/30"}`}>
                        {slot?.time} {b.client_name}
                      </div>
                    );
                  })}
                  {dayBookings.length > 3 && <span className="text-[10px] text-muted-foreground">+{dayBookings.length - 3}</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Week View */}
      {view === "week" && (
        <div className="grid grid-cols-7 gap-px bg-border">
          {weekDays.map((day, i) => {
            const dayBookings = getBookingsForDay(day);
            const closed = isDateClosed(day);
            return (
              <div key={i} className={`bg-background p-3 min-h-[300px] ${closed ? "bg-destructive/5" : ""}`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-xs text-muted-foreground font-body">{dayLabels[i]}</div>
                    <div className={`text-lg font-display ${isSameDay(day, new Date()) ? "text-foreground font-bold" : "text-foreground"}`}>{day.getDate()}</div>
                  </div>
                  <button onClick={() => toggleClosedDate(day)} className="text-muted-foreground hover:text-foreground">
                    {closed ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                  </button>
                </div>
                <div className="space-y-1">
                  {dayBookings.map(b => {
                    const slot = schedule.find(s => s.id === b.schedule_id);
                    return (
                      <div key={b.id} className={`text-xs font-body p-2 border border-border ${b.status === "completed" ? "opacity-50" : ""}`}>
                        <div className="font-medium">{slot?.time} — {slot?.class_name}</div>
                        <div className="text-muted-foreground">{b.client_name}</div>
                        <div className="flex gap-1 mt-1">
                          <button onClick={() => handleStatusToggle(b)} className="text-muted-foreground hover:text-foreground"><Check className="w-3 h-3" /></button>
                          <button onClick={() => handleDelete(b.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-3 h-3" /></button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Day View */}
      {view === "day" && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <button onClick={() => toggleClosedDate(currentDate)}
              className={`flex items-center gap-2 px-4 py-2 border text-xs font-body uppercase tracking-widest transition-colors ${isDateClosed(currentDate) ? "border-destructive text-destructive" : "border-border text-muted-foreground hover:text-foreground"}`}>
              {isDateClosed(currentDate) ? <><Unlock className="w-3 h-3" /> Open Date</> : <><Lock className="w-3 h-3" /> Close Date</>}
            </button>
          </div>

          {/* Classes for this day */}
          {(() => {
            const dow = (currentDate.getDay() + 6) % 7;
            const daySchedule = schedule.filter(s => s.day_of_week === dow);
            const dayBookings = getBookingsForDay(currentDate);

            if (daySchedule.length === 0) {
              return <p className="text-muted-foreground text-sm font-body italic">No classes scheduled</p>;
            }

            return daySchedule.map(slot => {
              const slotBookings = dayBookings.filter(b => b.schedule_id === slot.id);
              const maxP = settings.find(s => s.schedule_id === slot.id)?.max_participants ?? 20;
              return (
                <div key={slot.id} className="border border-border">
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <div>
                      <span className="font-display text-lg text-foreground">{slot.time}</span>
                      <span className="ml-3 text-foreground font-body text-sm">{slot.class_name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-body text-muted-foreground">{slotBookings.length}/{maxP}</span>
                        <input
                          type="number"
                          value={maxP}
                          onChange={e => updateMaxParticipants(slot.id, parseInt(e.target.value) || 1)}
                          className="w-14 bg-secondary border border-border text-foreground text-xs px-2 py-1 font-body focus:outline-none"
                          min={1}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="divide-y divide-border">
                    {slotBookings.length === 0 ? (
                      <p className="p-4 text-muted-foreground text-xs italic font-body">No bookings</p>
                    ) : (
                      slotBookings.map(b => (
                        <div key={b.id} className={`p-4 flex items-center justify-between ${b.status === "completed" ? "opacity-50" : ""}`}>
                          {editingBooking?.id === b.id ? (
                            <div className="flex-1 flex items-center gap-2 flex-wrap">
                              <input value={editForm.client_name} onChange={e => setEditForm({ ...editForm, client_name: e.target.value })}
                                className="bg-secondary border border-border text-foreground text-sm px-2 py-1 font-body focus:outline-none" />
                              <input value={editForm.client_phone} onChange={e => setEditForm({ ...editForm, client_phone: e.target.value })}
                                className="bg-secondary border border-border text-foreground text-sm px-2 py-1 font-body focus:outline-none" />
                              <input value={editForm.client_email} onChange={e => setEditForm({ ...editForm, client_email: e.target.value })}
                                className="bg-secondary border border-border text-foreground text-sm px-2 py-1 font-body focus:outline-none" />
                              <button onClick={handleEditSave} className="text-foreground hover:text-foreground/80"><Check className="w-4 h-4" /></button>
                              <button onClick={() => setEditingBooking(null)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
                            </div>
                          ) : (
                            <>
                              <div>
                                <span className="text-foreground text-sm font-body font-medium">{b.client_name}</span>
                                <span className="text-muted-foreground text-xs font-body ml-3">{b.client_phone}</span>
                                <span className="text-muted-foreground text-xs font-body ml-3">{b.client_email}</span>
                                {b.status === "completed" && <span className="ml-2 text-xs text-muted-foreground font-body italic">✓ completed</span>}
                              </div>
                              <div className="flex items-center gap-2">
                                <button onClick={() => handleStatusToggle(b)} className="text-muted-foreground hover:text-foreground transition-colors" title={b.status === "completed" ? "Mark active" : "Mark completed"}>
                                  <Check className="w-4 h-4" />
                                </button>
                                <button onClick={() => { setEditingBooking(b); setEditForm({ client_name: b.client_name, client_phone: b.client_phone, client_email: b.client_email, status: b.status }); }}
                                  className="text-muted-foreground hover:text-foreground transition-colors"><Edit2 className="w-4 h-4" /></button>
                                <button onClick={() => handleDelete(b.id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            </>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            });
          })()}
        </div>
      )}

      {/* Add Booking Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => setShowAddModal(false)}>
          <div className="bg-background border border-border p-6 w-full max-w-md space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-xl text-foreground">Add Booking</h3>
            <select
              value={addForm.schedule_id}
              onChange={e => setAddForm({ ...addForm, schedule_id: e.target.value })}
              className="w-full bg-secondary border border-border text-foreground text-sm px-3 py-2 font-body focus:outline-none"
            >
              <option value="">Select class...</option>
              {schedule.map(s => (
                <option key={s.id} value={s.id}>
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][s.day_of_week]} {s.time} — {s.class_name}
                </option>
              ))}
            </select>
            <input type="date" value={addForm.booking_date} onChange={e => setAddForm({ ...addForm, booking_date: e.target.value })}
              className="w-full bg-secondary border border-border text-foreground text-sm px-3 py-2 font-body focus:outline-none" />
            <input placeholder="Name" value={addForm.client_name} onChange={e => setAddForm({ ...addForm, client_name: e.target.value })}
              className="w-full bg-secondary border border-border text-foreground text-sm px-3 py-2 font-body focus:outline-none" />
            <input placeholder="Phone" value={addForm.client_phone} onChange={e => setAddForm({ ...addForm, client_phone: e.target.value })}
              className="w-full bg-secondary border border-border text-foreground text-sm px-3 py-2 font-body focus:outline-none" />
            <input placeholder="Email" value={addForm.client_email} onChange={e => setAddForm({ ...addForm, client_email: e.target.value })}
              className="w-full bg-secondary border border-border text-foreground text-sm px-3 py-2 font-body focus:outline-none" />
            <div className="flex gap-3">
              <button onClick={handleAdd} className="flex-1 py-2 bg-foreground text-background text-sm font-body uppercase tracking-widest hover:bg-foreground/90 transition-colors">Add</button>
              <button onClick={() => setShowAddModal(false)} className="px-6 py-2 border border-border text-foreground text-sm font-body uppercase tracking-widest hover:bg-muted/20 transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
