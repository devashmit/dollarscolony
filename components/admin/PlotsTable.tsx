"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plot, PlotStatus } from "@/lib/types-prisma-mock";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Edit2, MapPin } from "lucide-react";

interface PlotsTableProps {
  initialPlots: Plot[];
}

export default function PlotsTable({ initialPlots }: PlotsTableProps) {
  const router = useRouter();
  const [plots, setPlots] = useState<Plot[]>(initialPlots);
  const [blockFilter, setBlockFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);
  const [noteText, setNoteText] = useState("");
  const [priceText, setPriceText] = useState("");
  const [statusValue, setStatusValue] = useState<PlotStatus>("AVAILABLE");
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [savingNote, setSavingNote] = useState(false);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch("/api/admin/plots/history");
      const data = await res.json();
      if (data.success) {
        setHistory(data.data);
      } else {
        toast.error("Failed to load sales history");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error loading sales history");
    } finally {
      setLoadingHistory(false);
    }
  };

  const statusColors: Record<PlotStatus, string> = {
    AVAILABLE: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 focus:ring-emerald-500",
    BLOCKED: "text-amber-400 bg-amber-500/10 border-amber-500/20 focus:ring-amber-500",
    SOLD: "text-rose-400 bg-rose-500/10 border-rose-500/20 focus:ring-rose-500",
  };

  const handleStatusChange = async (plotId: string, newStatus: PlotStatus) => {
    const previousPlots = [...plots];
    setPlots((prev) =>
      prev.map((p) => (p.id === plotId ? { ...p, status: newStatus, updatedAt: new Date() } : p))
    );

    try {
      const res = await fetch(`/api/admin/plots/${plotId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.error || "Failed to update status");
        setPlots(previousPlots);
      } else {
        toast.success(`Plot status updated successfully!`);
        router.refresh();
        fetchHistory();
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error updating status");
      setPlots(previousPlots);
    }
  };

  const openNotesDialog = (plot: Plot) => {
    setSelectedPlot(plot);
    setNoteText(plot.notes || "");
    setPriceText(plot.price !== null && plot.price !== undefined ? String(plot.price) : "");
    setStatusValue(plot.status);
    setBuyerName("");
    setBuyerPhone("");
    setDialogOpen(true);
  };

  const handleSaveNotes = async () => {
    if (!selectedPlot) return;
    setSavingNote(true);

    const parsedPrice = priceText.trim() === "" ? null : parseFloat(priceText);
    if (priceText.trim() !== "" && isNaN(parsedPrice!)) {
      toast.error("Please enter a valid number for price");
      setSavingNote(false);
      return;
    }

    if (statusValue === "SOLD" && !buyerName.trim()) {
      toast.error("Buyer name is required when marking a plot as SOLD");
      setSavingNote(false);
      return;
    }

    try {
      const res = await fetch(`/api/admin/plots/${selectedPlot.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notes: noteText,
          price: parsedPrice,
          status: statusValue,
          buyerName: statusValue === "SOLD" ? buyerName : null,
          buyerPhone: statusValue === "SOLD" ? buyerPhone : null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPlots((prev) =>
          prev.map((p) => (p.id === selectedPlot.id ? { ...p, notes: noteText, price: parsedPrice, status: statusValue, updatedAt: new Date() } : p))
        );
        toast.success("Plot details updated successfully!");
        setDialogOpen(false);
        router.refresh();
        fetchHistory();
      } else {
        toast.error(data.error || "Failed to update plot");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error saving details");
    } finally {
      setSavingNote(false);
    }
  };

  const filteredPlots = plots.filter((plot) => {
    const matchesBlock = blockFilter === "All" || plot.block === blockFilter;
    const matchesStatus = statusFilter === "All" || plot.status === statusFilter;
    const matchesSearch = searchQuery.trim() === "" || plot.plotId.toLowerCase().includes(searchQuery.toLowerCase().trim());
    return matchesBlock && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <Tabs defaultValue="inventory" className="w-full" onValueChange={(val) => { if (val === "history") fetchHistory(); }}>
        <TabsList className="w-full flex justify-start overflow-x-auto bg-[#0F2535] border border-[rgba(176,120,72,0.25)] text-[#8A9BB0] h-auto p-1 whitespace-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] mb-6">
          <TabsTrigger
            value="inventory"
            className="data-[state=active]:bg-[#1A3348] data-[state=active]:text-[#D4A46A]"
          >
            Plot Inventory
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="data-[state=active]:bg-[#1A3348] data-[state=active]:text-[#D4A46A]"
          >
            Sales History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-6 mt-0">
          <div className="flex flex-wrap items-center gap-4 bg-[#0F2535] p-5 rounded-xl border border-[rgba(176,120,72,0.25)] shadow-md">
        <div className="flex flex-wrap items-center gap-4">
          <div className="space-y-1.5 min-w-[150px]">
            <label className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider block">Filter by Block</label>
            <Select value={blockFilter} onValueChange={(val) => setBlockFilter(val || "All")}>
              <SelectTrigger className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8] focus:ring-[#B07848]">
                <SelectValue placeholder="All Blocks" />
              </SelectTrigger>
              <SelectContent className="bg-[#0F2535] border-[rgba(176,120,72,0.25)] text-[#F5F0E8]">
                <SelectItem value="All">All Blocks</SelectItem>
                <SelectItem value="Block A">Block A</SelectItem>
                <SelectItem value="Block B">Block B</SelectItem>
                <SelectItem value="Block C">Block C</SelectItem>
                <SelectItem value="Block D">Block D</SelectItem>
                <SelectItem value="Block E">Block E</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 min-w-[150px]">
            <label className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider block">Filter by Status</label>
            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "All")}>
              <SelectTrigger className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8] focus:ring-[#B07848]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent className="bg-[#0F2535] border-[rgba(176,120,72,0.25)] text-[#F5F0E8]">
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="AVAILABLE">Available</SelectItem>
                <SelectItem value="BLOCKED">Blocked</SelectItem>
                <SelectItem value="SOLD">Sold</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 min-w-[200px] flex-1 sm:flex-initial">
            <label className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider block">Search Plot ID</label>
            <Input
              type="text"
              placeholder="e.g. A1, B12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8] placeholder:text-[#8A9BB0]/30 h-10 focus-visible:ring-[#B07848]"
            />
          </div>
        </div>

        <div className="ml-auto text-xs text-[#8A9BB0]">
          Showing <span className="font-semibold text-[#F5F0E8]">{filteredPlots.length}</span> plots
        </div>
      </div>

      <div className="bg-[#0F2535] rounded-xl border border-[rgba(176,120,72,0.25)] overflow-hidden shadow-lg">
        {filteredPlots.length === 0 ? (
          <div className="p-16 text-center text-[#8A9BB0]">
            No plots match the selected filters.
          </div>
        ) : (
          <>
            {/* Mobile Cards List (Visible on mobile/tablet, hidden on desktop lg screen) */}
            <div className="lg:hidden divide-y divide-[rgba(176,120,72,0.10)] bg-[#0F2535]">
              {filteredPlots.map((plot) => (
                <div
                  key={plot.id}
                  onClick={() => openNotesDialog(plot)}
                  className="p-5 flex flex-col gap-3 hover:bg-[#1A3348]/20 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-[#F5F0E8] text-sm">
                      <MapPin className="h-4 w-4 text-[#D4A46A] shrink-0" />
                      {plot.plotId}
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusColors[plot.status]}`}>
                      {plot.status.charAt(0) + plot.status.slice(1).toLowerCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-y-2 text-xs">
                    <div>
                      <span className="text-[#8A9BB0] block font-semibold uppercase tracking-wider mb-0.5">Block</span>
                      <span className="text-[#F5F0E8] font-medium">{plot.block}</span>
                    </div>
                    <div>
                      <span className="text-[#8A9BB0] block font-semibold uppercase tracking-wider mb-0.5">Category</span>
                      <span className="text-[#D4A46A] font-medium">{plot.category}</span>
                    </div>
                    <div>
                      <span className="text-[#8A9BB0] block font-semibold uppercase tracking-wider mb-0.5">Size</span>
                      <span className="text-[#8A9BB0] font-mono">{plot.cents.toFixed(3)} cents / {plot.sqft.toLocaleString()} sq.ft</span>
                    </div>
                    <div>
                      <span className="text-[#8A9BB0] block font-semibold uppercase tracking-wider mb-0.5">Price</span>
                      <span className="text-[#F5F0E8] font-mono font-medium">
                        {plot.price !== null && plot.price !== undefined ? `₹${plot.price.toLocaleString()}` : "—"}
                      </span>
                    </div>
                  </div>

                  {plot.notes && (
                    <div className="bg-[#1A3348]/30 rounded-lg p-2.5 border border-[rgba(176,120,72,0.10)] mt-1">
                      <span className="text-[10px] font-semibold text-[#8A9BB0] uppercase tracking-wider block mb-0.5">Notes</span>
                      <p className="text-xs text-[#F5F0E8] line-clamp-2 leading-relaxed">{plot.notes}</p>
                    </div>
                  )}
                  <div className="text-[10px] text-[#8A9BB0] flex justify-between items-center mt-1 pt-1 border-t border-[rgba(176,120,72,0.05)]">
                    <span>Tap to edit details</span>
                    <span>
                      Updated: {new Date(plot.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View (Hidden on mobile/tablet, visible on desktop lg screen) */}
            <div className="hidden lg:block overflow-x-auto">
              <Table>
                <TableHeader className="bg-[#0A1D2B]">
                  <TableRow className="border-b border-[rgba(176,120,72,0.15)] hover:bg-transparent">
                    <TableHead className="text-[#8A9BB0] font-semibold text-xs uppercase tracking-wider h-11 w-24">Plot ID</TableHead>
                    <TableHead className="text-[#8A9BB0] font-semibold text-xs uppercase tracking-wider h-11">Block</TableHead>
                    <TableHead className="text-[#8A9BB0] font-semibold text-xs uppercase tracking-wider h-11">Category</TableHead>
                    <TableHead className="text-[#8A9BB0] font-semibold text-xs uppercase tracking-wider h-11">Size (cents)</TableHead>
                    <TableHead className="text-[#8A9BB0] font-semibold text-xs uppercase tracking-wider h-11">Area (sq.ft.)</TableHead>
                    <TableHead className="text-[#8A9BB0] font-semibold text-xs uppercase tracking-wider h-11">Price (Rs.)</TableHead>
                    <TableHead className="text-[#8A9BB0] font-semibold text-xs uppercase tracking-wider h-11 w-44">Status</TableHead>
                    <TableHead className="text-[#8A9BB0] font-semibold text-xs uppercase tracking-wider h-11">Internal Notes</TableHead>
                    <TableHead className="text-[#8A9BB0] font-semibold text-xs uppercase tracking-wider h-11 text-right">Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlots.map((plot) => (
                    <TableRow
                      key={plot.id}
                      onClick={() => openNotesDialog(plot)}
                      className="border-b border-[rgba(176,120,72,0.10)] hover:bg-[#1A3348]/20 transition-colors cursor-pointer"
                    >
                      <TableCell className="font-bold text-[#F5F0E8] py-3 text-sm flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-[#D4A46A] shrink-0" />
                        {plot.plotId}
                      </TableCell>
                      <TableCell className="text-[#F5F0E8] py-3 font-medium">{plot.block}</TableCell>
                      <TableCell className="py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#1A3348] text-[#D4A46A] border border-[rgba(176,120,72,0.15)] whitespace-nowrap">
                          {plot.category}
                        </span>
                      </TableCell>
                      <TableCell className="text-[#8A9BB0] py-3 font-mono">{plot.cents.toFixed(3)}</TableCell>
                      <TableCell className="text-[#8A9BB0] py-3 font-mono">{plot.sqft.toLocaleString()}</TableCell>
                      <TableCell className="text-[#F5F0E8] py-3 font-mono">
                        {plot.price !== null && plot.price !== undefined ? `₹${plot.price.toLocaleString()}` : "—"}
                      </TableCell>
                      <TableCell className="py-3" onClick={(e) => e.stopPropagation()}>
                        <Select
                          value={plot.status}
                          onValueChange={(val) => handleStatusChange(plot.id, val as PlotStatus)}
                        >
                          <SelectTrigger className={`h-8 border text-xs font-semibold rounded-full px-3 py-0 focus:ring-0 ${statusColors[plot.status]}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#0F2535] border-[rgba(176,120,72,0.25)] text-[#F5F0E8]">
                            <SelectItem value="AVAILABLE" className="text-emerald-400">Available</SelectItem>
                            <SelectItem value="BLOCKED" className="text-amber-400">Blocked</SelectItem>
                            <SelectItem value="SOLD" className="text-rose-400">Sold</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="py-3 text-sm max-w-[200px] truncate text-[#8A9BB0]">
                        <div className="flex items-center gap-1 truncate">
                          <Edit2 className="h-3 w-3 shrink-0" />
                          <span className="truncate">{plot.notes || "Add note..."}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-[#8A9BB0] py-3 text-right text-xs">
                        {new Date(plot.updatedAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6 mt-0">
          <div className="bg-[#0F2535] rounded-xl border border-[rgba(176,120,72,0.25)] overflow-hidden shadow-lg">
            <div className="px-6 py-4 border-b border-[rgba(176,120,72,0.15)] bg-[#0A1D2B] flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#F5F0E8] uppercase tracking-wider">
                Sales Transaction Ledger
              </h3>
              <span className="text-xs text-[#8A9BB0]">
                {history.length} Transactions Recorded
              </span>
            </div>

            {loadingHistory ? (
              <div className="p-16 text-center text-[#8A9BB0] space-y-2">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-t-transparent border-[#D4A46A] mx-auto" />
                <p className="text-xs uppercase tracking-wider">Loading history logs...</p>
              </div>
            ) : history.length === 0 ? (
              <div className="p-16 text-center text-[#8A9BB0]">
                No sales records found. Mark a plot status as <span className="text-rose-400 font-semibold">SOLD</span> to log a sale.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-[#0A1D2B]/50">
                    <TableRow className="border-b border-[rgba(176,120,72,0.15)] hover:bg-transparent">
                      <TableHead className="text-[#8A9BB0] font-semibold text-xs uppercase tracking-wider h-11">Plot ID</TableHead>
                      <TableHead className="text-[#8A9BB0] font-semibold text-xs uppercase tracking-wider h-11">Block</TableHead>
                      <TableHead className="text-[#8A9BB0] font-semibold text-xs uppercase tracking-wider h-11">Action / Status</TableHead>
                      <TableHead className="text-[#8A9BB0] font-semibold text-xs uppercase tracking-wider h-11">Buyer Name</TableHead>
                      <TableHead className="text-[#8A9BB0] font-semibold text-xs uppercase tracking-wider h-11">Buyer Phone</TableHead>
                      <TableHead className="text-[#8A9BB0] font-semibold text-xs uppercase tracking-wider h-11">Cost (₹)</TableHead>
                      <TableHead className="text-[#8A9BB0] font-semibold text-xs uppercase tracking-wider h-11 text-right">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((log) => (
                      <TableRow
                        key={log.id}
                        className="border-b border-[rgba(176,120,72,0.10)] hover:bg-[#1A3348]/20 transition-colors"
                      >
                        <TableCell className="font-bold text-[#F5F0E8] py-3.5">
                          {log.plot?.plotId || "—"}
                        </TableCell>
                        <TableCell className="text-[#8A9BB0] py-3.5">
                          {log.plot?.block || "—"}
                        </TableCell>
                        <TableCell className="py-3.5">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            log.status === "AVAILABLE" ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20" :
                            log.status === "BLOCKED" ? "text-amber-400 bg-amber-500/10 border border-amber-500/20" :
                            "text-rose-400 bg-rose-500/10 border border-rose-500/20"
                          }`}>
                            {log.status}
                          </span>
                        </TableCell>
                        <TableCell className="font-semibold text-[#D4A46A] py-3.5">
                          {log.buyerName || "—"}
                        </TableCell>
                        <TableCell className="text-[#8A9BB0] py-3.5">
                          {log.buyerPhone || "—"}
                        </TableCell>
                        <TableCell className="font-mono text-[#F5F0E8] py-3.5">
                          {log.price !== null && log.price !== undefined ? `₹${log.price.toLocaleString()}` : "—"}
                        </TableCell>
                        <TableCell className="text-[#8A9BB0] py-3.5 text-right">
                          {new Date(log.soldAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#0F2535] border border-[rgba(176,120,72,0.25)] text-[#F5F0E8] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold uppercase tracking-wider text-[#F5F0E8] border-b border-[rgba(176,120,72,0.15)] pb-3">
              Edit Details for Plot {selectedPlot?.plotId}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-xs bg-[#1A3348]/20 p-3 rounded-lg border border-[rgba(176,120,72,0.10)] mb-2">
              <div>
                <span className="text-[#8A9BB0] block font-semibold uppercase tracking-wider mb-0.5">Block</span>
                <span className="text-[#F5F0E8] font-medium">{selectedPlot?.block}</span>
              </div>
              <div>
                <span className="text-[#8A9BB0] block font-semibold uppercase tracking-wider mb-0.5">Category</span>
                <span className="text-[#D4A46A] font-medium">{selectedPlot?.category}</span>
              </div>
              <div>
                <span className="text-[#8A9BB0] block font-semibold uppercase tracking-wider mb-0.5">Size</span>
                <span className="text-[#8A9BB0] font-mono">{selectedPlot?.cents.toFixed(3)} cents</span>
              </div>
              <div>
                <span className="text-[#8A9BB0] block font-semibold uppercase tracking-wider mb-0.5">Area</span>
                <span className="text-[#8A9BB0] font-mono">{selectedPlot?.sqft.toLocaleString()} sq.ft</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider">Status</label>
              <Select value={statusValue} onValueChange={(val) => setStatusValue(val as PlotStatus)}>
                <SelectTrigger className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8] focus:ring-[#B07848] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0F2535] border-[rgba(176,120,72,0.25)] text-[#F5F0E8]">
                  <SelectItem value="AVAILABLE" className="text-emerald-400">Available</SelectItem>
                  <SelectItem value="BLOCKED" className="text-amber-400">Blocked</SelectItem>
                  <SelectItem value="SOLD" className="text-rose-400">Sold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider">Price (₹)</label>
              <Input
                type="text"
                placeholder="Enter price"
                value={priceText}
                onChange={(e) => setPriceText(e.target.value)}
                className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8] placeholder:text-[#8A9BB0]/30 focus-visible:ring-[#B07848]"
              />
            </div>

            {statusValue === "SOLD" && (
              <>
                <div className="space-y-1.5 animate-fadeIn">
                  <label className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider">
                    Buyer Name <span className="text-red-400">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter buyer's name"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8] placeholder:text-[#8A9BB0]/30 focus-visible:ring-[#B07848]"
                  />
                </div>

                <div className="space-y-1.5 animate-fadeIn">
                  <label className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider">
                    Buyer Phone
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter buyer's phone"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8] placeholder:text-[#8A9BB0]/30 focus-visible:ring-[#B07848]"
                  />
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider">Internal Notes</label>
              <Textarea
                placeholder="Enter internal sales notes, facing information, or booking queue info..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8] placeholder:text-[#8A9BB0]/30 min-h-[120px] focus-visible:ring-[#B07848]"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="border-[rgba(176,120,72,0.25)] text-[#8A9BB0] hover:text-[#F5F0E8] hover:bg-[#1A3348]/40"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveNotes}
              disabled={savingNote}
              className="bg-[#B07848] hover:bg-[#B07848]/90 text-[#F5F0E8] font-medium tracking-wide uppercase"
            >
              {savingNote ? "Saving..." : "Save Notes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
