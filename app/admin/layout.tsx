"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  Search,
  Menu,
  Bell,
  X,
  Mail,
  ShoppingBag,
  Package,
  UserPlus,
  UserCircle
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Notification {
  id: string;
  type: "order" | "signup";
  message: string;
  time: Date;
  isRead: boolean;
  link: string;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  // UI States
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Notifications State
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const router = useRouter();
  const pathname = usePathname();

  // Load time to ignore initial burst of data
  const loadTime = useRef(new Date());

  const addNotification = (notif: Notification) => {
    setNotifications(prev => [notif, ...prev].slice(0, 10)); // Keep last 10
    setUnreadCount(prev => prev + 1);
  };

  useEffect(() => {
    const rawAdminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "delaphingcompany@gmail.com,sudeepacharjeegp@gmail.com";
    const allowedAdmins = rawAdminEmails
      .toLowerCase()
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);

    // Ensure both essential admin emails are always permitted
    if (!allowedAdmins.includes("delaphingcompany@gmail.com")) allowedAdmins.push("delaphingcompany@gmail.com");
    if (!allowedAdmins.includes("sudeepacharjeegp@gmail.com")) allowedAdmins.push("sudeepacharjeegp@gmail.com");
    
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      const userEmail = currentUser?.email?.toLowerCase().trim();
      if (!currentUser && pathname !== "/admin/login") {
        router.push("/admin/login");
      } else if (currentUser && pathname !== "/admin/login" && (!userEmail || !allowedAdmins.includes(userEmail))) {
        signOut(auth).then(() => {
          router.push("/admin/login?error=unauthorized");
        });
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, [router, pathname]);

  // Notifications logic
  useEffect(() => {
    if (!user || pathname === "/admin/login") return;

    // Listen for new orders
    const qOrders = query(collection(db, "orders"), orderBy("createdAt", "desc"), limit(5));
    const unsubOrders = onSnapshot(qOrders, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const data = change.doc.data();
          if (data.createdAt && data.createdAt.toDate() > loadTime.current) {
            addNotification({
              id: change.doc.id,
              type: "order",
              message: `New order from ${data.customerDetails?.name || 'Customer'}`,
              time: data.createdAt.toDate(),
              isRead: false,
              link: "/admin/orders"
            });
          }
        }
      });
    });

    // Listen for new signups
    const qSignups = query(collection(db, "signups"), orderBy("createdAt", "desc"), limit(5));
    const unsubSignups = onSnapshot(qSignups, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const data = change.doc.data();
          if (data.createdAt && data.createdAt.toDate() > loadTime.current) {
            addNotification({
              id: change.doc.id,
              type: "signup",
              message: `New signup: ${data.name}`,
              time: data.createdAt.toDate(),
              isRead: false,
              link: "/admin/signups"
            });
          }
        }
      });
    });

    return () => {
      unsubOrders();
      unsubSignups();
    };
  }, [user, pathname]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  const markAllRead = () => {
    setUnreadCount(0);
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setNotificationsOpen(false);
  };

  // Search Logic (Basic routing)
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.toLowerCase();
    if (q.includes("mail")) router.push("/admin/mail");
    else if (q.includes("set")) router.push("/admin/settings");
    else if (q.includes("ord")) router.push("/admin/orders");
    else if (q.includes("prod")) router.push("/admin/product");
    else if (q.includes("user")) router.push("/admin/users");
    else if (q.includes("sign")) router.push("/admin/signups");
    else router.push("/admin");
    setSearchQuery("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#240608] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#FFDE59] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If on login page, don't show the dashboard layout
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!user) return null;

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Product", href: "/admin/product", icon: Package },
    { name: "Users", href: "/admin/users", icon: UserCircle },
    { name: "Signups", href: "/admin/signups", icon: Users },
    { name: "Mail", href: "/admin/mail", icon: Mail },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#240608] flex overflow-hidden font-sans">
      
      {/* Mobile Sidebar Overlay */}
      {!sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(true)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 bg-[#3D0F13] border-r border-[#62161A] transition-all duration-300 ease-in-out flex flex-col shrink-0 md:relative shadow-2xl
          ${sidebarOpen ? "w-64 translate-x-0" : "w-20 -translate-x-full md:translate-x-0"}
        `}
      >
        <div className={`h-16 flex items-center border-b border-[#62161A] overflow-hidden ${sidebarOpen ? 'px-5 justify-between' : 'justify-center'}`}>
          {sidebarOpen ? (
            <div className="flex items-center gap-2.5">
              <Link href="/admin" className="relative w-[110px] h-[32px] block">
                <Image
                  src="/logomain.svg"
                  alt="The Laphing Co."
                  fill
                  className="object-contain object-left"
                  priority
                />
              </Link>
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#FFDE59] text-[#741117] shadow-sm">
                Admin
              </span>
            </div>
          ) : (
            <Link href="/admin" className="text-2xl font-black text-[#FFDE59]">
              L
            </Link>
          )}
          
          <button 
            className={`md:hidden text-yellow-100/70 hover:text-white ${!sidebarOpen ? 'hidden' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                title={!sidebarOpen ? item.name : undefined}
                className={`flex items-center gap-3 py-2.5 rounded-xl transition-all duration-200 ${
                  sidebarOpen ? 'px-3.5' : 'justify-center px-0'
                } ${
                  isActive 
                    ? "bg-[#FFDE59] text-[#741117] font-bold shadow-md shadow-[#FFDE59]/20" 
                    : "text-yellow-100/75 hover:text-[#FFDE59] hover:bg-[#520C11]/70"
                }`}
              >
                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-[#741117]" : "text-yellow-100/70"}`} />
                {sidebarOpen && <span className="whitespace-nowrap text-sm tracking-wide">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden transition-all duration-300 ease-in-out">
        {/* Top bar */}
        <header className="h-16 bg-[#3D0F13]/90 backdrop-blur-md border-b border-[#62161A] flex items-center justify-between px-4 sm:px-6 shrink-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="text-yellow-100/80 hover:text-[#FFDE59] p-1.5 rounded-lg hover:bg-[#520C11]/50 transition-colors"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle Sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <form onSubmit={handleSearch} className="hidden sm:flex items-center relative">
              <Search className="w-4 h-4 text-yellow-200/50 absolute left-3 pointer-events-none" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders, signups, users..." 
                className="bg-[#240608] border border-[#62161A] rounded-full pl-10 pr-4 py-1.5 text-sm text-yellow-50 placeholder-yellow-100/40 focus:outline-none focus:border-[#FFDE59] focus:ring-1 focus:ring-[#FFDE59] transition-all w-64 md:w-80"
              />
            </form>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 relative">
            
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setProfileDropdownOpen(false);
                }}
                className={`relative p-2 transition-colors rounded-full ${
                  notificationsOpen 
                    ? 'bg-[#520C11] text-[#FFDE59]' 
                    : 'text-yellow-100/80 hover:text-[#FFDE59] hover:bg-[#520C11]/60'
                }`}
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#FFDE59] rounded-full border-2 border-[#3D0F13]"></span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[#3D0F13] border border-[#741B20] rounded-2xl shadow-2xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-[#62161A] flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">Notifications</h3>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-xs text-[#FFDE59] hover:underline font-semibold">
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-sm text-yellow-100/50">
                        No new notifications.
                      </div>
                    ) : (
                      notifications.map((notif, idx) => (
                        <Link 
                          key={idx} 
                          href={notif.link}
                          onClick={() => setNotificationsOpen(false)}
                          className={`flex items-start gap-3 p-4 hover:bg-[#520C11]/50 transition-colors border-b border-[#62161A]/50 last:border-0 ${!notif.isRead ? 'bg-[#520C11]/30' : ''}`}
                        >
                          <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${notif.type === 'order' ? 'bg-[#FFDE59]/20 text-[#FFDE59]' : 'bg-emerald-500/20 text-emerald-300'}`}>
                            {notif.type === 'order' ? <Package className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="text-sm text-yellow-50">{notif.message}</p>
                            <p className="text-xs text-yellow-100/50 mt-1">{notif.time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setProfileDropdownOpen(!profileDropdownOpen);
                  setNotificationsOpen(false);
                }}
                className="w-9 h-9 rounded-full bg-[#FFDE59] border-2 border-[#FFE58A] flex items-center justify-center text-sm font-extrabold text-[#741117] hover:scale-105 transition-transform cursor-pointer shadow-md focus:outline-none"
              >
                {user.email ? user.email[0].toUpperCase() : 'A'}
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-[#3D0F13] border border-[#741B20] rounded-2xl shadow-2xl py-2 z-50">
                  <div className="px-4 py-3 border-b border-[#62161A]">
                    <p className="text-sm font-bold text-white truncate">{user.email}</p>
                    <p className="text-xs text-[#FFDE59] font-medium mt-0.5">Administrator</p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-red-300 hover:text-red-200 hover:bg-red-500/20 rounded-xl transition-colors font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-[#240608]" onClick={() => {
          if (profileDropdownOpen) setProfileDropdownOpen(false);
          if (notificationsOpen) setNotificationsOpen(false);
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}
