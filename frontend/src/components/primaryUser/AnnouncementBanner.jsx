
// import { useEffect, useState } from "react";
// import { Megaphone, AlertOctagon, CalendarDays, FileText, Bell, User, Clock } from "lucide-react";

// /**
//  * AnnouncementBanner — a single, dynamic internal company announcement.
//  * Designed to sit as a normal element in an existing dashboard: same
//  * radius, border, and shadow weight as the rest of the app's cards.
//  */

// const TYPE_STYLES = {
//   urgent: {
//     icon: AlertOctagon,
//     accentBar: "bg-red-500",
//     chipBg: "bg-red-50",
//     chipText: "text-red-600",
//     label: "text-red-600",
//     pillBorder: "border-red-200",
//     pillText: "text-red-700",
//     metaText: "text-slate-500",
//   },
//   event: {
//     icon: CalendarDays,
//     accentBar: "bg-violet-500",
//     chipBg: "bg-violet-50",
//     chipText: "text-violet-600",
//     label: "text-violet-600",
//     pillBorder: "border-violet-200",
//     pillText: "text-violet-700",
//     metaText: "text-slate-500",
//   },
//   policy: {
//     icon: FileText,
//     accentBar: "bg-slate-500",
//     chipBg: "bg-slate-100",
//     chipText: "text-slate-600",
//     label: "text-slate-600",
//     pillBorder: "border-slate-200",
//     pillText: "text-slate-700",
//     metaText: "text-slate-500",
//   },
//   general: {
//     icon: Bell,
//     accentBar: "bg-amber-500",
//     chipBg: "bg-amber-50",
//     chipText: "text-amber-600",
//     label: "text-amber-600",
//     pillBorder: "border-amber-200",
//     pillText: "text-amber-700",
//     metaText: "text-slate-500",
//   },
// };

// // Replace with a real API call, e.g.:
// // const res = await fetch("/api/staff/announcement/active");
// // return res.json(); // return null when nothing is active
// async function fetchAnnouncement() {
//   return {
//     type: "general",
//     title: "Scheduled Maintenance",
//     detail: "System will be briefly unavailable — please save your work.",
//     badge: "Sun, 10:00 PM – 11:30 PM",
//     postedBy: "IT Team",
//   };
// }

// export default function AnnouncementBanner({ announcement: announcementProp }) {
//   const [announcement, setAnnouncement] = useState(announcementProp ?? null);
//   const [loading, setLoading] = useState(!announcementProp);

//   useEffect(() => {
//     if (announcementProp) return;
//     let cancelled = false;
//     setLoading(true);
//     fetchAnnouncement()
//       .then((data) => {
//         if (!cancelled) setAnnouncement(data);
//       })
//       .finally(() => {
//         if (!cancelled) setLoading(false);
//       });
//     return () => {
//       cancelled = true;
//     };
//   }, [announcementProp]);

//   if (loading) return null;
//   if (!announcement) return null;

//   const style = TYPE_STYLES[announcement.type] ?? TYPE_STYLES.general;
//   const Icon = style.icon;

//   return (
//     <div
//       role="status"
//       className="relative flex h-11 w-full items-stretch overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
//     >
//       <div className={`w-1 flex-none ${style.accentBar}`} />

//       <div className="flex flex-none items-center gap-2 border-r border-slate-100 px-4">
//         <span className={`flex h-6 w-6 flex-none items-center justify-center rounded-md ${style.chipBg}`}>
//           <Icon className={`h-3.5 w-3.5 ${style.chipText}`} strokeWidth={2.25} />
//         </span>
//         <span className={`hidden text-[11px] font-semibold uppercase tracking-wider sm:inline ${style.label}`}>
//           Notice
//         </span>
//       </div>

//       <div className="group relative flex-1 overflow-hidden">
//         <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent" />

//         <div className="ticker-track absolute inset-y-0 flex items-center gap-16 whitespace-nowrap will-change-transform group-hover:[animation-play-state:paused]">
//           <AnnouncementContent item={announcement} style={style} />
//           <AnnouncementContent item={announcement} style={style} ariaHidden />
//         </div>
//       </div>

//       <style>{`
//         .ticker-track {
//           animation: ticker-scroll 22s linear infinite;
//         }
//         @keyframes ticker-scroll {
//           from { transform: translateX(0); }
//           to { transform: translateX(-50%); }
//         }
//         @media (prefers-reduced-motion: reduce) {
//           .ticker-track {
//             animation: none;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// function AnnouncementContent({ item, style, ariaHidden }) {
//   return (
//     <div className="flex items-center gap-2.5" aria-hidden={ariaHidden || undefined}>
//       <span className="text-[13px] font-semibold text-slate-800">{item.title}</span>

//       {item.detail && (
//         <>
//           <span className="text-slate-300">•</span>
//           <span className="text-[13px] text-slate-500">{item.detail}</span>
//         </>
//       )}

//       {item.badge && (
//         <span
//           className={`inline-flex flex-none items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium ${style.pillBorder} ${style.pillText}`}
//         >
//           <Clock className="h-3 w-3" strokeWidth={2.25} />
//           {item.badge}
//         </span>
//       )}

