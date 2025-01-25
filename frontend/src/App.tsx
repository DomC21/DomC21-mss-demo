import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Twitter, Linkedin, Github } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background font-sans antialiased">
          <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold tracking-tight text-primary">MSS</span>
              </div>
              <div className="flex gap-6 md:gap-8 lg:gap-10">
                <Link 
                  to="/" 
                  className="flex items-center space-x-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
                >
                  Order Intake
                </Link>
                <Link 
                  to="/admin" 
                  className="flex items-center space-x-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
                >
                  Admin Dashboard
                </Link>
                <Link 
                  to="/customer" 
                  className="flex items-center space-x-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
                >
                  Customer Portal
                </Link>
                <Link 
                  to="/contractor" 
                  className="flex items-center space-x-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
                >
                  Contractor Portal
                </Link>
              </div>
            </div>
          </nav>
          <main>
            <div className="relative">
              <div className="container py-20 md:py-24 lg:py-32">
                <div className="mx-auto max-w-[800px] text-center space-y-8">
                  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                    MSS Order Intake & <span className="text-primary">Scheduling</span>
                  </h1>
                  <p className="mx-auto max-w-[600px] text-base md:text-lg text-muted-foreground leading-relaxed">
                    Streamline your moving and scheduling operations with our comprehensive management system. Experience seamless coordination between customers and contractors.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 pt-4">
                    <Link to="/">
                      <Button size="lg" className="w-full sm:w-auto h-12 px-8 shadow-lg hover:shadow-xl transition-all duration-200">
                        Start a New Order
                      </Button>
                    </Link>
                    <Link to="/contractor">
                      <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 shadow-sm hover:shadow-md transition-all duration-200">
                        View Contractor Dashboard
                      </Button>
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mt-16 pt-16 border-t">
                    {[
                      { value: "500+", label: "Active Users" },
                      { value: "10k+", label: "Orders Processed" },
                      { value: "98%", label: "Customer Satisfaction" },
                      { value: "24/7", label: "Support Available" }
                    ].map((stat, index) => (
                      <div key={index} className="text-center">
                        <div className="text-3xl font-bold tracking-tight text-primary">{stat.value}</div>
                        <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-gray-950 dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]"></div>
            </div>

            {/* Features Section */}
            <section className="container py-20 md:py-24">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                  Streamlined Moving Services
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Everything you need to manage your moving operations efficiently
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    title: "Easy Order Management",
                    description: "Simple and intuitive order intake process with real-time status updates.",
                    icon: "📋"
                  },
                  {
                    title: "Smart Scheduling",
                    description: "AI-powered scheduling system that optimizes team assignments and routes.",
                    icon: "🗓️"
                  },
                  {
                    title: "Real-time Updates",
                    description: "Keep customers informed with automated notifications and status tracking.",
                    icon: "🔔"
                  },
                  {
                    title: "Team Management",
                    description: "Efficiently manage contractor schedules and assignments in one place.",
                    icon: "👥"
                  },
                  {
                    title: "Dynamic Pricing",
                    description: "Automated pricing adjustments based on demand and availability.",
                    icon: "💰"
                  },
                  {
                    title: "Performance Analytics",
                    description: "Track key metrics and optimize your operations with detailed insights.",
                    icon: "📊"
                  }
                ].map((feature, index) => (
                  <div key={index} className="group relative bg-background rounded-lg border p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-200">
                    <div className="mb-4 text-2xl">{feature.icon}</div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA Section */}
            <section className="bg-primary/5 border-y">
              <div className="container py-16 md:py-20">
                <div className="max-w-3xl mx-auto text-center space-y-8">
                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Ready to streamline your moving operations?
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Join hundreds of businesses that trust MSS for their scheduling needs.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link to="/">
                      <Button size="lg" className="w-full sm:w-auto h-12 px-8">
                        Get Started Now
                      </Button>
                    </Link>
                    <Link to="/contact">
                      <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8">
                        Contact Sales
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Benefits Section */}
            <section className="container py-20 md:py-24 border-t">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                    Why Choose MSS?
                  </h2>
                  <div className="space-y-6">
                    {[
                      {
                        title: "Increased Efficiency",
                        description: "Reduce manual scheduling work by up to 75% with our automated system."
                      },
                      {
                        title: "Better Customer Experience",
                        description: "Keep customers informed and happy with real-time updates and transparent pricing."
                      },
                      {
                        title: "Optimized Operations",
                        description: "Make data-driven decisions with comprehensive analytics and reporting."
                      }
                    ].map((benefit, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="h-6 w-6 mt-1 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                          ✓
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">{benefit.title}</h3>
                          <p className="text-muted-foreground">{benefit.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8">
                    <Link to="/">
                      <Button size="lg" className="h-12">Get Started Today →</Button>
                    </Link>
                  </div>
                </div>
                <div className="lg:pl-12">
                  <div className="aspect-square rounded-lg bg-muted/30 p-8 flex items-center justify-center">
                    <div className="text-6xl">🚚</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="border-t">
              <div className="container py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="space-y-4">
                    <div className="text-lg font-semibold tracking-tight text-primary">MSS</div>
                    <p className="text-sm text-muted-foreground">
                      Professional moving and scheduling solutions for modern businesses.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-4">Services</h3>
                    <ul className="space-y-2">
                      <li>
                        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                          Moving Services
                        </Link>
                      </li>
                      <li>
                        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                          Packing Services
                        </Link>
                      </li>
                      <li>
                        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                          Storage Solutions
                        </Link>
                      </li>
                      <li>
                        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                          Cleaning Services
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Company</h3>
                    <ul className="space-y-2">
                      <li>
                        <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                          About Us
                        </Link>
                      </li>
                      <li>
                        <Link to="/careers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                          Careers
                        </Link>
                      </li>
                      <li>
                        <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                          Contact
                        </Link>
                      </li>
                      <li>
                        <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                          Blog
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Legal</h3>
                    <ul className="space-y-2">
                      <li>
                        <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                          Privacy Policy
                        </Link>
                      </li>
                      <li>
                        <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                          Terms of Service
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                  <p className="text-sm text-muted-foreground">
                    © 2024 MSS. All rights reserved.
                  </p>
                  <div className="flex gap-6">
                    <a 
                      href="#" 
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Twitter"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                    <a 
                      href="#" 
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                    <a 
                      href="#" 
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="GitHub"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            </footer>
            <Routes>
              <Route path="/" element={<OrderIntakeForm />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/customer" element={<CustomerApp />} />
              <Route path="/contractor" element={<ContractorDashboard />} />
            </Routes>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

// Placeholder components - will be implemented in next steps
import { OrderIntakeForm } from './components/order-intake/OrderIntakeForm';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CustomerApp } from './components/customer/CustomerApp';
import { ContractorDashboard } from './components/contractor/ContractorDashboard';

export default App;
