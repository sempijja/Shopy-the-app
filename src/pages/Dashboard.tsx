
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Home, 
  ShoppingCart, 
  Package, 
  Bell, 
  User,
  Menu
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

  const renderTabContent = (tabId) => {
    switch (tabId) {
      case "home":
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Today's Sales</CardTitle>
                <CardDescription>Your store's performance today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$0.00</div>
                <p className="text-muted-foreground text-sm">No orders yet today</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
                  <Package className="h-5 w-5" />
                  <span>Add Product</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span>View Orders</span>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Store Completion</CardTitle>
                <CardDescription>Complete these steps to set up your store</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <span>Complete your profile</span>
                    </div>
                    <Button variant="ghost" size="sm">Do it</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <Package className="h-4 w-4 text-primary" />
                      </div>
                      <span>Add your first product</span>
                    </div>
                    <Button variant="ghost" size="sm">Do it</Button>
                  </div>
                </div>
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
