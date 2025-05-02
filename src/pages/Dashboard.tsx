import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Home, 
  ShoppingCart, 
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

const Dashboard = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    // In a real app, this would include actual logout logic
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
    navigate('/login');
  };

  const menuItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "products", label: "Products", icon: Package },
    { id: "alerts", label: "Alerts", icon: Bell },
    { id: "profile", label: "Profile", icon: User },
  ];

  // Mock data for sales chart
  const salesData = [
    { day: "M", sales: 5 },
    { day: "T", sales: 17 },
    { day: "W", sales: 5 },
    { day: "T", sales: 55 },
    { day: "F", sales: 30 },
    { day: "S", sales: 42 },
    { day: "S", sales: 3 },
  ];

  // Mock data for top products
  const topProducts = [
    { id: 1, name: "Premium T-shirt", pcs: 42, amount: 1680 },
    { id: 2, name: "Designer Jeans", pcs: 38, amount: 3420 },
    { id: 3, name: "Wireless Earbuds", pcs: 27, amount: 2430 },
    { id: 4, name: "Leather Wallet", pcs: 25, amount: 1250 },
    { id: 5, name: "Fitness Tracker", pcs: 23, amount: 2070 },
  ];

  // Chart configuration
  const chartConfig = {
    sales: {
      color: "#9b87f5",
      theme: {
        light: "#9b87f5",
        dark: "#9b87f5",
      },
      label: "Sales",
    },
  };

  const renderTabContent = (tabId) => {
    switch (tabId) {
      case "home":
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Charz Store</h2>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="text-muted-foreground">Last 7 days</div>
              </div>
            </div>

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

            <div className="h-72 w-full">
              <ChartContainer config={chartConfig} className="h-full">
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
              </ChartContainer>
            </div>

            <Card>
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
                          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
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
                          <span>Pick-ups</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-2 text-right">Value</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-lg">Top products sold</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-0 py-2">Product</TableHead>
                      <TableHead className="text-right py-2">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
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
      case "alerts":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Alerts</CardTitle>
              <CardDescription>View important notifications</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center min-h-[200px]">
              <p className="text-muted-foreground">No new alerts</p>
            </CardContent>
          </Card>
        );
      case "profile":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">Name</span>
                <span className="text-muted-foreground">Store Owner</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">Email</span>
                <span className="text-muted-foreground">owner@example.com</span>
              </div>
              <Button variant="outline" className="mt-4" onClick={handleLogout}>
                Logout
              </Button>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  const renderMobileLayout = () => (
    <div className="flex flex-col h-screen">
      <main className="flex-1 overflow-auto p-4 pb-20">
        <div className="max-w-lg mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {menuItems.map((item) => (
              <TabsContent key={item.id} value={item.id}>
                {renderTabContent(item.id)}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
      
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-10">
        <TabsList className="w-full h-16 bg-background rounded-none justify-between">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <TabsTrigger 
                key={item.id} 
                value={item.id}
                className="flex flex-col items-center py-2 flex-1 data-[state=active]:bg-transparent"
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </div>
    </div>
  );

  const renderDesktopLayout = () => (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarHeader className="flex items-center h-14 px-4 border-b">
            <span className="text-xl font-bold">Shopy</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton 
                      onClick={() => setActiveTab(item.id)}
                      isActive={activeTab === item.id}
                    >
                      <Icon className="mr-2" />
                      {item.label}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            {renderTabContent(activeTab)}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );

  // Render either mobile or desktop layout based on screen size
  return isMobile ? renderMobileLayout() : renderDesktopLayout();
};

export default Dashboard;