//       {item.postedBy && (
//         <span className={`inline-flex flex-none items-center gap-1 text-[11px] font-medium ${style.metaText}`}>
//           <User className="h-3 w-3" strokeWidth={2.25} />
//           {item.postedBy}
//         </span>
//       )}
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { AlertOctagon, CalendarDays, FileText, Bell, User, Clock, X } from "lucide-react";

/**
 * AnnouncementBanner — a single, dynamic internal company announcement.
 *
 * Integration notes:
 * - Place this INSIDE the white content card area of the dashboard (same
 *   container as the search/filter toolbar), not in the pale gap above it —
 *   it's designed to sit flush against that white background.
 * - The left label chip uses the app's dark navbar tone (#1e2530) so it
 *   visually pairs with the top nav, not just the cards below.
 *
 * Pass the announcement as a prop, or leave the prop out and it will call
 * `fetchAnnouncement` (stub below) — replace with your real endpoint.
 *
 * Announcement shape:
 * {
 *   id: string | number,   // used to reset dismissal when a new notice posts
 *   type: "urgent" | "event" | "policy" | "general",
 *   title: string,
 *   detail: string,
 *   badge?: string,
 *   postedBy?: string,
 * }
 */

const TYPE_STYLES = {
  urgent: {
    icon: AlertOctagon,
    accentBar: "bg-red-500",
    chipText: "text-red-400",
    pillBorder: "border-red-200",
    pillText: "text-red-700",
  },
  event: {
    icon: CalendarDays,
    accentBar: "bg-violet-500",
    chipText: "text-violet-400",
    pillBorder: "border-violet-200",
    pillText: "text-violet-700",
  },
  policy: {
    icon: FileText,
    accentBar: "bg-slate-400",
    chipText: "text-slate-400",
    pillBorder: "border-slate-200",
    pillText: "text-slate-700",
  },
  general: {
    icon: Bell,
    accentBar: "bg-amber-500",
    chipText: "text-amber-400",
    pillBorder: "border-amber-200",
    pillText: "text-amber-700",
  },
};

// Replace with a real API call, e.g.:
// const res = await fetch("/api/staff/announcement/active");
// return res.json(); // return null when nothing is active
async function fetchAnnouncement() {
  return {
    id: "maint-2026-07-13",
    type: "general",
    title: "Scheduled Maintenance",
    detail: "System will be briefly unavailable — please save your work.",
    badge: "Sun, 10:00 PM – 11:30 PM",
    postedBy: "IT Team",
  };
}

export default function AnnouncementBanner({ announcement: announcementProp }) {
  const [announcement, setAnnouncement] = useState(announcementProp ?? null);
  const [loading, setLoading] = useState(!announcementProp);
  const [dismissedId, setDismissedId] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (announcementProp) return;
    let cancelled = false;
    setLoading(true);
    fetchAnnouncement()
      .then((data) => {
        if (!cancelled) setAnnouncement(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [announcementProp]);

  // Small entrance animation on first paint only
  useEffect(() => {
    if (!loading && announcement) {
      const t = requestAnimationFrame(() => setMounted(true));
      return () => cancelAnimationFrame(t);
    }
  }, [loading, announcement]);

  if (loading) return null;
  if (!announcement) return null;
  if (dismissedId === announcement.id) return null;

  const style = TYPE_STYLES[announcement.type] ?? TYPE_STYLES.general;
  const Icon = style.icon;

  return (
    <div
      role="status"
      className={`relative flex h-11 w-full items-stretch overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-all duration-300 ease-out ${
        mounted ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
      }`}
    >
      {/* Severity accent bar */}
      <div className={`w-1 flex-none ${style.accentBar}`} />

      {/* Label — echoes the dark top nav */}
      <div className="flex flex-none items-center gap-2 bg-[#1e2530] px-4">
        <Icon className={`h-3.5 w-3.5 flex-none ${style.chipText}`} strokeWidth={2.25} />
        <span className="hidden text-[11px] font-semibold uppercase tracking-wider text-slate-200 sm:inline">
          Notice
        </span>
      </div>

      {/* Scrolling track */}
      <div className="group relative flex-1 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent" />

        <div className="ticker-track absolute inset-y-0 flex items-center gap-16 whitespace-nowrap will-change-transform group-hover:[animation-play-state:paused]">
          <AnnouncementContent item={announcement} style={style} />
          <AnnouncementContent item={announcement} style={style} ariaHidden />
        </div>
      </div>

    

      <style>{`
        .ticker-track {
          animation: ticker-scroll 22s linear infinite;
        }
        @keyframes ticker-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ticker-track {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

function AnnouncementContent({ item, style, ariaHidden }) {
  return (
    <div className="flex items-center gap-2.5 px-4" aria-hidden={ariaHidden || undefined}>
      <span className="text-[13px] font-semibold text-slate-800">{item.title}</span>

      {item.detail && (
        <>
          <span className="text-slate-300">•</span>
          <span className="text-[13px] text-slate-500">{item.detail}</span>
        </>
      )}

      {item.badge && (
        <span
          className={`inline-flex flex-none items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium ${style.pillBorder} ${style.pillText}`}
        >
          <Clock className="h-3 w-3" strokeWidth={2.25} />
          {item.badge}
        </span>
      )}

      {item.postedBy && (
        <span className="inline-flex flex-none items-center gap-1 text-[11px] font-medium text-slate-400">
          <User className="h-3 w-3" strokeWidth={2.25} />
          {item.postedBy}
        </span>
      )}
    </div>
  );
}