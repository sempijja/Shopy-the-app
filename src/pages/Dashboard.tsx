import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Home, 
  ListOrdered, 
  Package, 
  Bell, 
  User,
  ChevronRight,
  ArrowDown,
  ArrowUp,
  Truck,
  Box
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "@/components/ui/tabs";
import { 
  Drawer, 
  DrawerContent, 
  DrawerTrigger, 
  DrawerClose,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider
} from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import { 
  ChartContainer, 
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";

const Dashboard = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [storeName, setStoreName] = useState<string>("Store");
  const { session } = useAuth();

  // Fetch store name from Supabase
  useEffect(() => {
    const fetchStoreName = async () => {
      if (!session?.user?.id) return;
      const { data, error } = await supabase
        .from("stores")
        .select("store_name")
        .eq("user_id", session.user.id)
        .single();
      if (data?.store_name) setStoreName(data.store_name);
    };
    fetchStoreName();
  }, [session]);

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
    navigate('/login');
  };

  const menuItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "orders", label: "Orders", icon: ListOrdered },
    { id: "products", label: "Products", icon: Package },
    { id: "alerts", label: "Alerts", icon: Bell },
    { id: "profile", label: "Profile", icon: User },
  ];

  const salesData = [
    { day: "M", sales: 5 },
    { day: "T", sales: 17 },
    { day: "W", sales: 5 },
    { day: "T", sales: 55 },
    { day: "F", sales: 30 },
    { day: "S", sales: 42 },
    { day: "S", sales: 3 },
  ];

  const topProducts = [
    { id: 1, name: "Premium T-shirt", pcs: 42, amount: 1680 },
    { id: 2, name: "Designer Jeans", pcs: 38, amount: 3420 },
    { id: 3, name: "Wireless Earbuds", pcs: 27, amount: 2430 },
    { id: 4, name: "Leather Wallet", pcs: 25, amount: 1250 },
    { id: 5, name: "Fitness Tracker", pcs: 23, amount: 2070 },
  ];

  const chartConfig = {
    series: {
      sales: {
        label: "Sales",
        theme: {
          light: "#9b87f5",
          dark: "#9b87f5",
        }
      }
    }
  };

  const renderTabContent = (tabId) => {
    switch (tabId) {
      case "home":
        return (
          <div className="space-y-6 max-w-lg mx-auto">
            {/* User Info */}
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{storeName}</h2>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-muted-foreground text-sm">Sales</span>
                    </div>
                    <div className="text-2xl font-bold">30,000</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-muted-foreground text-sm">Orders</span>
                    </div>
                    <div className="text-2xl font-bold">20</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Responsive Chart */}
            <div className="w-full" style={{ height: isMobile ? 220 : 288 }}>
              <ChartContainer config={chartConfig.series}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <CartesianGrid vertical={false} stroke="#eee" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#9b87f5" 
                      strokeWidth={2} 
                      dot={{ r: 4, fill: "#9b87f5" }}
                      activeDot={{ r: 6, fill: "#9b87f5" }}
                      name="sales"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>

            {/* Tables */}
            <div className="space-y-6">
              <Card className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
                  <CardTitle className="text-lg">Sales Summary</CardTitle>
                  <Button variant="ghost" className="text-primary p-1 h-auto">
                    <span className="mr-1">Expand</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="py-2 pl-0">
                          <div className="flex items-center gap-2">
                            <ListOrdered className="h-4 w-4 text-muted-foreground" />
                            <span>Orders</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-2 text-right">Value</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="py-2 pl-0">
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-muted-foreground" />
                            <span>Delivered</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-2 text-right">Value</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="py-2 pl-0">
                          <div className="flex items-center gap-2">
                            <Box className="h-4 w-4 text-muted-foreground" />
                            <span>Products</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-2 text-right">Value</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
                  <CardTitle className="text-lg">Top Products</CardTitle>
                  <Button variant="ghost" className="text-primary p-1 h-auto">
                    <span className="mr-1">View All</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <Table>
                    <TableBody>
                      {topProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="py-2 pl-0">
                            <div>
                              {product.name}
                              <div className="text-xs text-muted-foreground">
                                Pcs {product.pcs}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-2 text-right">${product.amount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "orders":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Orders</CardTitle>
              <CardDescription>Manage your customer orders</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center min-h-[200px]">
              <p className="text-muted-foreground">No orders yet</p>
            </CardContent>
          </Card>
        );
      case "products":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>Manage your store products</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center min-h-[200px]">
              <p className="text-muted-foreground">No products yet</p>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  const renderMobileLayout = () => (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Main Content Area with padding bottom for nav bar */}
      <main className="flex-1 pb-16">
        <div className="container px-4 py-6 mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {menuItems.map((item) => (
              <TabsContent key={item.id} value={item.id}>
                {renderTabContent(item.id)}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>

      {/* Fixed Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
        <div className="flex items-center justify-around h-16">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === "products") {
                    navigate("/products");
                  } else {
                    setActiveTab(item.id);
                  }
                }}
                className={`flex flex-col items-center justify-center flex-1 h-full px-2 ${
                  activeTab === item.id ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );

  const renderDesktopLayout = () => (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => {
                      if (item.id === "products") {
                        navigate("/products");
                      } else {
                        setActiveTab(item.id);
                      }
                    }}
                    isActive={activeTab === item.id}
                  >
                    <item.icon className="mr-2" />
                    {item.label}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 overflow-auto p-6">
          {renderTabContent(activeTab)}
        </div>
      </div>
    </SidebarProvider>
  );

  return isMobile ? renderMobileLayout() : renderDesktopLayout();
};

export default Dashboard;